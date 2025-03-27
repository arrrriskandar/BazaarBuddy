import React from "react";
import { List, Avatar, Typography, Badge } from "antd";

const { Text } = Typography;

const ChatList = ({ chats, activeChat, setActiveChat }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={chats}
      renderItem={(chat) => (
        <List.Item
          style={{
            padding: "10px",
            cursor: "pointer",
            backgroundColor: activeChat?._id === chat._id ? "#f0f0f0" : "white",
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
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text strong>{chat.otherParticipant.username}</Text>
                {!chat.lastMessageRead && <Badge color="blue" />}
              </div>
            }
            description={chat.lastMessage}
          />
        </List.Item>
      )}
    />
  );
};

export default ChatList;
