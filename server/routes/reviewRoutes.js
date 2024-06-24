import express from "express";
import {
  createReviewController,
  getReviewController,
  getReviewsController,
  updateReviewController,
  deleteReviewController,
} from "../controllers/reviewController.js";

const router = express.Router();

router.route("/").post(createReviewController);
router.route("/").get(getReviewsController);
router.route("/:id").get(getReviewController);
router.route("/:id").put(updateReviewController);
router.route("/:id").delete(deleteReviewController);

export default router;
