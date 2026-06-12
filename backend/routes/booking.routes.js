const express = require("express");
const authVerify = require("../middlewares/auth.middleware");
const adminController = require("../controllers/admin.controller");
const bookingController = require("../controllers/booking.controller");
const roleVerify = require("../middlewares/role.middleware");

const bookingRouter = express.Router();

bookingRouter.get(
  "/my-bookings",
  authVerify,
  roleVerify("customer"),
  bookingController.httpGetMyBookings,
);
bookingRouter.get(
  "/:id",
  authVerify,
  roleVerify("customer", "admin"),
  bookingController.httpGetBookingById,
);
// bookingRouter.post(
//   "/new",
//   authVerify,
//   roleVerify("customer"),
//   bookingController.httpCreateBooking,
// );
bookingRouter.post(
  "/create-payment-intent",
  authVerify,
  roleVerify("customer"),
  bookingController.httpCreateBooking,
);
bookingRouter.put(
  "/:id/cancel",
  authVerify,
  roleVerify("customer", "admin"),
  bookingController.httpCancelBooking,
);
bookingRouter.put(
  "/:id/reschedule",
  authVerify,
  roleVerify("customer"),
  bookingController.httpRescheduleBooking,
);

module.exports = bookingRouter;
