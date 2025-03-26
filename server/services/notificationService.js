import NotificationModel from "../models/notificationModel.js";

export const createNotification = async (notificationData) => {
  const notification = new NotificationModel(notificationData);
  await notification.save();
  return notification;
};

export const getNotifications = async (userId) => {
  const sortOptions = { isRead: 1, createdAt: -1 };

  const notifications = await NotificationModel.find({ userId })
    .populate({
      path: "order",
      model: "OrderModel",
      populate: {
        path: "items.product",
        model: "ProductModel",
        select: "images",
      },
    })
    .sort(sortOptions);

  const unreadCount = notifications.filter(
    (notification) => notification.isRead === false
  ).length;
  return {
    notifications,
    unreadCount,
  };
};

export const markNotificationAsRead = async (id) => {
  return await NotificationModel.findByIdAndUpdate(
    id,
    { isRead: true },
    {
      new: true,
    }
  );
};

export const markAllNotificationsAsRead = async (userId) => {
  return await NotificationModel.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true } }
  );
};

export const deleteNotification = async (id) => {
  return await NotificationModel.findByIdAndDelete(id);
};
