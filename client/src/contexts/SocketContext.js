import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { currentAuthUser } = useAuth();
  const socketRef = useRef(null); // ✅ Use `useRef` instead of `useState`

  useEffect(() => {
    if (currentAuthUser) {
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

      // Listen for notifications globally here
      socketRef.current.on("receive_notification", (data) => {
        alert("Someone bought your product!");
        console.log(data);
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [currentAuthUser]);

  const sendNotification = (receiverId, message) => {
    if (socketRef.current) {
      // ✅ Now it always references the latest socket
      socketRef.current.emit("send_notification", {
        receiverId,
        message,
      });
    }
  };

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, sendNotification }}
    >
      {children}
    </SocketContext.Provider>
  );
};
