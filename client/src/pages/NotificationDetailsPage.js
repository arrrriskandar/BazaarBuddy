import React, { useEffect, useState } from "react";
import { Descriptions, Divider, message, Spin, List, Card } from "antd"; // Add Spin for loading indicator
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiEndpoint } from "../constants/constants";
import { useUser } from "../contexts/UserContext";

function ConfirmationPage() {
  const { orderId } = useParams();
  const { currentUser } = useUser();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `${apiEndpoint}/order/${orderId}/${currentUser._id}`
        );
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        message.error("Failed to retrieve orders");
        setLoading(false); // Stop loading if there's an error
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, currentUser]);

  if (loading) {
    return <Spin size="large" style={{ margin: "20px auto" }} />; // Loading spinner
  }

  if (!order) {
    return <div>Order not found</div>; // Display a message if the order is null
  }

  return (
    <div style={{ padding: "20px" }}>
      <Descriptions title={`Order ID: ${order._id}`} bordered column={2}>
        {order.seller._id !== currentUser._id ? (
          <Descriptions.Item label="Buyer">
            {order.user.username}
          </Descriptions.Item>
        ) : (
          <Descriptions.Item label="Seller">
            {order.seller.username}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Total Price">
          ${order.totalPrice}
        </Descriptions.Item>
        <Descriptions.Item label="Status">{order.status}</Descriptions.Item>
        <Descriptions.Item label="Order Date">
          {new Date(order.orderDate).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Shipping Address">
          {order.shippingAddress} {order.unitNumber}
        </Descriptions.Item>
      </Descriptions>
      <Divider orientation="left">Items</Divider>
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
          </List.Item>
        )}
      />
    </div>
  );
}

export default ConfirmationPage;
