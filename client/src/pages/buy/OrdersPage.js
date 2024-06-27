import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";
import { apiEndpoint } from "../../constants/constants";
import { message } from "antd";
import OrderList from "../../components/order/OrderList";

function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const { currentUser } = useUser();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(apiEndpoint + `/order`, {
          params: { user: currentUser._id },
        });
        setOrders(response.data);
      } catch (error) {
        message.error("Failed to retrieve orders");
      }
    };

    fetchOrders();
  }, [currentUser]);
  return (
    <div style={{ padding: "20px" }}>
      <OrderList orders={orders} isSellerOrder={false} />
    </div>
  );
}

export default SellerOrdersPage;
