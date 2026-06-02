function roleVerify(...role) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "Not authenticated" });
      }

      if (!role.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Unauthorized access, ${req.user.role} cannot access this resource. Required ${role.join(" or ")}`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: error });
    }
  };
}

module.exports = roleVerify;
