import { Avatar, Button, Form, Input, Row, message } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { apiEndpoint } from "../../constants/constants";
import FilePicker from "../common/FilePicker";
import { uploadFile } from "../../supabase/storage";
import { useUser } from "../../contexts/UserContext";
import AddressForm from "../common/AddressForm";

function ProfileEditForm({ setOpenModal, form, setProfile, profile }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [removedImage, setRemovedImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { currentUser } = useUser();

  const getImageSrc = () => {
    if (removedImage) return null;
    if (selectedFile) return previewUrl;
    if (profile.photoUrl) {
      return `${profile.photoUrl}?v=${profile.photoVersion}`;
    }

    return null;
  };

  const handleCancelClick = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setRemovedImage(false);
    setOpenModal(false);
    form.setFieldsValue({
      username: profile.username,
      address: profile.address,
      unitNumber: profile.unitNumber,
    });
  };

  const handleFormSubmit = async (values) => {
    try {
      const path = `${currentUser.supabaseId}/profilePicture.jpg`;
      let photoUrl;
      if (selectedFile) {
        photoUrl = await uploadFile(selectedFile, path);
      }
      if (removedImage) {
        photoUrl = null;
      }
      const response = await axios.put(`${apiEndpoint}/user/${profile._id}`, {
        ...values,
        photoUrl,
      });
      setProfile(response.data);
      message.success("Profile updated successfully");
      setSelectedFile(null);
      setPreviewUrl(null);
      setRemovedImage(false);
      setOpenModal(false);
    } catch (error) {
      message.error("Failed to update profile. Please try again.");
      console.error("Failed to update profile", error);
    }
  };

  const onFileSelect = (file) => {
    setSelectedFile(file);
    setRemovedImage(false);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRemovePicture = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setRemovedImage(true);
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
            src={getImageSrc() || "/default-avatar.png"}
            size={200}
            style={{ margin: "20px auto", cursor: "pointer" }}
          />
        </FilePicker>
        {getImageSrc() && (
          <Button danger onClick={handleRemovePicture}>
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
