import React from "react";
import { Row, Col, Button, Space } from "antd";
import { Link } from "react-router-dom";

const CartSummary = ({ totalItems, totalPrice, handleBuyNow }) => (
  <Row justify="center" style={{ marginTop: "20px" }}>
    <Col>
      <Row justify="center">
        <Space size="large">
          <div>Total Items: {totalItems}</div>
          <div>Total Price: ${totalPrice}</div>
        </Space>
      </Row>
      <Row justify="center" style={{ marginTop: "10px" }}>
        <Link to="/checkout" state={{ selectedItems: handleBuyNow }}>
          <Button type="primary" disabled={totalItems === 0}>
            Buy Now
          </Button>
        </Link>
      </Row>
    </Col>
  </Row>
);

export default CartSummary;
