// backend/controllers/bookingController.js

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Booking = require("../models/booking.model");
const Service = require("../models/service.model");
const Staff = require("../models/staff.model");
const User = require("../models/user.model");

class BookingController {
  // @desc    Create a new booking
  // @route   POST /api/bookings
  // @access  Private (Customer only)
  async httpCreateBooking(req, res) {
    try {
      const { staffId, serviceId, date, customerNotes } = req.body;
      const customerId = req.user._id;

      const user = await User.findById(customerId);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "Oops, something went wrong." });

      if (!user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: "You must verify your email to place a booking",
        });
      }

      // 1. Get service details
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      // 2. Check if staff exists and offers this service
      const staff = await Staff.findById(staffId);
      if (!staff) {
        return res.status(404).json({
          success: false,
          message: "Staff not found",
        });
      }

      if (!staff.services.includes(serviceId)) {
        return res.status(400).json({
          success: false,
          message: `${staff.name} does not offer this service`,
        });
      }

      // 3. Calculate times
      const bookingDate = new Date(date);
      const bookingEnd = new Date(
        bookingDate.getTime() + service.duration * 60000,
      );

      // 4. Check availability (no overlapping bookings)
      const conflictingBooking = await Booking.findOne({
        staffId,
        status: { $in: ["pending", "confirmed"] },
        date: { $lt: bookingEnd }, // existing booking.start < new booking end
        $expr: {
          $gt: [
            { $add: ["$date", { $multiply: ["$duration", 60000] }] }, //existing.end > new booking start
            bookingDate,
          ],
        },
      });

      if (conflictingBooking) {
        return res.status(400).json({
          success: false,
          message:
            "This time slot is already booked. Please choose another time.",
        });
      }

      // 5. Calculate payment amounts (25% deposit)
      const totalPrice = service.price;
      const depositAmount = totalPrice * 0.25;
      // const remainingAmount = totalPrice - depositAmount;

      // 6. Create booking
      // const booking = new Booking({
      //   customerId,
      //   staffId,
      //   serviceId,
      //   date: bookingDate,
      //   duration: service.duration,
      //   totalPrice,
      //   depositAmount,
      //   remainingAmount,
      //   status: "pending",
      //   paymentStatus: "unpaid",
      //   customerNotes,
      // });

      const paymentIntent = await stripe.paymentIntents.create({
        currency: "usd",
        amount: Math.round(depositAmount * 100),
        metadata: {
          // bookingId: booking._id.toString(),
          customerId: customerId.toString(),
          staffId: staffId,
          serviceId: serviceId,
          date: date,
          customerNotes: customerNotes || "",
          servicePrice: service.price.toString(),
          serviceDuration: service.duration.toString(),
          serviceName: service.name,
        },
      });

      // 7. Populate response
      // const populatedBooking = await Booking.findById(booking._id)
      //   .populate("customerId", "name email phone")
      //   .populate("staffId", "name")
      //   .populate("serviceId", "name duration price");

      //   await booking.save();
      // if (paymentIntent.status === "succeeded") {
      //   booking.paymentIntentId = paymentIntent.id;
      // }
      return res.status(201).json({
        success: true,
        // message: "Booking created successfully!",
        // data: populatedBooking,
        depositAmount: depositAmount,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Booking error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  // @desc    Get customer's own bookings
  // @route   GET /api/my-bookings
  // @access  Private (Customer only)
  async httpGetMyBookings(req, res) {
    try {
      const userId = req.user._id;
      const bookings = await Booking.find({ customerId: userId })
        .populate("staffId", "name")
        .populate("serviceId", "name duration price")
        .sort({ date: -1 });

      res.json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // @desc    Get single booking by ID
  // @route   GET /api/bookings/:id
  // @access  Private (Customer who owns it or Admin)
  async httpGetBookingById(req, res) {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate("customerId", "name email phone")
        .populate("staffId", "name")
        .populate("serviceId", "name duration price");

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      // Check if user is customer who booked OR admin
      if (
        booking.customerId._id.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      res.json({ success: true, data: booking });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // @desc    Cancel booking
  // @route   PUT /api/bookings/:id/cancel
  // @access  Private (Customer who owns it or Admin)
  async httpCancelBooking(req, res) {
    try {
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      // Check permission
      if (
        booking.customerId.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Check if booking is in the past
      if (new Date(booking.date) < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Cannot cancel past appointments",
        });
      }

      booking.status = "cancelled";
      await booking.save();

      res.json({
        success: true,
        message: "Booking cancelled successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  // @desc    Reschedule booking
  // @route   PUT /api/bookings/:id/reschedule
  // @access  Private (Customer who owns it)
  async httpRescheduleBooking(req, res) {
    try {
      const { id } = req.params;
      const { newDate } = req.body;

      // Find the booking
      const booking = await Booking.findById(id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      // Check if user owns this booking
      if (booking.customerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Check if booking is in the past
      if (new Date(booking.date) < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Cannot reschedule past appointments",
        });
      }

      // Calculate new times
      const newBookingDate = new Date(newDate);
      const newBookingEndTime = new Date(
        newBookingDate.getTime() + booking.duration * 60000,
      );

      // Check availability for new time
      const conflictingBooking = await Booking.findOne({
        staffId: booking.staffId,
        status: { $in: ["pending", "confirmed"] },
        _id: { $ne: id },
        date: { $lt: newBookingEndTime },
        $expr: {
          $gt: [
            { $add: ["$date", { $multiply: ["$duration", 60000] }] },
            newBookingDate,
          ],
        },
      });

      if (conflictingBooking) {
        return res.status(400).json({
          success: false,
          message: "New time slot is not available",
        });
      }

      // Update booking
      booking.date = newBookingDate;
      booking.updatedAt = Date.now();
      await booking.save();

      res.json({
        success: true,
        message: "Booking rescheduled successfully",
        data: booking,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

const bookingController = new BookingController();
module.exports = bookingController;
