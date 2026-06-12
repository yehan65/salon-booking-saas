const express = require("express");
const webhookController = require("../controllers/webhook.controller");

const webhookRouter = express.Router();

webhookRouter.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  webhookController.handleWebhook,
);

module.exports = webhookRouter;
