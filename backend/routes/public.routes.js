const express = require("express");
const authVerify = require("../middlewares/auth.middleware");
const publicController = require("../controllers/public.controller");

const publicRouter = express.Router();

// ---------------SERVICES---------------
publicRouter.get("/services", authVerify, publicController.httpGetAllServices);
publicRouter.get(
  "/service/:id",
  authVerify,
  publicController.httpGetServiceById,
);

// ---------------STAFF----------------
publicRouter.get("/staff", authVerify, publicController.httpGetAllStaff);
publicRouter.get("/staff/:id", authVerify, publicController.httpGetStaffById);

module.exports = publicRouter;
