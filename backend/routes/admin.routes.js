const express = require("express");
const authVerify = require("../middlewares/auth.middleware");
const roleVerify = require("../middlewares/role.middleware");
const adminController = require("../controllers/admin.controller");

const adminRouter = express.Router();

// ============ SERVICE MANAGEMENT ROUTES ============
adminRouter.get(
  "/services",
  authVerify,
  roleVerify("admin"),
  adminController.httpGetAllService,
);
adminRouter.get(
  "/services/:id",
  authVerify,
  roleVerify("admin"),
  adminController.httpGetServiceById,
);
adminRouter.post(
  "/new/service",
  authVerify,
  roleVerify("admin"),
  adminController.httpCreateService,
);
adminRouter.put(
  "/services/:id",
  authVerify,
  roleVerify("admin"),
  adminController.httpUpdateService,
);
adminRouter.patch(
  "/services/:id/toggle",
  authVerify,
  roleVerify("admin"),
  adminController.httpToggleStatusService,
);
adminRouter.delete(
  "/services/:id",
  authVerify,
  roleVerify("admin"),
  adminController.httpDeleteService,
);

// ============ STAFF MANAGEMENT ============
adminRouter.get(
  "/staff",
  authVerify,
  roleVerify("admin"),
  adminController.httpGetAllStaff,
);
adminRouter.post(
  "/new/staff",
  authVerify,
  roleVerify("admin"),
  adminController.httpCreateStaff,
);
adminRouter.put(
  "/staff/:id",
  authVerify,
  roleVerify("admin"),
  adminController.httpUpdateStaff,
);
adminRouter.patch(
  "/staff/:id/toggle",
  authVerify,
  roleVerify("admin"),
  adminController.httpHandleToggle,
);
adminRouter.delete(
  "/staff/:id",
  authVerify,
  roleVerify("admin"),
  adminController.httpDeleteStaff,
);

// ============ BOOKING MANAGEMENT ============
adminRouter.get(
  "/bookings",
  authVerify,
  roleVerify("admin"),
  adminController.httpGetAllBookings,
);
adminRouter.get(
  "/bookings/today",
  authVerify,
  roleVerify("admin"),
  adminController.httpGetTodaysBooking,
);

adminRouter.get(
  "/bookings/week",
  authVerify,
  roleVerify("admin"),
  adminController.httpGetWeeklyBookings,
);
adminRouter.get(
  "/bookings/month",
  authVerify,
  roleVerify("admin"),
  adminController.httpGetMonthlyBookings,
);
adminRouter.put(
  "/bookings/:id/status",
  authVerify,
  roleVerify("admin"),
  adminController.httpUpdateBookingStatus,
);

// ============ DASHBOARD STATS ============
adminRouter.get(
  "/dashboard/stats",
  authVerify,
  roleVerify("admin"),
  adminController.httpGetDashboardStats,
);

module.exports = adminRouter;
