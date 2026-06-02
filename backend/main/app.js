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

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://salon-booking-saas-kappa.vercel.app", // ← YOUR VERCEL URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
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
