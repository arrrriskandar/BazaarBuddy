import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { apiEndpoint } from "../constants/constants";
import { useUser } from "./UserContext";
import { useSocket } from "./SocketContext";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useUser();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser?._id) return;
      try {
        const response = await axios.get(
          `${apiEndpoint}/notification/user/${currentUser._id}`
        );
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();
  }, [currentUser]);

  // Listen for real-time notifications via WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = ({ message }) => {
      alert(message);
      // setNotifications((prev) => [{ message, isRead: false }, ...prev]);
      // setUnreadCount((prev) => prev + 1);
    };

    socket.on("receive_notification", handleNewNotification);

    return () => {
      socket.off("receive_notification", handleNewNotification);
    };
  }, [socket]);

  const getNotificationMessage = (type, { buyer, seller, orderId }) => {
    switch (type) {
      case "order_placed":
        return `New Order! ${buyer} has placed an order. Process it soon!`;
      case "order_shipped":
        return `Your order #${orderId} has been shipped by ${seller}.`;
      case "order_received":
        return `Order #${orderId} has been marked as received by ${buyer}.`;
      case "review_received":
        return `${buyer} has left a review on your product(s). Check it out!`;
      default:
        return "You have a new notification.";
    }
  };

  // Send notification via WebSocket
  const sendNotification = (receiverId, message) => {
    if (!socket) {
      console.warn("Socket is not connected yet");
      return;
    }
    if (socket) {
      socket.emit("send_notification", { receiverId, message });
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.put(
        `${apiEndpoint}/notification/markAllAsRead/${currentUser._id}`
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  // Mark a single notification as read
  const markAsRead = async (id) => {
    try {
      await axios.put(`${apiEndpoint}/notification/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => prev - 1);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        getNotificationMessage,
        sendNotification,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
