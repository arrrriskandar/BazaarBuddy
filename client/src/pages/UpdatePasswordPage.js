import React from "react";
import {
  Form,
  Input,
  Button,
  message,
  Typography,
  Card,
  Row,
  Col,
  Avatar,
} from "antd";
import { validatePassword } from "../utils/validatePassword";
import { handleUpdatePassword } from "../supabase/auth";
import { useNavigate } from "react-router-dom";

const UpdatePasswordPage = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      await handleUpdatePassword(values.password);
      message.success("Password updated!");
      navigate("/");
    } catch (error) {
      message.error("Password update failed. Please try again.");
      console.error("Password update failed", error);
    }
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}
    >
      <Col>
        <Card bordered={true} style={{ width: 400, textAlign: "center" }}>
          <Avatar src="/logo1.png" alt="BazaarBuddy" size={200} />
          <Typography.Title level={2}>Update Password</Typography.Title>
          <Form name="updatePasswordForm" onFinish={onFinish}>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter a password!",
                },
                {
                  validator: validatePassword,
                },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default UpdatePasswordPage;
