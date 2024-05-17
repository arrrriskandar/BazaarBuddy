import React from "react";
import { Form, Input, Button, Modal, message } from "antd";
import { resetPassword } from "../../firebase/auth";

const ResetPasswordModal = ({ visible, onClose }) => {
  const onFinish = async (values) => {
    try {
      console.log("email: ", values.email);
      await resetPassword(values.email);
      message.success("Password reset email sent. Please check your inbox.");
      onClose();
    } catch (error) {
      message.error(
        "Failed to send password reset email. Please check your email address."
      );
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      title="Reset Password"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        name="resetPasswordForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
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
          <Input placeholder="Enter your email" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Send
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ResetPasswordModal;
