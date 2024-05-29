import React from "react";
import { Form, Input, Button, message, Typography, Card, Row, Col } from "antd";
import { register } from "../../firebase/auth";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";

const RegisterForm = ({ toggleRegister }) => {
  const [form] = Form.useForm();
  const { Text } = Typography;
  const { setRegistering } = useUser();

  const onFinish = async ({ email, password, username }) => {
    try {
      setRegistering(true);
      const userCredentials = await register(email, password);
      const uid = userCredentials.uid;

      await axios.post("http://localhost:5001/api/user", {
        _id: uid,
        username,
        email,
      });

      message.success("Registration successful!");
    } catch (error) {
      message.error("Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  const validatePassword = (_, value) => {
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
          <Typography.Title level={2}>Register</Typography.Title>
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  type: "username",
                  message: "Please enter a username!",
                },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>
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
        </Card>
      </Col>
    </Row>
  );
};

export default RegisterForm;
