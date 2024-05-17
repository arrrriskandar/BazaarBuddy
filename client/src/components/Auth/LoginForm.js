import { Form, Input, Button, message, Typography } from "antd";
import { login } from "../../firebase/auth";
import { useState } from "react";
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
    <div>
      <h2>Login</h2>
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
    </div>
  );
};

export default LoginForm;
