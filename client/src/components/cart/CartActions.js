import React from "react";
import { Row, Col, Space, Button, Avatar } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const CartActions = ({ cart, handleDeleteCart, handleCheckAllChange }) => (
  <Row justify="space-between" align="middle">
    <Col>
      <Row align="middle">
        <Avatar
          src={cart.seller.photoUrl || "/default-avatar.png"}
          style={{ marginRight: "10px" }}
        />
        <h1 style={{ margin: 0 }}>{cart.seller.username}</h1>
      </Row>
    </Col>
    <Col>
      <Space>
        <Button
          type="text"
          icon={<DeleteOutlined />}
          danger
          onClick={() => handleDeleteCart(cart._id)}
        >
          Delete Cart
        </Button>
        <Button
          type="primary"
          onClick={() => handleCheckAllChange(cart._id, true)}
        >
          Select All
        </Button>
      </Space>
    </Col>
  </Row>
);

export default CartActions;
