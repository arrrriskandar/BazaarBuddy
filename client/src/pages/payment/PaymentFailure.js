import { message, Spin } from "antd";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PaymentFailure() {
  const navigate = useNavigate();
  useEffect(() => {
    message.error("Payment failed. Please try again.");
    const data = JSON.parse(localStorage.getItem("checkOutData"));

    if (data) {
      if (data.cartCheckout) {
        navigate("/cart/checkout", {
          state: { selectedItems: data.selectedItems },
        });
      } else {
        navigate("/buy/checkout", { state: { item: data.item } });
      }

      localStorage.removeItem("checkOutData");
    }
  });

  return <Spin size="large" style={{ margin: "20px auto" }} />;
}

export default PaymentFailure;
