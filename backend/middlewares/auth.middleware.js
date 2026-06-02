const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function authVerify(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied, No token provided!" });
  }

  try {
    const decode = jwt.verify(token, process.env.jwtPrivateKey);
    console.log("decode: ", decode);

    // const user = await User.findById(decode._id).select('-password');
    // if (!user) {
    //     return res.status(404).json({success: false, message: 'User not found!'})
    // }
    // req.user = user;

    req.user = decode;
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid token", error });
  }
}

module.exports = authVerify;
