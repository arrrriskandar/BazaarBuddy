import NotificationModel from "../models/notificationModel.js";

export const createNotification = async (notificationData) => {
  const notification = new NotificationModel(notificationData);

  await notification.save();

  await notification.populate({
    path: "order",
    select: "seller user",
    populate: [
      {
        path: "seller",
        model: "UserModel",
        select: "photoUrl",
      },
      {
        path: "user",
        model: "UserModel",
        select: "photoUrl",
      },
    ],
  });

  return notification;
};

export const getNotifications = async (userId) => {
  const sortOptions = { isRead: 1, createdAt: -1 };

  const notifications = await NotificationModel.find({ userId })
    .sort(sortOptions)
    .populate({
      path: "order",
      select: "seller user",
      populate: [
        {
          path: "seller",
          model: "UserModel",
          select: "photoUrl",
        },
        {
          path: "user",
          model: "UserModel",
          select: "photoUrl",
        },
      ],
    });

  const unreadCount = notifications.filter(
    (notification) => notification.isRead === false
  ).length;
  return {
    notifications,
    unreadCount,
  };
};

export const markNotificationAsRead = async (notificationId) => {
  return await NotificationModel.findByIdAndUpdate(
    notificationId,
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

export const deleteNotification = async (notificationId) => {
  return await NotificationModel.findByIdAndDelete(notificationId);
};
