// src/contexts/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { currentAuthUser } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (currentAuthUser) {
      // Create socket connection and pass the userId as a query parameter
      const socketConnection = io("http://localhost:5001", {
        query: { userId: currentAuthUser.uid }, // Send userId from auth context
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
      });

      setSocket(socketConnection);

      // Listen for notifications globally here
      socketConnection.on("receive_notification", (data) => {
        alert("Someone bought your product!");
      });

      // Cleanup on disconnect
      return () => {
        socketConnection.disconnect();
      };
    }
  }, [currentAuthUser]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
