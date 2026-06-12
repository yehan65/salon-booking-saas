const express = require("express");
const userController = require("../controllers/user.controller");
const authVerify = require("../middlewares/auth.middleware");
const roleVerify = require("../middlewares/role.middleware");

const userRouter = express.Router();

userRouter.get("/auth/me", authVerify, userController.httpGetMe);
userRouter.get("/auth/verify-email/:token", userController.httpVerifyEmail);
userRouter.post("/auth/register", userController.httpRegister);
userRouter.post("/auth/login", userController.httpLogin);
userRouter.post(
  "/auth/resend-verification",
  userController.httpResendEmailVerification,
);
userRouter.get(
  "/services/popular",
  authVerify,
  roleVerify("customer"),
  userController.httpGetPopularServices,
);

module.exports = userRouter;
