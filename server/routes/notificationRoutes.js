import express from "express";
import {
  getNotificationController,
  getNotificationsController,
  updateNotificationController,
  deleteNotificationController,
} from "../controllers/notificationController.js";

const router = express.Router();

router.route("/").get(getNotificationsController);
router.route("/:id").get(getNotificationController);
router.route("/:id").put(updateNotificationController);
router.route("/:id").delete(deleteNotificationController);

export default router;
