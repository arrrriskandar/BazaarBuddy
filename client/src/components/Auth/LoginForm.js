import React, { useState } from "react";
import { Form, Input, Button, message, Typography, Card, Row, Col } from "antd";
import { login } from "../../firebase/auth";
import ResetPasswordModal from "./ResetPasswordModal";

const LoginForm = ({ toggleRegister }) => {
  const [form] = Form.useForm();
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const { Text } = Typography;

  const handleForgotPasswordClick = () => {
    setResetPasswordModal(true);
  };

  const handleForgotPasswordClose = () => {
    setResetPasswordModal(false);
  };

  const onFinish = async ({ email, password }) => {
    try {
      await login(email, password);
      message.success("Login successful!");
    } catch (error) {
      message.error("Login failed");
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
          <img
            src="/logo1.png"
            alt="BazaarBuddy"
            style={{
              marginBottom: 20,
              maxWidth: "100%",
              height: "auto",
              maxHeight: 200,
              borderRadius: 100,
            }}
          />
          <Typography.Title level={2}>Login</Typography.Title>
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password!",
                },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
          <Text
            style={{
              cursor: "pointer",
              color: "#1890ff",
            }}
            onClick={toggleRegister}
          >
            Don't have an account? Register here.
          </Text>
          <br />
          <Text
            style={{
              cursor: "pointer",
              color: "#1890ff",
            }}
            onClick={handleForgotPasswordClick}
          >
            Forgot password?
          </Text>
          <ResetPasswordModal
            visible={resetPasswordModal}
            onClose={handleForgotPasswordClose}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default LoginForm;
