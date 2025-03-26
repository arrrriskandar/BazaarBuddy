import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { apiEndpoint } from "../constants/constants";
import { useUser } from "./UserContext";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotification = async () => {
      if (!currentUser._id) return;
      const response = await axios.get(
        `${apiEndpoint}/notification/user/${currentUser._id}`
      );
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    };
    fetchNotification();
  }, [currentUser]);

  const markAllAsRead = async () => {
    try {
      await axios.put(
        `${apiEndpoint}/notification/markAllAsRead/${currentUser._id}`
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${apiEndpoint}/notification/${id}`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
