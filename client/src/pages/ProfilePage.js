import React, { useState } from "react";
import {
  Card,
  Avatar,
  Descriptions,
  Divider,
  Modal,
  Button,
  Form,
  Typography,
} from "antd";
import { StarFilled } from "@ant-design/icons";
import { useUser } from "../contexts/UserContext";
import LogoutButton from "../components/auth/LogoutButton";
import ProfileEditForm from "../components/profile/ProfileEditForm";

const { Title } = Typography;
const Profile = () => {
  const { currentUser } = useUser();
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();
  const [profile, setProfile] = useState(currentUser);

  const handleEdit = () => {
    setOpenModal(true);
    form.setFieldsValue({
      username: profile.username,
      address: profile.address,
      unitNumber: profile.unitNumber,
    });
  };

  const averageRating =
    profile.ratingCount > 0
      ? (profile.ratingTotal / profile.ratingCount).toFixed(1)
      : 0; // Rounds to 1 decimal place

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
      <Card
        style={{ width: 400, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
        cover={
          <Avatar
            src={profile.photoUrl || "/default-avatar.png"}
            size={200}
            style={{ margin: "20px auto" }}
          />
        }
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Title level={3}>{profile.username}</Title>
          <Title level={3} style={{ color: "#888" }}>
            {profile.email}
          </Title>
        </div>
        <Divider />
        <Descriptions layout="vertical" bordered column={1}>
          <Descriptions.Item label="Address">
            {profile.unitNumber
              ? `${profile.address} ${profile.unitNumber}`
              : profile.address}
          </Descriptions.Item>
          <Descriptions.Item label="Rating">
            {profile.ratingCount > 0 ? (
              <>
                {averageRating} <StarFilled />
                <span> ({profile.ratingCount} reviews)</span>
              </>
            ) : (
              <span>No reviews</span>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Member Since">
            {new Date(profile.createdAt).toLocaleDateString()}
          </Descriptions.Item>
        </Descriptions>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "20px",
            alignItems: "center",
          }}
        >
          <Button
            type="primary"
            onClick={handleEdit}
            style={{ minWidth: "100px" }}
          >
            Edit Profile
          </Button>
          <LogoutButton />
        </div>
      </Card>
      <Modal
        open={openModal}
        footer={null}
        width={800}
        closable={false}
        centered={true}
      >
        <ProfileEditForm
          setOpenModal={setOpenModal}
          setProfile={setProfile}
          form={form}
          profile={profile}
        />
      </Modal>
    </div>
  );
};

export default Profile;
