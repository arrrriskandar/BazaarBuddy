import express from "express";
import {
  createOrderController,
  getOrderController,
  getOrdersController,
  updateOrderController,
  deleteOrderController,
} from "../controllers/orderController.js";

const router = express.Router();

router.route("/").post(createOrderController);
router.route("/").get(getOrdersController);
router.route("/:id").get(getOrderController);
router.route("/:id").put(updateOrderController);
router.route("/:id").delete(deleteOrderController);

export default router;
