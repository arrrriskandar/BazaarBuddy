import {
  deleteNotification,
  getNotification,
  getNotifications,
  updateNotification,
} from "../services/notificationService.js";

export const getNotificationController = async (req, res) => {
  try {
    const notification = await getNotification(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getNotificationsController = async (req, res) => {
  try {
    const notifications = await getNotifications(req.query);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateNotificationController = async (req, res) => {
  try {
    const updatedNotification = await updateNotification(
      req.params.id,
      req.body
    );
    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(updatedNotification);
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
