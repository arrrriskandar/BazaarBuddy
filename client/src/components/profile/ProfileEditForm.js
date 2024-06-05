import { Button, Form, Input, Row, message } from "antd";
import axios from "axios";
import React from "react";
import { apiEndpoint } from "../../constants/constants";

function ProfileEditForm({ setOpenModal, form, setProfile, profile }) {
  const handleCancelClick = () => {
    setOpenModal(false);
  };

  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.put(
        `${apiEndpoint}/user/${profile._id}`,
        values
      );
      setProfile(response.data);
      message.success("Profile updated successfully");
      setOpenModal(false);
    } catch (error) {
      message.error("Failed to update profile");
    }
  };
  return (
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
  );
}

export default ProfileEditForm;
