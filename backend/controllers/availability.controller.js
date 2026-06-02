// backend/controllers/availabilityController.js
const Booking = require("../models/booking.model");
const Service = require("../models/service.model");
const Staff = require("../models/staff.model");

class AvailabilityController {
  // @desc    Get available time slots for a staff member on a specific date
  // @route   GET /api/availability/:staffId?date=YYYY-MM-DD&serviceId=xxx
  // @access  Public
  async httpGetAvailableSlots(req, res) {
    try {
      const { staffId } = req.params;
      const { date, serviceId } = req.query;

      if (!date || !serviceId) {
        return res.status(400).json({
          success: false,
          message: "Both date and serviceId are required",
        });
      }

      // 1. Get service details (for duration)
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      const slotDuration = service.duration; // in minutes

      // 2. Get staff schedule for that day
      const staff = await Staff.findById(staffId);
      if (!staff) {
        return res.status(404).json({
          success: false,
          message: "Staff not found",
        });
      }

      // Get day of week (0 = Sunday, 1 = Monday, etc.)
      const targetDate = new Date(date);
      const dayNames = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const dayOfWeek = dayNames[targetDate.getDay()];
      const schedule = staff.schedule[dayOfWeek];

      // Check if staff works on this day
      if (!schedule.isWorking) {
        return res.json({
          success: true,
          date,
          staffName: staff.name,
          isWorking: false,
          message: "Staff does not work on this day",
          availableSlots: [],
        });
      }

      // 3. Get existing bookings for this staff on this date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const existingBookings = await Booking.find({
        staffId,
        date: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ["pending", "confirmed"] },
      });

      // 4. Generate available time slots
      const slots = [];
      let currentTime = new Date(`${date}T${schedule.start}:00`);
      const workEnd = new Date(`${date}T${schedule.end}:00`);
      const breakStart = new Date(`${date}T${schedule.breakStart}:00`);
      const breakEnd = new Date(`${date}T${schedule.breakEnd}:00`);

      // Loop through the day in slotDuration increments
      while (currentTime < workEnd) {
        const slotEnd = new Date(currentTime.getTime() + slotDuration * 60000);

        // Skip if slot would end after work hours
        if (slotEnd > workEnd) {
          break;
        }

        // Skip if during lunch break
        if (currentTime < breakEnd && slotEnd > breakStart) {
          currentTime = new Date(breakEnd);
          continue;
        }

        // Check if this slot conflicts with any existing booking
        let isAvailable = true;
        let conflictingBooking = null;

        for (const booking of existingBookings) {
          const bookingStart = new Date(booking.date);
          const bookingEnd = new Date(
            bookingStart.getTime() + booking.duration * 60000,
          );

          // Overlap check
          if (currentTime < bookingEnd && slotEnd > bookingStart) {
            isAvailable = false;
            conflictingBooking = booking;
            break;
          }
        }

        if (isAvailable) {
          slots.push({
            start: currentTime,
            end: slotEnd,
            time: currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            timestamp: currentTime.toISOString(),
          });
        }

        // Move to next slot
        currentTime = slotEnd;
      }

      res.json({
        success: true,
        date,
        staffName: staff.name,
        serviceName: service.name,
        serviceDuration: slotDuration,
        isWorking: true,
        workingHours: `${schedule.start} - ${schedule.end}`,
        breakTime: `${schedule.breakStart} - ${schedule.breakEnd}`,
        totalSlotsGenerated: slots.length,
        availableSlots: slots,
      });
    } catch (error) {
      console.error("Availability error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // @desc    Get staff schedule for a specific date (admin view)
  // @route   GET /api/availability/staff/:staffId/schedule?date=YYYY-MM-DD
  // @access  Private (Admin only)
  async httpGetStaffScheduleForDate(req, res) {
    try {
      const { staffId } = req.params;
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          success: false,
          message: "Date is required",
        });
      }

      const staff = await Staff.findById(staffId);
      if (!staff) {
        return res.status(404).json({
          success: false,
          message: "Staff not found",
        });
      }

      const targetDate = new Date(date);
      const dayNames = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const dayOfWeek = dayNames[targetDate.getDay()];
      const schedule = staff.schedule[dayOfWeek];

      // Get existing bookings for that day
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const bookings = await Booking.find({
        staffId,
        date: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ["pending", "confirmed"] },
      })
        .populate("customerId", "name email phone")
        .populate("serviceId", "name duration");

      res.json({
        success: true,
        data: {
          staffName: staff.name,
          date,
          isWorking: schedule.isWorking,
          workingHours: schedule.isWorking
            ? `${schedule.start} - ${schedule.end}`
            : "Day off",
          breakTime: schedule.isWorking
            ? `${schedule.breakStart} - ${schedule.breakEnd}`
            : null,
          bookings: bookings.map((booking) => ({
            id: booking._id,
            time: new Date(booking.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            duration: booking.duration,
            customer: booking.customerId.name,
            service: booking.serviceId.name,
            status: booking.status,
          })),
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

const availabilityController = new AvailabilityController();
module.exports = availabilityController;
