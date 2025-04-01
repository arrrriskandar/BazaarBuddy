import React from "react";
import { List, Avatar, Typography, Badge } from "antd";
import dayjs from "dayjs";

const { Text } = Typography;

const ChatList = ({ chats, activeChat, setActiveChat }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={chats}
      renderItem={(chat) => {
        const lastMessageAt = chat.lastMessageAt
          ? dayjs(chat.lastMessageAt)
          : null;

        // Format the date based on whether it's today or not
        const formattedTime = lastMessageAt
          ? lastMessageAt.isSame(dayjs(), "day")
            ? lastMessageAt.format("HH:mm") // 24-hour format for today
            : lastMessageAt.format("DD/MM/YY") // dd/mm/yy for previous days
          : "";

        return (
          <List.Item
            style={{
              padding: "10px",
              cursor: "pointer",
              backgroundColor:
                activeChat?._id === chat._id ? "#f0f0f0" : "white",
            }}
            onClick={() => setActiveChat(chat)}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  src={chat.otherParticipant.photoUrl || "/default-avatar.png"}
                />
              }
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text strong>{chat.otherParticipant.username}</Text>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {formattedTime}
                    </Text>
                    {!chat.lastMessageRead && <Badge color="blue" />}
                  </div>
                </div>
              }
              description={chat.lastMessage}
            />
          </List.Item>
        );
      }}
    />
  );
};

export default ChatList;
