import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  List,
  Row,
  message,
  Rate,
  Space,
} from "antd";
import axios from "axios";
import React from "react";
import { apiEndpoint } from "../../constants/constants";
import { useUser } from "../../contexts/UserContext";
import { getNotificationMessage } from "../../constants/constants";
import { useNotifications } from "../../contexts/NotificationContext";

const { TextArea } = Input;

function ReviewOrder({ setOpenModal, order, fetchOrders }) {
  const [forms] = Form.useForm();
  const { currentUser } = useUser();
  const { sendNotification } = useNotifications();

  const handleCancelClick = () => {
    setOpenModal(false);
    forms.resetFields();
  };

  const handleFormSubmit = async (values) => {
    try {
      const reviews = transformReviews(values);

      await submitReviews(reviews);

      await updateOrderStatus(order._id);

      await fetchOrders();

      message.success("Thank you for your reviews!");
      forms.resetFields();
      setOpenModal(false);
    } catch (error) {
      console.error("Error during form submission:", error);
      message.error("Failed to submit reviews. Please try again.");
    }
  };

  // Helper function: Transforms the form values into an array of review data
  const transformReviews = (values) => {
    return Object.entries(values)
      .map(([productId, reviewData]) => {
        const product = order.items.find(
          (item) => item.product._id === productId
        );

        if (!product) {
          return null;
        }
        return {
          user: currentUser._id,
          product: product.product._id,
          comment: reviewData.comment,
          rating: reviewData.rating,
          seller: product.product.seller,
          order,
        };
      })
      .filter(Boolean); // Remove null values (products that were not found)
  };

  const submitReviews = async (reviews) => {
    const reviewPromises = reviews.map((review) =>
      axios.post(`${apiEndpoint}/review`, review)
    );

    await Promise.all(reviewPromises);
  };

  const updateOrderStatus = async (orderId) => {
    try {
      const notificationMessage = getNotificationMessage("review_received", {
        buyer: currentUser.username,
      });
      const response = await axios.put(`${apiEndpoint}/order/${orderId}`, {
        status: "Completed",
        notificationMessage,
        notifyBuyer: false,
        orderCompleted: true,
      });
      const { notification } = response.data;
      const receiverId = notification.userId;
      sendNotification(receiverId, notification);
    } catch (error) {
      message.error("Failed to update order status: " + error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Descriptions
        title={`Order ID: ${order._id}`}
        bordered
        column={2}
        style={{ textAlign: "left" }}
      />

      <Form form={forms} onFinish={handleFormSubmit} layout="vertical">
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={order.items}
          renderItem={(item) => (
            <List.Item key={item.product._id} style={{ textAlign: "left" }}>
              <Card>
                <Card.Meta
                  avatar={
                    <img
                      src={item.product.images}
                      alt={item.product.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                  }
                  title={<b>{item.product.name}</b>}
                  description={`Quantity: ${item.quantity} | Price: $${Number(
                    item.product.price
                  ).toFixed(2)}`}
                />
              </Card>

              <Form.Item
                name={[item.product._id, "rating"]}
                label={<b>Rate this product:</b>}
                rules={[
                  { required: true, message: "Please provide a rating!" },
                ]}
                style={{ textAlign: "left" }}
              >
                <Rate style={{ fontSize: "20px" }} />
              </Form.Item>

              <Form.Item
                name={[item.product._id, "comment"]}
                label={<b>Comment:</b>}
                rules={[
                  { required: true, message: "Please provide a comment!" },
                ]}
                style={{ textAlign: "left" }}
              >
                <TextArea rows={4} placeholder="Tell us more..." />
              </Form.Item>
            </List.Item>
          )}
        />

        <Form.Item>
          <Row justify="center">
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button onClick={handleCancelClick}>Cancel</Button>
            </Space>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ReviewOrder;
