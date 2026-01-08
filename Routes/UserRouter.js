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
router.get("/profile",  profile);

// Update user by ID
router.put("/update/:id",  updateUser);

// Delete user by email
router.delete("/delete",  deleteUser);

// Get all users
router.get("/",  getAllUser);

// Get user by ID
router.get("/:id",  getUserById);

export default router;
