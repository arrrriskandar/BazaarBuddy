import React from "react";
import { Button, message } from "antd";
import { useNavigate, useParams } from "react-router-dom"; // Use useParams for URL params
import axios from "axios";
import { apiEndpoint } from "../constants/constants";

function PaymentPage() {
  const navigate = useNavigate();

  // Get orderId from the URL parameters
  const { orderId } = useParams();

  // Handle payment and status update
  const handlePayment = async () => {
    try {
      // Make a PUT request to update the order status to "To Ship"
      await axios.put(`${apiEndpoint}/order/${orderId}`, {
        status: "To Ship", // Update status
      });

      message.success("Payment successful!'");

      navigate(`/confirmation/${orderId}`); // Redirect to your confirmation page
    } catch (error) {
      message.error("Failed to update order status: " + error.message);
    }
  };

  return (
    <div>
      <h1>Payment Page</h1>
      <Button type="primary" onClick={handlePayment}>
        Complete Payment
      </Button>
    </div>
  );
}

export default PaymentPage;
