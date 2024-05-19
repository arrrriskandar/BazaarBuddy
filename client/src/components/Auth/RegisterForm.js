import React from "react";
import { Form, Input, Button, message, Typography } from "antd";
import { register } from "../../firebase/auth";

const RegisterForm = ({ toggleRegister }) => {
  const [form] = Form.useForm();
  const { Text } = Typography;

  const onFinish = async ({ email, password }) => {
    try {
      await register(email, password);
      message.success("Registration successful!");
    } catch (error) {
      message.error("Register failed");
    }
  };

  const validatePassword = (_, value) => {
    // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]{8,}$/;
    if (!value || value.match(passwordRegex)) {
      return Promise.resolve();
    }
    return Promise.reject(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
  };

  return (
    <div>
      <h2>Register</h2>
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
            Register
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
        Already have an account? Login here.
      </Text>
    </div>
  );
};

export default RegisterForm;
