import express from "express";
import {
  getNotificationController,
  getNotificationsController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
  deleteNotificationController,
} from "../controllers/notificationController.js";

const router = express.Router();

router.route("/").get(getNotificationsController);
router.route("/:id").get(getNotificationController);
router.route("/:id").put(markNotificationAsReadController);
router
  .route("/markAllAsRead/:userId")
  .put(markAllNotificationsAsReadController);
router.route("/:id").delete(deleteNotificationController);

export default router;
