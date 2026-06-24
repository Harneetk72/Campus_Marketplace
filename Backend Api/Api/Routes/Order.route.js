import express from "express";

import {
  createOrder,
  getOrders,
  getSingleOrder
} from "../Controllers/order.controller.js";

import {
  protect
} from "../middleware/Auth.middleware.js";

const router = express.Router();

router.post(
  "/create",
  protect,
  createOrder
);
router.get(
  "/",
  protect,
  getOrders
);

router.get(
  "/:id",
  protect,
  getSingleOrder
);

export default router;