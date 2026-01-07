import express from "express";
import {
  Register,
  login,
  updateUser,
  deleteUser,
  profile,
  getAllUser,
  getUserById
} from "../Controller/UserController.js";

import { Authentication } from "../Middleware/Auth.js";

const router = express.Router();

/* ================= AUTH ================= */

// Register new user
router.post("/register", Register);

// Login user
router.post("/login", login);


/* ================= USER ================= */

// Get logged-in user profile
router.get("/profile", Authentication, profile);

// Update user by ID
router.put("/update/:id", Authentication, updateUser);

// Delete user by email
router.delete("/delete", Authentication, deleteUser);

// Get all users
router.get("/", Authentication, getAllUser);

// Get user by ID
router.get("/:id", Authentication, getUserById);

export default router;
