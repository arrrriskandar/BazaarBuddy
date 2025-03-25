import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { currentAuthUser } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!currentAuthUser || socketRef.current) return; // Prevent unnecessary reinitialization

    socketRef.current = io("http://localhost:5001", {
      query: { userId: currentAuthUser.uid },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    socketRef.current.on("receive_notification", ({ message }) => {
      alert(message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [currentAuthUser]);

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

  const sendNotification = (receiverId, message) => {
    if (socketRef.current) {
      socketRef.current.emit("send_notification", {
        receiverId,
        message,
      });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current || null,
        sendNotification,
        getNotificationMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
