import React, { useEffect, useRef, useState } from "react";
import { Input, Button, List, Typography, Avatar } from "antd";
import dayjs from "dayjs";

const { Text } = Typography;

const ChatWindow = ({ activeChat, messages, sendMessage }) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(
      activeChat._id,
      message,
      activeChat.otherParticipant._id,
      false
    );
    setMessage("");
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Function to check if a new date separator is needed
  const shouldShowDate = (prevMsg, currMsg) => {
    if (!prevMsg) return true; // Show date for the first message
    return !dayjs(prevMsg.createdAt).isSame(currMsg.createdAt, "day");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px",
          borderBottom: "1px solid #ddd",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Avatar
          src={activeChat.otherParticipant.photoUrl || "/default-avatar.png"}
          size={40}
        />
        <Text strong style={{ marginLeft: "10px", fontSize: "16px" }}>
          {activeChat.otherParticipant.username}
        </Text>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        <List
          dataSource={messages}
          renderItem={(msg, index) => {
            const prevMsg = messages[index - 1];
            const isOtherUser = msg.sender === activeChat.otherParticipant._id;
            const backgroundColor = isOtherUser ? "#ffffff" : "#1890ff";
            const textColor = isOtherUser ? "black" : "white";

            return (
              <>
                {shouldShowDate(prevMsg, msg) && (
                  <div
                    style={{
                      textAlign: "center",
                      margin: "10px 0",
                      fontSize: "12px",
                      color: "#888",
                    }}
                  >
                    {dayjs(msg.createdAt).format("DD/MM/YYYY")}
                  </div>
                )}
                <List.Item
                  style={{
                    border: "none",
                    boxShadow: "none",
                    display: "flex",
                    justifyContent: isOtherUser ? "flex-start" : "flex-end",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px", // Space between message and timestamp
                      background: backgroundColor,
                      color: textColor,
                      padding: "8px 12px",
                      borderRadius: "10px",
                      maxWidth: "70%",
                    }}
                  >
                    <Text>{msg.content}</Text>
                    <Text
                      style={{
                        fontSize: "10px",
                        color: textColor === "white" ? "#d1e7ff" : "#888",
                      }}
                    >
                      {dayjs(msg.createdAt).format("HH:mm")}
                    </Text>
                  </div>
                </List.Item>
              </>
            );
          }}
        />
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          padding: "10px",
          borderTop: "1px solid #ddd",
          display: "flex",
        }}
      >
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onPressEnter={handleSend}
        />
        <Button
          type="primary"
          onClick={handleSend}
          style={{ marginLeft: "10px" }}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
