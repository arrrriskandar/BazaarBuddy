import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
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

  const fetchNotifications = useCallback(async () => {
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
  }, [currentUser]);

  // Fetch notifications from API
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Listen for real-time notifications via WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = ({ notification }) => {
      console.log(notification);
      alert(notification.message);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("receive_notification", handleNewNotification);

    return () => {
      socket.off("receive_notification", handleNewNotification);
    };
  }, [socket, fetchNotifications]);

  // Send notification via WebSocket
  const sendNotification = (receiverId, notification) => {
    if (!socket) {
      console.warn("Socket is not connected yet");
      return;
    }
    if (socket) {
      socket.emit("send_notification", {
        receiverId,
        notification,
      });
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
        sendNotification,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
