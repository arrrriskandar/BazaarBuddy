import React, { useEffect, useRef, useState } from "react";
import { Input, Button, List, Typography, Avatar, Image } from "antd";
import { CameraFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import FilePicker from "../common/FilePicker";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../../firebase/storage";

const { Text } = Typography;

const ChatWindow = ({ activeChat, messages, sendMessage }) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [image, setImage] = useState(null);

  const handleSend = async () => {
    if (selectedFile) {
      let photoUrl = null;
      let photouuid = uuidv4();
      try {
        const path = `${activeChat._id}/${photouuid}`;
        photoUrl = await uploadFile(selectedFile, path);
      } catch (uploadError) {
        message.error("Failed to upload image. Please try again.", uploadError);
        return;
      }
      sendMessage(
        activeChat._id,
        photoUrl,
        activeChat.otherParticipant._id,
        true
      );
    } else {
      sendMessage(
        activeChat._id,
        message,
        activeChat.otherParticipant._id,
        false
      );
      setMessage("");
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const shouldShowDate = (prevMsg, currMsg) => {
    if (!prevMsg) return true;
    return !dayjs(prevMsg.createdAt).isSame(currMsg.createdAt, "day");
  };

  const onFileSelect = (file) => {
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);
  };

  const handleRemovePicture = () => {
    setSelectedFile(null);
    setImage(null);
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
                    display: "flex",
                    justifyContent: isOtherUser ? "flex-start" : "flex-end",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: isOtherUser ? "#ffffff" : "#1890ff",
                      color: isOtherUser ? "black" : "white",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      maxWidth: "70%",
                    }}
                  >
                    {msg.isImage ? (
                      <Image
                        src={msg.content}
                        width={100}
                        height={100}
                        style={{ borderRadius: "5px" }}
                      />
                    ) : (
                      <Text>{msg.content}</Text>
                    )}
                    <Text
                      style={{
                        fontSize: "10px",
                        color: isOtherUser ? "#888" : "#d1e7ff",
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
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          minHeight: "60px",
        }}
      >
        {!selectedFile ? (
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onPressEnter={handleSend}
            style={{ flex: 1, marginRight: "10px", height: "40px" }}
          />
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60px",
            }}
          >
            <div style={{ position: "relative" }}>
              <Image
                src={image}
                width={50}
                height={50}
                style={{ borderRadius: "5px" }}
              />
              <Button
                size="small"
                type="text"
                danger
                onClick={handleRemovePicture}
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-15px",
                  fontSize: "12px",
                  background: "white",
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
                  lineHeight: "16px",
                  textAlign: "center",
                  boxShadow: "0 0 3px rgba(0,0,0,0.2)",
                }}
              >
                ✖
              </Button>
            </div>
          </div>
        )}

        {!message.trim() && !selectedFile && (
          <FilePicker onFileSelect={onFileSelect}>
            <Button icon={<CameraFilled />} />
          </FilePicker>
        )}

        {(message.trim() || selectedFile) && (
          <Button
            type="primary"
            onClick={handleSend}
            style={{ height: "40px" }}
          >
            Send
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
