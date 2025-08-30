import express from "express";
import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";
import borrowRoutes from "./borrowRoutes.js"
import bookRoutes from "./bookRoutes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/book", bookRoutes);
router.use("/borrow",borrowRoutes);

export default router;


