import React, { useCallback, useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";
import { apiEndpoint } from "../../constants/constants";
import { message, Tabs } from "antd";
import OrderList from "../../components/order/OrderList";
import { useSocket } from "../../contexts/SocketContext";
import { getNotificationMessage } from "../../constants/constants";

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState("To Ship");
  const { sendNotification } = useSocket();

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/order`, {
        params: { seller: currentUser._id },
      });
      setOrders(response.data);
    } catch (error) {
      message.error("Failed to retrieve orders");
    }
  }, [currentUser]);
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, activeTab]);

  useEffect(() => {
    // Filter orders based on active tab status
    if (activeTab === "To Ship") {
      setFilteredOrders(orders.filter((order) => order.status === "To Ship"));
    } else if (activeTab === "Shipped") {
      setFilteredOrders(
        orders.filter((order) => order.status === "To Receive")
      );
    } else if (activeTab === "Completed") {
      setFilteredOrders(
        orders.filter(
          (order) => order.status === "Completed" || order.status === "To Rate"
        )
      );
    }
  }, [activeTab, orders]);

  const handleOrderStatusUpdate = async (orderId) => {
    const notificationMessage = getNotificationMessage("order_shipped", {
      orderId,
      seller: currentUser.username,
    });
    try {
      const response = await axios.put(`${apiEndpoint}/order/${orderId}`, {
        status: "To Receive", // Update status
        notificationMessage,
        notifyBuyer: true,
      });
      const receiverId = response.data.user;
      const { notification } = response.data;
      sendNotification(receiverId, notification);
      message.success("Order shipped!");
      fetchOrders();
    } catch (error) {
      message.error("Failed to update order status: " + error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="To Ship" key="To Ship" />
        <Tabs.TabPane tab="Shipped" key="Shipped" />
        <Tabs.TabPane tab="Completed" key="Completed" />
      </Tabs>
      <OrderList
        orders={filteredOrders}
        isSellerOrder={true}
        handleOrderStatusUpdate={handleOrderStatusUpdate}
      />
    </div>
  );
};

export default SellerOrdersPage;
