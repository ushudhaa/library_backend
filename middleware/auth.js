import jwt from "jsonwebtoken";
import  User  from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Please login to continue",
      });
    }

    const decoded = jwt.verify(token, process.env.KEY);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({
      status: false,
      message: "Unauthorized",
    });
  }
};

export const checkRole = (...allowedRole) => {
  return async (req, res, next) => {
    if (!allowedRole.includes(req.user.role)) {
      return res.status(403).json({
        status: false,
        message: "Access denied",
      });
    }
    next();
  };
};