import express from "express";
import { upload } from "../utils/imageUpload.js";
import { verifyToken, checkRole } from "../middleware/auth.js";
import {
  createUser,
  deleteUser,
  getUsers,
  getUsersById,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

// Create user (only librarian can create new users manually, e.g. staff)
router.post(
  "/create",
  [
    verifyToken,
    checkRole("librarian"),
    upload.single("profileImage"),
  ],
  createUser
);

// Get all users (only librarian can view)
router.get(
  "/get",
  verifyToken,
  checkRole("librarian"),
  getUsers
);

// Get user by ID (authenticated user can view own, librarian can view all)
router.get(
  "/:id",
  verifyToken,
  getUsersById
);

// Delete user (only librarian can delete)
router.delete(
  "/:id",
  verifyToken,
  checkRole("librarian"),
  deleteUser
);

// Update user (user can update own profile, librarian can update any)
router.put(
  "/:id",
  verifyToken,
  updateUser
);

export default router;