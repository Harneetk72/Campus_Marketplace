import express from "express";
import {
  createCollege,
  getColleges,
} from "../Controllers/collegeController.js";

import {
  protect,
  isAdmin,
} from "../Middleware/auth.middleware.js";

const router = express.Router();

// Create College (Admin Only)
router.post(
  "/create-college",
  protect,
  isAdmin,
  createCollege
);

// Get All Colleges
router.get(
  "/get-colleges",
  getColleges
);

export default router;