import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { currentAuthUser } = useAuth();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [socketReady, setSocketReady] = useState(false); // Track socket readiness

  useEffect(() => {
    if (!currentAuthUser) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setSocketReady(false);
      }
      return;
    }

    // Disconnect any existing socket before creating a new one
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const newSocket = io("http://localhost:5001", {
      query: { userId: currentAuthUser.uid },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    newSocket.on("connect", () => {
      setSocketReady(true); // Set socket as ready once connected
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setSocketReady(false);
      }
    };
  }, [currentAuthUser]);

  return (
    <SocketContext.Provider value={{ socket, socketReady }}>
      {children}
    </SocketContext.Provider>
  );
};
