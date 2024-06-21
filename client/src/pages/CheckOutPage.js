import { useLocation } from "react-router-dom";
import { List, Avatar, Form, Button, Divider, Modal } from "antd";
import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";

const Checkout = () => {
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };
  const { currentUser } = useUser();
  const [visible, setVisible] = useState(false);

  const onFinish = () => {
    console.log("Success");
  };

  const openModal = () => {
    setVisible(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Checkout</h1>
      <h3>{currentUser.address}</h3>
      <Button type="primary" onClick={openModal}>
        Change Address
      </Button>
      <List
        itemLayout="horizontal"
        dataSource={selectedItems}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.product.images} />}
              title={item.product.name}
              description={`Quantity: ${item.quantity} | Price: $${item.product.price}`}
            />
          </List.Item>
        )}
      />
      <Divider />
      <Form
        name="checkout"
        layout="vertical"
        onFinish={onFinish}
        style={{ marginTop: "20px" }}
      >
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Proceed to payment
          </Button>
        </Form.Item>
      </Form>
      <Modal
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        closable={false}
      ></Modal>
    </div>
  );
};

export default Checkout;
