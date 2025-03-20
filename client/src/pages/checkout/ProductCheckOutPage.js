import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Divider, Form, Button, Row, Col, Modal, Table } from "antd";
import { useUser } from "../../contexts/UserContext";
import { EditOutlined } from "@ant-design/icons";
import EditDeliveryAddressForm from "../../components/checkout/EditDeliveryAddressForm";

const ProductCheckout = () => {
  const location = useLocation();
  const { item } = location.state;
  const { currentUser } = useUser();
  const [visible, setVisible] = useState(false);
  const [address, setAddress] = useState(currentUser.address);
  const [unitNumber, setUnitNumber] = useState(currentUser.unitNumber);
  const navigate = useNavigate();

  const totalPrice = item.quantity * item.product.price;

  const onFinish = () => {
    navigate("/payment", {
      state: {
        item,
        address,
        unitNumber,
        totalPrice,
        userId: currentUser._id,
        cartCheckout: false, // Indicate this is for a single product
      },
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Checkout</h1>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "20px" }}
      >
        <Col style={{ maxWidth: "75%" }}>
          <h3>
            Shipping Address: {address}{" "}
            {unitNumber && `, Unit Number: ${unitNumber}`}
          </h3>
        </Col>
        <Col>
          <Button
            shape="round"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setVisible(true)}
          />
        </Col>
      </Row>

      <Table
        columns={[
          { title: "Product", dataIndex: ["product", "name"], key: "product" },
          { title: "Quantity", dataIndex: "quantity", key: "quantity" },
          { title: "Price", dataIndex: ["product", "price"], key: "price" },
          {
            title: "Total",
            key: "total",
            render: (_, record) => `$${record.quantity * record.product.price}`,
          },
        ]}
        dataSource={[
          { key: 1, product: item.product, quantity: item.quantity },
        ]}
        pagination={false}
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
        footer={false}
        closable={false}
        title="Shipping Address"
      >
        <EditDeliveryAddressForm
          setAddress={setAddress}
          setUnitNumber={setUnitNumber}
          setVisible={setVisible}
        />
      </Modal>
    </div>
  );
};

export default ProductCheckout;
