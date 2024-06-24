import { Avatar, Button, Form, Input, Row, message } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { apiEndpoint } from "../../constants/constants";
import FilePicker from "../common/FilePicker";
import { uploadFile } from "../../firebase/storage";
import { useUser } from "../../contexts/UserContext";
import AddressForm from "../common/AddressForm";

function ProfileEditForm({ setOpenModal, form, setProfile, profile }) {
  const [profilePicture, setProfilePicture] = useState(profile.photoUrl);
  const [selectedFile, setSelectedFile] = useState(null);

  const { currentUser } = useUser();

  const handleCancelClick = () => {
    setProfilePicture(profile.photoUrl);
    setOpenModal(false);
    form.setFieldsValue({
      username: profile.username,
      address: profile.address,
      unitNumber: profile.unitNumber,
    });
  };

  const handleFormSubmit = async (values) => {
    try {
      const path = `${currentUser._id}/profilePicture/`;
      let photoUrl = profilePicture;
      if (selectedFile) {
        photoUrl = await uploadFile(selectedFile, path);
      }
      const response = await axios.put(`${apiEndpoint}/user/${profile._id}`, {
        ...values,
        photoUrl,
      });
      setProfile(response.data);
      message.success("Profile updated successfully");
      setOpenModal(false);
    } catch (error) {
      message.error("Failed to update profile");
    }
  };

  const onFileSelect = (file) => {
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setProfilePicture(previewUrl);
  };

  const handleRemovePicture = () => {
    setSelectedFile(null);
    setProfilePicture("");
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FilePicker onFileSelect={onFileSelect}>
          <Avatar
            src={profilePicture || "/default-avatar.png"}
            size={200}
            style={{ margin: "20px auto", cursor: "pointer" }}
          />
        </FilePicker>
        {profilePicture && (
          <Button
            danger
            onClick={handleRemovePicture}
            style={{ display: "block", margin: "10px auto" }}
          >
            Remove
          </Button>
        )}
      </div>

      <Form form={form} onFinish={handleFormSubmit} layout="vertical">
        <Form.Item
          name="username"
          label="Username:"
          rules={[
            {
              required: true,
              message: "Please enter your username!",
            },
          ]}
        >
          <Input placeholder="Username" />
        </Form.Item>
        <AddressForm form={form} />
        <Form.Item>
          <Row
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button style={{ marginLeft: "10px" }} onClick={handleCancelClick}>
              Cancel
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </>
  );
}

export default ProfileEditForm;
