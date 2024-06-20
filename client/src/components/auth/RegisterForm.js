import React, { useState } from "react";
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
  AutoComplete,
} from "antd";
import { register } from "../../firebase/auth";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import { apiEndpoint } from "../../constants/constants";
import { getSingaporeAddress } from "../../oneMap/addressLookup";

const RegisterForm = ({ toggleRegister }) => {
  const [form] = Form.useForm();
  const { Text } = Typography;
  const { setRegistering } = useUser();
  const [addressOptions, setAddressOptions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const onFinish = async ({
    email,
    password,
    username,
    unitNumber,
    address,
  }) => {
    try {
      setRegistering(true);
      const userCredentials = await register(email, password);
      const uid = userCredentials.uid;
      const fullAddress = unitNumber ? `${address} #${unitNumber}` : address;

      await axios.post(apiEndpoint + "/user", {
        _id: uid,
        username,
        email,
        address: fullAddress,
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

  const validateAddress = (_, value) => {
    if (!selectedAddress) {
      return Promise.reject(
        "Please select a valid address from the dropdown list!"
      );
    }
    return Promise.resolve();
  };

  const validateUnitNumber = (_, value) => {
    const unitNumberRegex = /^#\d{2}-\d{3}$/;
    if (!value || value.match(unitNumberRegex)) {
      return Promise.resolve();
    }
    return Promise.reject("Unit number must follow the format #XX-YYY!");
  };

  const handleAddressSearch = async (value) => {
    if (value) {
      try {
        const addresses = await getSingaporeAddress(value);
        setAddressOptions(
          addresses.map((addr) => ({
            value: addr.ADDRESS,
            label: addr.ADDRESS,
          }))
        );
      } catch (error) {
        console.error(error);
        message.error("Error fetching address");
      }
    } else {
      setAddressOptions([]);
    }
  };

  const handleAddressSelect = (value) => {
    setSelectedAddress(value);
  };

  const handleAddressChange = (value) => {
    if (!addressOptions.some((option) => option.value === value)) {
      setSelectedAddress(null);
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
          <Typography.Title level={2}>Register</Typography.Title>
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
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
            <Form.Item
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please enter your address!",
                },
                {
                  validator: validateAddress,
                },
              ]}
            >
              <AutoComplete
                options={addressOptions}
                onSearch={handleAddressSearch}
                onSelect={handleAddressSelect}
                onChange={handleAddressChange}
                placeholder="Search your address"
                style={{ textAlign: "left" }}
              />
            </Form.Item>
            <Form.Item
              name="unitNumber"
              rules={[
                {
                  validator: validateUnitNumber,
                },
              ]}
            >
              <Input placeholder="Unit Number" />
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
