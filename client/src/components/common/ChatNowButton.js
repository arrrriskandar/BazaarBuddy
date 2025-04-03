import React from "react";
import { Button, message } from "antd";
import { useChat } from "../../contexts/ChatContext";

const ChatNowButton = ({ receiverId }) => {
  const { getOrCreateChat } = useChat();

  const handleChatNow = async () => {
    try {
      await getOrCreateChat(receiverId);
    } catch (error) {
      message.error("Error starting chat. Please try again.");
      console.error("Error starting chat:", error);
    }
  };

  return (
    <Button type="default" onClick={handleChatNow}>
      Chat Now
    </Button>
  );
};

export default ChatNowButton;
