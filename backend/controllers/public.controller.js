const Service = require("../models/service.model");
const Staff = require("../models/staff.model");

class PublicController {
  // @desc    Get all active services (for customers)
  // @route   GET /api/services
  // @access  Public
  async httpGetAllServices(req, res) {
    try {
      const services = await Service.find({ isActive: true }).sort({
        category: 1,
        name: 1,
      });
      if (!services.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No services to display" });
      }

      return res
        .status(200)
        .json({ success: true, count: services.length, data: services });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // @desc    Get single service by ID
  // @route   GET /api/services/:id
  // @access  Public
  async httpGetServiceById(req, res) {
    try {
      const service = await Service.findById(req.params.id);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Couldn't find the service you looking for.",
        });
      }

      return res.status(200).json({ success: true, data: service });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // @desc    Get all active staff (for customers)
  // @route   GET /api/staff
  // @access  Public
  async httpGetAllStaff(req, res) {
    try {
      const staff = await Staff.find({ isActive: true })
        .populate("services", "name price duration")
        .select("-schedule -email"); // Hide sensitive info
      if (staff.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No staff do display." });
      }
      return res.json({
        success: true,
        count: staff.length,
        data: staff,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // @desc    Get single staff member
  // @route   GET /api/staff/:id
  // @access  Public
  async httpGetStaffById(req, res) {
    try {
      const staff = await Staff.findById(req.params.id).populate(
        "services",
        "name price duration",
      );

      if (!staff) {
        return res
          .status(404)
          .json({ success: false, message: "Staff not found" });
      }

      return res.json({ success: true, data: staff });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

const publicController = new PublicController();
module.exports = publicController;
