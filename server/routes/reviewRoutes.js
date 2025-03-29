import express from "express";
import {
  createReviewController,
  getReviewController,
  getReviewsByProductController,
  updateReviewController,
  deleteReviewController,
  getReviewsByOrderController,
} from "../controllers/reviewController.js";

const router = express.Router();

router.route("/").post(createReviewController);
router.route("/").get(getReviewsByProductController);
router.route("/:id").get(getReviewController);
router.route("/order/:orderId").get(getReviewsByOrderController);
router.route("/:id").put(updateReviewController);
router.route("/:id").delete(deleteReviewController);

export default router;
