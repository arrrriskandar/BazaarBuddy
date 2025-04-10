import React, { useEffect, useState } from "react";
import { Button, message, Spin } from "antd"; // Add Spin for loading indicator
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { apiEndpoint } from "../constants/constants";
import OrderCard from "../components/order/OrderCard";
import { useUser } from "../contexts/UserContext";

function OrderConfirmationPage() {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `${apiEndpoint}/order/${orderId}/${currentUser}`
        );
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        message.error("Failed to retrieve order. Please try again.");
        console.error("Failed to retrieve order", error);
        setLoading(false); // Stop loading if there's an error
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, currentUser]);

  const handleViewOrder = () => {
    navigate("/buy/order");
  };

  const handleContinueShopping = () => {
    navigate("/buy/product"); // Redirect to the product listing page
  };

  if (loading) {
    return <Spin size="large" style={{ margin: "20px auto" }} />; // Loading spinner
  }

  if (!order) {
    return <div>Order not found</div>; // Display a message if the order is null
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Order Confirmed!</h1>
      <p>
        Your order has been successfully placed. Thank you for shopping with us!
      </p>

      {/* Conditionally render OrderCard only if order is available */}
      <div style={{ padding: "20px" }}>
        <OrderCard order={order} isSellerOrder={false} />
      </div>

      <div style={{ marginTop: "20px" }}>
        <Button
          type="primary"
          style={{ marginRight: "10px" }}
          onClick={handleViewOrder}
        >
          View Purchases
        </Button>
        <Button type="default" onClick={handleContinueShopping}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
