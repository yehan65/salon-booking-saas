// backend/controllers/adminController.js

const Booking = require("../models/booking.model");
const Service = require("../models/service.model");
const Staff = require("../models/staff.model");

class AdminController {
  // ============ SERVICE MANAGEMENT ============

  // @desc    Create a new service
  // @route   POST /api/admin/services
  // @access  Private (Admin only)
  async httpCreateService(req, res) {
    try {
      const { name, description, duration, price, category, isActive } =
        req.body;

      // Check if service already exists
      const existingService = await Service.findOne({ name });
      if (existingService) {
        return res.status(400).json({
          success: false,
          message: "Service with this name already exists",
        });
      }

      const service = new Service({
        name,
        description,
        duration,
        price,
        category: category || "Other",
        isActive: isActive !== undefined ? isActive : true,
      });

      await service.save();

      res.status(201).json({
        success: true,
        message: "Service created successfully",
        data: service,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // @desc    Get all services (admin view)
  // @route   GET /api/admin/services
  // @access  Private (Admin only)
  async httpGetAllService(req, res) {
    try {
      const { category, isActive, search } = req.query;

      let filter = {};
      if (category) {
        filter.category = category;
      }
      if (isActive !== undefined) {
        filter.isActive = isActive === "true";
      }
      if (search) {
        filter.name = { $regex: search, $options: "i" };
      }

      const services = await Service.find(filter).sort({
        category: 1,
        name: 1,
      });

      res.json({
        success: true,
        count: services.length,
        data: services,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // @desc    Get single service by ID
  // @route   GET /api/admin/services/:id
  // @access  Private (Admin only)
  async httpGetServiceById(req, res) {
    try {
      const service = await Service.findById(req.params.id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      res.json({ success: true, data: service });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // @desc    Update service
  // @route   PUT /api/admin/services/:id
  // @access  Private (Admin only)
  async httpUpdateService(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      delete updates._id;

      const service = await Service.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: Date.now() },
        { new: true, runValidators: true },
      );

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      res.json({
        success: true,
        message: "Service updated successfully",
        data: service,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // @desc    Delete service (soft delete)
  // @route   DELETE /api/admin/services/:id
  // @access  Private (Admin only)
  async httpDeleteService(req, res) {
    try {
      const { id } = req.params;

      const service = await Service.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: Date.now() },
        { new: true },
      );

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      res.json({
        success: true,
        message: "Service deactivated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // @desc    Toggle service active status
  // @route   PATCH /api/admin/services/:id/toggle
  // @access  Private (Admin only)
  async httpToggleStatusService(req, res) {
    try {
      const service = await Service.findById(req.params.id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      service.isActive = !service.isActive;
      service.updatedAt = Date.now();
      await service.save();

      res.json({
        success: true,
        message: `Service ${service.isActive ? "activated" : "deactivated"}`,
        data: service,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ============ STAFF MANAGEMENT ============

  // @desc    Create new staff member
  // @route   POST /api/admin/staff
  // @access  Private (Admin only)
  async httpCreateStaff(req, res) {
    try {
      const { name, email, phone, role, bio, services, isActive } = req.body;

      const existingStaff = await Staff.findOne({ email });
      if (existingStaff) {
        return res.status(400).json({
          success: false,
          message: "Staff with this email already exists",
        });
      }

      const staff = new Staff({
        name,
        email,
        phone,
        role: role || "hairdresser",
        bio: bio || "",
        services: services || [],
        isActive: isActive !== undefined ? isActive : true,
      });

      await staff.populate("services", "name price duration");

      await staff.save();

      res.status(201).json({
        success: true,
        message: "Staff member created successfully",
        data: staff,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // @desc    Get all staff members
  // @route   GET /api/admin/staff
  // @access  Private (Admin only)
  async httpGetAllStaff(req, res) {
    try {
      const { isActive, role, search } = req.query;

      let filter = {};
      if (isActive !== undefined) {
        filter.isActive = isActive === "true";
      }
      if (role) {
        filter.role = role;
      }
      if (search) {
        filter.name = { $regex: search, $options: "i" };
      }

      const staff = await Staff.find(filter)
        .populate("services", "name price duration")
        .sort({ name: 1 });

      res.json({
        success: true,
        count: staff.length,
        data: staff,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // @desc    Update staff member
  // @route   PUT /api/admin/staff/:id
  // @access  Private (Admin only)
  async httpUpdateStaff(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      delete updates._id;

      const staff = await Staff.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: Date.now() },
        { new: true, runValidators: true },
      ).populate("services", "name price duration");

      if (!staff) {
        return res.status(404).json({
          success: false,
          message: "Staff not found",
        });
      }

      res.json({
        success: true,
        message: "Staff member updated successfully",
        data: staff,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // @desc    Toggle staff active status
  // @route   PATCH /api/admin/staff/:id/toggle
  // @access  Private (Admin only)
  async httpHandleToggle(req, res) {
    try {
      const staff = await Staff.findById(req.params.id);

      if (!staff) {
        return res.status(404).json({
          success: false,
          message: "Staff not found",
        });
      }

      // Optional: Add check before toggling for future bookings
      if (!staff.isActive) {
        // Check if staff has future bookings before deactivating
        const futureBookings = await Booking.findOne({
          staffId: staff._id,
          date: { $gt: new Date() },
          status: { $in: ["pending", "confirmed"] },
        });

        if (futureBookings) {
          return res.status(400).json({
            success: false,
            message:
              "Cannot deactivate staff with future bookings. Reassign or cancel bookings first.",
          });
        }
      }

      staff.isActive = !staff.isActive;
      staff.updatedAt = Date.now();
      await staff.save();

      res.json({
        success: true,
        message: `staff ${staff.isActive ? "activated" : "deactivated"}`,
        data: staff,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // @desc    Delete staff member (soft delete)
  // @route   DELETE /api/admin/staff/:id
  // @access  Private (Admin only)
  async httpDeleteStaff(req, res) {
    try {
      const { id } = req.params;

      // Check if staff has future bookings
      const futureBookings = await Booking.findOne({
        staffId: id,
        date: { $gt: new Date() },
        status: { $in: ["pending", "confirmed"] },
      });

      if (futureBookings) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot deactivate staff with future bookings. Reassign or cancel bookings first.",
        });
      }

      const staff = await Staff.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: Date.now() },
        { new: true },
      );

      if (!staff) {
        return res.status(404).json({
          success: false,
          message: "Staff not found",
        });
      }

      res.json({
        success: true,
        message: "Staff deactivated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ============ BOOKING MANAGEMENT ============

  // @desc    Get all bookings (admin view)
  // @route   GET /api/admin/bookings
  // @access  Private (Admin only)
  async httpGetAllBookings(req, res) {
    try {
      const { date, status, staffId } = req.query;

      let filter = {};

      if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        filter.date = { $gte: startOfDay, $lte: endOfDay };
      }

      if (status) filter.status = status;
      if (staffId) filter.staffId = staffId;

      const bookings = await Booking.find(filter)
        .populate("customerId", "name email phone")
        .populate("staffId", "name")
        .populate("serviceId", "name duration price")
        .sort({ date: 1 });

      return res.json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // @desc    Get today's bookings
  // @route   GET /api/admin/bookings/today
  // @access  Private (Admin only)
  async httpGetTodaysBooking(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const bookings = await Booking.find({
        date: { $gte: today, $lt: tomorrow },
        status: { $in: ["pending", "confirmed"] },
      })
        .populate("customerId", "name email phone")
        .populate("staffId", "name")
        .populate("serviceId", "name duration")
        .sort({ date: 1 });

      const totalRevenue = bookings.reduce(
        (sum, booking) => sum + booking.totalPrice,
        0,
      );

      return res.status(200).json({
        success: true,
        count: bookings.length,
        totalRevenue,
        data: bookings,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // @desc    Get weekly bookings
  // @route   GET /api/admin/bookings/week
  // @access  Private (Admin only)
  async httpGetWeeklyBookings(req, res) {
    try {
      const today = new Date();

      const startOfWeek = new Date(today);
      // startOfWeek.setDate(today.getDate() - today.getDay())
      startOfWeek.setHours(0, 0, 0, 0);

      // Set monday as the start of the week
      const dayOfWeek = today.getDay();
      const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const start = new Date(startOfWeek);
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(start);
      endOfWeek.setDate(start.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const weeklyBookings = await Booking.find({
        date: { $gte: start, $lte: endOfWeek },
        status: { $in: ["confirmed", "pending"] },
      })
        .populate("customerId", "name email phone")
        .populate("staffId", "name")
        .populate("serviceId", "name price duration");

      if (!weeklyBookings) {
        return res
          .status(404)
          .json({ success: false, message: "Oops, No bookings in this week" });
      }

      return res.status(200).json({
        success: true,
        count: weeklyBookings.length,
        data: weeklyBookings,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // @desc    Get monthly bookings
  // @route   GET /api/admin/bookings/month
  // @access  Private (Admin only)
  async httpGetMonthlyBookings(req, res) {
    try {
      const today = new Date();

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      // startOfMonth.setDate(today.getFullYear(), today.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      // endOfMonth.setDate(
      //   startOfMonth.getFullYear(),
      //   startOfMonth.getMonth() + 1,
      //   0,
      // );
      // endOfMonth.setDate(endOfMonth.getDate() + 1);
      endOfMonth.setHours(23, 59, 59, 999);

      const monthBookings = await Booking.find({
        date: { $gte: startOfMonth, $lt: endOfMonth },
        status: { $in: ["confirmed", "pending"] },
      })
        .populate("customerId", "name email phone")
        .populate("staffId", "name")
        .populate("serviceId", "name price duration");

      if (!monthBookings) {
        return res.status(404).json({
          success: false,
          message: "Oops, you do not have any bookings for this month yet.",
        });
      }

      return res.status(200).json({
        success: true,
        count: monthBookings.length,
        data: monthBookings,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // @desc    Update booking status
  // @route   PUT /api/admin/bookings/:id/status
  // @access  Private (Admin only)
  async httpUpdateBookingStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "no_show",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      const booking = await Booking.findByIdAndUpdate(
        id,
        { status, updatedAt: Date.now() },
        { new: true },
      )
        .populate("customerId", "name email")
        .populate("serviceId", "name");

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      res.json({
        success: true,
        message: `Booking marked as ${status}`,
        data: booking,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ============ DASHBOARD STATS ============

  // @desc    Get dashboard statistics
  // @route   GET /api/admin/dashboard/stats
  // @access  Private (Admin only)
  async httpGetDashboardStats(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);

      // Today's stats
      const todayBookings = await Booking.find({
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      });

      const todayRevenue = todayBookings.reduce(
        (sum, b) => sum + b.totalPrice,
        0,
      );
      const todayCount = todayBookings.length;

      // Week's stats
      const weekBookings = await Booking.find({
        date: { $gte: startOfWeek, $lte: endOfWeek },
      });

      const weekRevenue = weekBookings.reduce(
        (sum, b) => sum + b.totalPrice,
        0,
      );
      const weekCount = weekBookings.length;

      // Month's stats
      const monthBookings = await Booking.find({
        date: { $gte: startOfMonth, $lte: endOfMonth },
      });

      const monthRevenue = monthBookings.reduce(
        (sum, b) => sum + b.totalPrice,
        0,
      );
      const monthCount = monthBookings.length;

      // Popular services
      const popularServices = await Booking.aggregate([
        { $group: { _id: "$serviceId", count: { $sum: 1 } } },
        // Rename
        {
          $project: {
            serviceId: "$_id",
            count: 1,
            _id: 0,
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "services",
            localField: "serviceId", // how booking collection hold service id --> serviceId
            foreignField: "_id", // how service hold it's id --> ._id
            as: "service",
          },
        },
        { $unwind: "$service" },
      ]);

      const formattedPopularServices = popularServices.map((item) => ({
        name: item.service.name,
        bookings: item.count,
        revenue: item.count * item.service.price,
      }));

      // Upcoming appointments
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      const upcoming = await Booking.find({
        date: { $gte: today, $lte: nextWeek },
        status: "confirmed",
      })
        .populate("customerId", "name")
        .populate("serviceId", "name")
        .populate("staffId", "name")
        .sort({ date: 1 })
        .limit(10);

      res.json({
        success: true,
        data: {
          today: { revenue: todayRevenue, bookings: todayCount },
          week: { revenue: weekRevenue, bookings: weekCount },
          month: { revenue: monthRevenue, bookings: monthCount },
          popularServices: formattedPopularServices,
          upcoming,
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

const adminController = new AdminController();
module.exports = adminController;
