import React, { useEffect, useState } from "react";
import { message, Spin } from "antd"; // Add Spin for loading indicator
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiEndpoint } from "../constants/constants";
import OrderCard from "../components/order/OrderCard";
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
      <OrderCard
        order={order}
        isSellerOrder={order.seller._id !== currentUser._id}
      />
    </div>
  );
}

export default ConfirmationPage;
