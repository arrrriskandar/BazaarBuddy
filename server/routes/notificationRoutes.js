import express from "express";
import {
  openNotificationController,
  getNotificationsController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
  deleteNotificationController,
} from "../controllers/notificationController.js";

const router = express.Router();

router.route("/user/:userId").get(getNotificationsController);
router.route("/:id").get(openNotificationController);
router.route("/:id").put(markNotificationAsReadController);
router
  .route("/markAllAsRead/:userId")
  .put(markAllNotificationsAsReadController);
router.route("/:id").delete(deleteNotificationController);

export default router;
