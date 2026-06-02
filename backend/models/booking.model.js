// backend/models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // minutes (from service)
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    depositAmount: {
      type: Number,
      default: 0,
    },
    remainingAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled", "no_show"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "deposit_paid", "fully_paid", "refunded"],
      default: "unpaid",
    },
    customerNotes: {
      type: String,
      maxlength: 500,
      default: "",
    },
    staffNotes: {
      type: String,
      maxlength: 500,
      default: "",
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    reminderSentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for fast queries
bookingSchema.index({ customerId: 1 });
bookingSchema.index({ staffId: 1 });
bookingSchema.index({ serviceId: 1 });
bookingSchema.index({ date: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ date: 1, staffId: 1 }); // Compound index for availability

// Update updatedAt on save
bookingSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
