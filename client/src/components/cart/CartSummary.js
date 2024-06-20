import React from "react";
import { Row, Col, Button, Space } from "antd";

const CartSummary = ({ cartId, totalItems, totalPrice, handleBuyNow }) => (
  <Row justify="center" style={{ marginTop: "20px" }}>
    <Col>
      <Row justify="center">
        <Space size="large">
          <div>Total Items: {totalItems}</div>
          <div>Total Price: ${totalPrice}</div>
        </Space>
      </Row>
      <Row justify="center" style={{ marginTop: "10px" }}>
        <Button
          type="primary"
          disabled={totalItems === 0}
          onClick={() => handleBuyNow(cartId)}
        >
          Buy Now
        </Button>
      </Row>
    </Col>
  </Row>
);

export default CartSummary;
