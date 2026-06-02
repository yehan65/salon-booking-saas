const express = require("express");
const authVerify = require("../middlewares/auth.middleware");
const availabilityController = require("../controllers/availability.controller");
const roleVerify = require("../middlewares/role.middleware");

const availabilityRouter = express.Router();

availabilityRouter.get(
  "/:staffId",
  authVerify,
  availabilityController.httpGetAvailableSlots,
);
availabilityRouter.get(
  "/staff/:staffId/schedule",
  authVerify,
  roleVerify("admin"),
  availabilityController.httpGetStaffScheduleForDate,
);

module.exports = availabilityRouter;
