import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Divider,
  Form,
  Button,
  Row,
  Col,
  Modal,
  Table,
  Avatar,
  Typography,
} from "antd";
import { useUser } from "../../contexts/UserContext";
import { EditOutlined } from "@ant-design/icons";
import EditDeliveryAddressForm from "../../components/checkout/EditDeliveryAddressForm";

const { Title } = Typography;

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
        cartCheckout: false, // Indicate this is for a single product
      },
    });
  };

  const columns = [
    {
      title: "Product",
      key: "product",
      render: () => (
        <Row align="middle">
          <Col>
            <Avatar src={item.product.images} size={64} />
          </Col>
          <Col style={{ paddingLeft: "10px" }}>
            <Title level={5} style={{ margin: 0 }}>
              {item.product.name}
            </Title>
          </Col>
        </Row>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: ["product", "price"],
      key: "price",
      render: (price) => `$${price.toFixed(2)}`, // Format the price to two decimals
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) =>
        `$${(record.quantity * record.product.price).toFixed(2)}`, // Calculate and format total
    },
  ];

  const dataSource = [
    { key: 1, product: item.product, quantity: item.quantity },
  ];

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
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={3} align="right">
              <Typography.Text strong style={{ fontSize: "24px" }}>
                Total Price:
              </Typography.Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center">
              <Typography.Text strong style={{ fontSize: "24px" }}>
                ${totalPrice.toFixed(2)}
              </Typography.Text>
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
