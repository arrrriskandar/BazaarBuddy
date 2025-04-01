import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "./UserContext";
import { useSocket } from "./SocketContext";
import { apiEndpoint } from "../constants/constants";
import { useLocation, useNavigate } from "react-router-dom";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { currentUser } = useUser();
  const { socket } = useSocket();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    return () => {
      setActiveChat(null); // Reset activeChat when leaving the chat page
    };
  }, [location.pathname]); // Runs when the page route changes

  // Fetch user's chats
  useEffect(() => {
    const fetchChats = async () => {
      if (!currentUser?._id) return;
      try {
        const response = await axios.get(
          `${apiEndpoint}/chat/${currentUser._id}`
        );
        setChats(response.data);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };
    fetchChats();
  }, [currentUser]);

  // Fetch messages for active chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat?._id) return;
      try {
        const response = await axios.get(
          `${apiEndpoint}/chat/${activeChat._id}/${currentUser._id}`
        );
        setMessages(response.data);

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === activeChat._id
              ? { ...chat, lastMessageRead: true } // Mark last message as read
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
        alert(popUpMessage);
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
      const response = await axios.post(`${apiEndpoint}/chat/message`, {
        receiverId,
        senderId: currentUser._id,
      });
      const chat = response.data;

      // Set the active chat to the newly created or existing chat
      setActiveChat(chat);

      // Navigate to the chat window
      navigate(`/chat/${chat._id}`);
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
