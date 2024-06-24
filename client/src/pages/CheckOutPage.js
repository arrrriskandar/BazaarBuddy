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
import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { EditOutlined } from "@ant-design/icons";
import getColumns from "../components/checkout/Columns";
import EditDeliveryAddressForm from "../components/checkout/EditDeliveryAddressForm";
import axios from "axios";
import { apiEndpoint } from "../constants/constants";
const { Text } = Typography;

const Checkout = () => {
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };
  const { currentUser } = useUser();
  const [visible, setVisible] = useState(false);
  const [address, setAddress] = useState(currentUser.address);
  const [unitNumber, setUnitNumber] = useState(currentUser.unitNumber);

  const onFinish = async () => {
    try {
      const items = selectedItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));
      await axios.post(`${apiEndpoint}/order`, {
        user: currentUser._id,
        seller: selectedItems[0].product.seller,
        items: items,
        totalPrice: totalPrice,
        shippingAddress: address,
        unitNumber: unitNumber,
      });
      message.success("Order placed");
    } catch (error) {
      message.error("Failed to place order: ", error);
    }
  };

  const handleOpenModal = () => {
    setVisible(true);
  };
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  const columns = getColumns();

  const dataSource = selectedItems.map((item, index) => ({
    key: index,
    product: item.product,
    quantity: item.quantity,
    price: item.product.price,
    total: item.quantity * item.product.price,
  }));

  return (
    <div style={{ padding: "20px" }}>
      {JSON.stringify(selectedItems)}
      <h1>Checkout</h1>
      <Row></Row>
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

export default Checkout;
