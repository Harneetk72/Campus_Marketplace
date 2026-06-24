import express from "express";

import {
  addToWishlist,
  getWishlist,
  removeWishlist,
} from "../Controllers/wishlistController.js";

import { protect } from "../Middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/add/:id",
  protect,
  addToWishlist
);

router.get(
  "/",
  protect,
  getWishlist
);

router.delete(
  "/remove/:id",
  protect,
  removeWishlist
);

export default router;