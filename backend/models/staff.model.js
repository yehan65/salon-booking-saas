// backend/models/Staff.js
const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Staff name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    role: {
      type: String,
      enum: [
        "hairdresser",
        "nail_technician",
        "masseuse",
        "esthetician",
        "manager",
      ],
      default: "hairdresser",
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: "",
    },
    // Which services this staff can perform
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    // Working hours schedule
    schedule: {
      monday: {
        isWorking: { type: Boolean, default: true },
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" },
        breakStart: { type: String, default: "13:00" },
        breakEnd: { type: String, default: "14:00" },
      },
      tuesday: {
        isWorking: { type: Boolean, default: true },
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" },
        breakStart: { type: String, default: "13:00" },
        breakEnd: { type: String, default: "14:00" },
      },
      wednesday: {
        isWorking: { type: Boolean, default: true },
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" },
        breakStart: { type: String, default: "13:00" },
        breakEnd: { type: String, default: "14:00" },
      },
      thursday: {
        isWorking: { type: Boolean, default: true },
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" },
        breakStart: { type: String, default: "13:00" },
        breakEnd: { type: String, default: "14:00" },
      },
      friday: {
        isWorking: { type: Boolean, default: true },
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" },
        breakStart: { type: String, default: "13:00" },
        breakEnd: { type: String, default: "14:00" },
      },
      saturday: {
        isWorking: { type: Boolean, default: false },
        start: { type: String, default: "10:00" },
        end: { type: String, default: "15:00" },
        breakStart: { type: String, default: "12:00" },
        breakEnd: { type: String, default: "12:30" },
      },
      sunday: {
        isWorking: { type: Boolean, default: false },
        start: { type: String, default: "10:00" },
        end: { type: String, default: "15:00" },
        breakStart: { type: String, default: "12:00" },
        breakEnd: { type: String, default: "12:30" },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for faster queries
staffSchema.index({ name: 1 });
staffSchema.index({ email: 1 });
staffSchema.index({ isActive: 1 });
staffSchema.index({ services: 1 });

// Update updatedAt on save
staffSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

const Staff = mongoose.model("Staff", staffSchema);
module.exports = Staff;
