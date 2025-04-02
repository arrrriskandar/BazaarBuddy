import React from "react";
import { Button } from "antd";
import { useChat } from "../../contexts/ChatContext";

const ChatNowButton = ({ receiverId }) => {
  const { getOrCreateChat } = useChat();

  const handleChatNow = async () => {
    try {
      await getOrCreateChat(receiverId);
    } catch (error) {
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
