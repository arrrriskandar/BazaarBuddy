import { Form, Input, Button, message } from "antd";
import { login } from "../../firebase/auth";

const LoginForm = ({ toggleRegister }) => {
  const [form] = Form.useForm();

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
      <span style={{ cursor: "pointer" }} onClick={toggleRegister}>
        Don't have an account? Register here.
      </span>
    </div>
  );
};

export default LoginForm;
