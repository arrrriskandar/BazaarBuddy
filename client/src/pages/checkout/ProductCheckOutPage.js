import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Divider,
  Form,
  Button,
  Typography,
  Row,
  Col,
  Modal,
  Table,
  message,
} from "antd";
import { useUser } from "../../contexts/UserContext";
import { EditOutlined } from "@ant-design/icons";
import EditDeliveryAddressForm from "../../components/checkout/EditDeliveryAddressForm";
import axios from "axios";
import { apiEndpoint } from "../../constants/constants";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const ProductCheckout = () => {
  const location = useLocation();
  const { item } = location.state;
  const { currentUser } = useUser();
  const [visible, setVisible] = useState(false);
  const [address, setAddress] = useState(currentUser.address);
  const [unitNumber, setUnitNumber] = useState(currentUser.unitNumber);
  const navigate = useNavigate();

  const onFinish = async () => {
    try {
      const totalPrice = item.quantity * item.product.price;
      const response = await axios.post(`${apiEndpoint}/order`, {
        user: currentUser._id,
        seller: item.product.seller,
        items: [{ product: item.product._id, quantity: item.quantity }],
        totalPrice: totalPrice,
        shippingAddress: address,
        unitNumber: unitNumber,
      });
      const orderId = response.data._id;
      navigate(`/payment/${orderId}`);
    } catch (error) {
      message.error("Failed to place order: " + error.message);
    }
  };

  const handleOpenModal = () => {
    setVisible(true);
  };

  const totalPrice = item.quantity * item.product.price;

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
            Shipping Address: {address}
            {unitNumber && `, Unit Number: ${unitNumber}`}
          </h3>
        </Col>
        <Col>
          <Button
            shape={"round"}
            type="primary"
            icon={<EditOutlined />}
            onClick={handleOpenModal}
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
