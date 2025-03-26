import {
  deleteNotification,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notificationService.js";

export const getNotificationsController = async (req, res) => {
  try {
    const notifications = await getNotifications(req.params.userId);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markNotificationAsReadController = async (req, res) => {
  try {
    const updatedNotification = await markNotificationAsRead(req.params.id);
    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(updatedNotification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markAllNotificationsAsReadController = async (req, res) => {
  try {
    const result = await markAllNotificationsAsRead(req.params.userId);
    if (!result.modifiedCount) {
      return res.status(404).json({ message: "No unread notifications found" });
    }
    res.json({ message: "All notifications marked as read", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteNotificationController = async (req, res) => {
  try {
    const deletedNotification = await deleteNotification(req.params.id);
    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
