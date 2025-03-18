import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  List,
  Row,
  message,
} from "antd";
import axios from "axios";
import React from "react";
import { apiEndpoint } from "../../constants/constants";
import { useUser } from "../../contexts/UserContext";

const { TextArea } = Input;

function ReviewOrder({ setOpenModal, order }) {
  const [form] = Form.useForm();
  const { currentUser } = useUser();

  const handleCancelClick = () => {
    setOpenModal(false);
    form.resetFields();
  };
  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.post(`${apiEndpoint}/product`, {
        ...values,
        seller: currentUser._id,
      });

      // Reset form and modal
      form.resetFields();
      message.success("Product created successfully!");
      setOpenModal(false);
    } catch (error) {
      message.error("Failed to create product. Please try again.");
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></div>
      <Descriptions
        title={`Order ID: ${order._id}`}
        bordered
        column={2}
      ></Descriptions>

      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={order.items}
        renderItem={(item) => (
          <List.Item>
            <Card>
              <Card.Meta
                avatar={
                  <img
                    src={item.product.images}
                    alt={item.product.name}
                    style={{ width: "50px" }}
                  />
                }
                title={item.product.name}
                description={`Quantity: ${item.quantity} | Price: ${item.product.price}`}
              />
            </Card>
            <Form form={form} onFinish={handleFormSubmit} layout="vertical">
              <Form.Item name="comment" label="Comment:">
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item>
                <Row
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    Rate
                  </Button>
                  <Button
                    style={{ marginLeft: "10px" }}
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </Button>
                </Row>
              </Form.Item>
            </Form>
          </List.Item>
        )}
      />
    </>
  );
}

export default ReviewOrder;
