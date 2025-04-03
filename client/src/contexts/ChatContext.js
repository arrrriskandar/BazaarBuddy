import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useUser } from "./UserContext";
import { useSocket } from "./SocketContext";
import { apiEndpoint } from "../constants/constants";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { currentUser } = useUser();
  const { socket } = useSocket();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let prevPath = location.pathname; // Store previous path

    return () => {
      if (prevPath.startsWith("/chat") && location.pathname !== "/chat") {
        setActiveChat(null);
      }
      prevPath = location.pathname; // Update previous path
    };
  }, [location.pathname]);

  const fetchChats = useCallback(async () => {
    if (!currentUser?._id) return;
    try {
      const response = await axios.get(
        `${apiEndpoint}/chat/${currentUser._id}`
      );
      const { transformedChats, totalUnreadMessages } = response.data;
      setChats(transformedChats);
      setTotalUnreadMessages(totalUnreadMessages);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
  }, [currentUser]); // Dependencies

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Fetch messages for active chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat?._id) return;
      try {
        const response = await axios.get(
          `${apiEndpoint}/chat/${activeChat._id}/${currentUser._id}`
        );
        setMessages(response.data);
        setTotalUnreadMessages(
          (prev) => prev - (activeChat?.unreadMessagesCount || 0)
        );

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === activeChat._id
              ? { ...chat, lastMessageRead: true, unreadMessagesCount: 0 } // Mark last message as read
              : chat
          )
        );
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();
  }, [activeChat, currentUser]);

  // Listen for incoming messages via WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      const { chatId, newMessage, popUpMessage } = data;
      if (chatId === activeChat?._id) {
        setMessages((prevMessages) => {
          return [...prevMessages, { ...newMessage, isRead: true }];
        });
      } else {
        message.info(popUpMessage);
        setTotalUnreadMessages((prev) => prev + 1);
      }
      setChats((prevChats) => {
        return prevChats.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                lastMessage: newMessage.content,
                lastMessageAt: newMessage.createdAt,
                lastMessageRead: chatId === activeChat?._id,
              }
            : chat
        );
      });
    };

    socket.on("receive_message", handleNewMessage);

    return () => {
      socket.off("receive_message", handleNewMessage);
    };
  }, [socket, activeChat]);

  // Send a text message
  const sendMessage = async (chatId, content, receiverId, isImage) => {
    try {
      const response = await axios.post(`${apiEndpoint}/chat/message`, {
        chatId,
        senderId: currentUser._id,
        content,
        receiverId,
        isImage,
      });

      const newMessage = response.data;
      const popUpMessage = `New message from ${currentUser.username}!`;
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      setChats((prevChats) => {
        return prevChats.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                lastMessage: isImage ? "📷 Image" : newMessage.content,
                lastMessageAt: newMessage.createdAt,
                lastMessageRead: true,
              }
            : chat
        );
      });

      if (socket && activeChat) {
        socket.emit("send_message", {
          receiverId,
          popUpMessage,
          newMessage,
          chatId,
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const getOrCreateChat = async (receiverId) => {
    try {
      const response = await axios.post(`${apiEndpoint}/chat`, {
        receiverId,
        senderId: currentUser._id,
      });
      const newChat = response.data;

      let chat = chats.find((chat) => chat._id === newChat._id);

      if (!chat) {
        await fetchChats(); // Ensure the chat list is updated
        chat = chats.find((chat) => chat._id === newChat._id); // Try again after fetching
      }

      if (chat) {
        setActiveChat(chat);
      }

      navigate(`/chat`);
    } catch (error) {
      console.error("Failed to get/create chat:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        messages,
        setActiveChat,
        sendMessage,
        getOrCreateChat,
        totalUnreadMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
