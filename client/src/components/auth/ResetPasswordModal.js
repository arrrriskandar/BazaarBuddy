import React from "react";
import { Form, Input, Button, Modal, message } from "antd";
import { resetPassword } from "../../firebase/auth";

const ResetPasswordModal = ({ visible, onClose }) => {
  const onFinish = async (values) => {
    try {
      await resetPassword(values.email);
      message.success("Password reset email sent. Please check your inbox.");
      onClose();
    } catch (error) {
      message.error("Failed to send password reset email. Please try again.");
      console.error("Reset password failed.", error);
    }
  };

  return (
    <Modal
      title="Reset Password"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form name="resetPasswordForm" onFinish={onFinish}>
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
