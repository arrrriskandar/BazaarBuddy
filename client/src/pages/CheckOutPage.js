import { useLocation } from "react-router-dom";
import {
  Avatar,
  Divider,
  Form,
  Button,
  Typography,
  Row,
  Col,
  Modal,
  Table,
} from "antd";
import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
const { Title, Text } = Typography;

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
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (product) => (
        <Row align="middle">
          <Col>
            <Avatar src={product.images} size={64} />
          </Col>
          <Col style={{ paddingLeft: "10px" }}>
            <Title level={5} style={{ margin: 0 }}>
              {product.name}
            </Title>
          </Col>
        </Row>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      align: "center",
      render: (total) => `$${total.toFixed(2)}`,
    },
  ];

  // Prepare data source for the table
  const dataSource = selectedItems.map((item, index) => ({
    key: index,
    product: item.product,
    quantity: item.quantity,
    price: item.product.price,
    total: item.quantity * item.product.price,
  }));

  return (
    <div style={{ padding: "20px" }}>
      <h1>Checkout</h1>
      <h3>{currentUser.address}</h3>
      <Button type="primary" onClick={openModal}>
        Change Address
      </Button>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={3} align="right">
              <Text strong style={{ fontSize: "24px" }}>
                Total Price:
              </Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center">
              <Text strong style={{ fontSize: "24px" }}>
                ${totalPrice.toFixed(2)}
              </Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
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
