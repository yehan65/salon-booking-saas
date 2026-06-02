const express = require("express");
const cors = require("cors");
const methodOverride = require("method-override");
const userRouter = require("../routes/user.route");
const adminController = require("../controllers/admin.controller");
const bookingController = require("../controllers/booking.controller");
const availabilityController = require("../controllers/availability.controller");
const adminRouter = require("../routes/admin.routes");
const bookingRouter = require("../routes/booking.routes");
const availabilityRouter = require("../routes/availability.routes");
const publicRouter = require("../routes/public.routes");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "x-auth-token"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/bookings", bookingRouter);
app.use("/availability", availabilityRouter);
app.use("/public", publicRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

module.exports = app;
