import React, { useEffect, useRef, useState } from "react";
import { Input, Button, List, Typography } from "antd";

const { Text } = Typography;

const ChatWindow = ({ activeChat, messages, sendMessage }) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(
        activeChat._id,
        message,
        activeChat.otherParticipant._id,
        false
      );
      setMessage("");
    }
  };

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        <List
          dataSource={messages}
          renderItem={(msg) => (
            <List.Item
              style={{
                justifyContent:
                  msg.senderId === activeChat.otherParticipant._id
                    ? "flex-start"
                    : "flex-end",
              }}
            >
              <div
                style={{
                  background:
                    msg.senderId === activeChat.otherParticipant._id
                      ? "#f0f0f0"
                      : "#1890ff",
                  color:
                    msg.senderId === activeChat.otherParticipant._id
                      ? "black"
                      : "white",
                  padding: "8px 12px",
                  borderRadius: "10px",
                }}
              >
                <Text>{msg.content}</Text>
              </div>
            </List.Item>
          )}
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
