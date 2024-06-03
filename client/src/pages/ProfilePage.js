import React from "react";
import { Card, Avatar, Descriptions, Divider } from "antd";
import { StarFilled } from "@ant-design/icons";
import { useUser } from "../contexts/UserContext";
import LogoutButton from "../components/auth/LogoutButton";

const Profile = () => {
  const { currentUser } = useUser();

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
      <Card
        style={{ width: 400, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
        cover={
          <Avatar
            src={currentUser.photoUrl || "/default-avatar.png"}
            size={200}
            style={{ margin: "20px auto" }}
          />
        }
        actions={[<LogoutButton key="logout" />]}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2>{currentUser.username}</h2>
          <span style={{ color: "#888" }}>{currentUser.email}</span>
        </div>
        <Divider />
        <Descriptions layout="vertical" bordered column={1}>
          <Descriptions.Item label="Address">
            {currentUser.address || (
              <span style={{ color: "#ff4d4f" }}>Please add your address!</span>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Rating">
            {currentUser.ratingCount > 0 ? (
              <>
                {currentUser.ratingAverage} <StarFilled />
                <span> ({currentUser.ratingCount} reviews)</span>
              </>
            ) : (
              <span>No reviews</span>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Member Since">
            {new Date(currentUser.createdAt).toLocaleDateString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default Profile;
