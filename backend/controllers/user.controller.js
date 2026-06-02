// backend/controllers/user.controller.js

const User = require("../models/user.model");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  sendEmail,
  getVerificationEmailTemplate,
} = require("../utils/sendEmail");

class UserController {
  // @desc    Register user
  // @route   POST /api/auth/register
  // @access  Public
  async httpRegister(req, res) {
    try {
      const { name, email, password, phone, role } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      // Generate email verification token
      // const verificationToken = crypto.randomBytes(32).toString("hex");
      // const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      // Create user
      const user = new User({
        name,
        email,
        password,
        phone,
        role: role || "customer",
        isEmailVerified: true,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      });

      // const verificationURL = `${process.env.FRONTEND_URL}/user/auth/verify-email/${user.emailVerificationToken}`;

      // const emailHTML = getVerificationEmailTemplate(
      //   user.name,
      //   verificationURL,
      // );

      // await sendEmail({
      //   email: user.email,
      //   subject: "Verify Your Email - SalonBooking",
      //   html: emailHTML,
      // });

      // Generate token for auto-login
      const token = user.generateAuthToken();

      await user.save();
      res.status(201).json({
        success: true,
        message: "Registration successful! ",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: true,
          token,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // @desc    Login user
  // @route   POST /api/auth/login
  // @access  Public
  async httpLogin(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide email and password",
        });
      }

      // Find user with password
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check password
      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check if email is verified
      if (!user.isEmailVerified) {
        return res.status(401).json({
          success: false,
          message: "Please verify your email before logging in",
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      // Generate token
      const token = user.generateAuthToken();

      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          token,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // @desc    Verify email
  // @route   GET /api/auth/verify-email/:token
  // @access  Public
  async httpVerifyEmail(req, res) {
    try {
      const { token } = req.params;

      const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired verification link",
        });
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Email verified successfully! You can now login.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // @desc    Resend verification email
  // @route   POST /api/auth/resend-verification
  // @access  Public
  async httpResendEmailVerification(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: "Email already verified",
        });
      }

      // Generate new token
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationExpires = Date.now() + 24 * 60 * 60 * 1000;

      user.emailVerificationToken = verificationToken;
      user.emailVerificationExpires = verificationExpires;
      await user.save();

      const verificationURL = `${process.env.FRONTEND_URL}/user/auth/verify-email/${user.emailVerificationToken}`;

      const emailHTML = getVerificationEmailTemplate(
        user.name,
        verificationURL,
      );

      await sendEmail({
        email: user.email,
        subject: "Verify Your Email - SalonBooking",
        html: emailHTML,
      });

      res.status(200).json({
        success: true,
        message: "Verification email resent. Please check your inbox.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // @desc    Get current user
  // @route   GET /api/auth/me
  // @access  Private
  async httpGetMe(req, res) {
    try {
      const userID = req.user._id;

      const user = await User.findById(userID).select("-password");
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Oops, something went wrong!" });
      }

      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

const userController = new UserController();
module.exports = userController;
