import React, { useCallback, useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";
import { apiEndpoint } from "../../constants/constants";
import { message, Tabs } from "antd";
import OrderList from "../../components/order/OrderList";
import { getNotificationMessage } from "../../constants/constants";
import { useNotifications } from "../../contexts/NotificationContext";
import { useSearchParams } from "react-router-dom";

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState("To Ship");
  const { sendNotification } = useNotifications();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [highlight, setHighlight] = useState(false);

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

  useEffect(() => {
    if (orderId) {
      // If there's an orderId in the URL, set the highlight flag to true
      setHighlight(true);

      // Find the order by ID to determine the tab to open
      const order = orders.find((order) => order._id === orderId);
      if (order) {
        // Set the active tab based on the order status
        if (order.status === "To Ship") {
          setActiveTab("To Ship");
        } else if (order.status === "To Receive") {
          setActiveTab("Shipped");
        } else if (order.status === "Completed" || order.status === "To Rate") {
          setActiveTab("Completed");
        }
      }
    }
  }, [orderId, orders]);

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
      const { notification } = response.data;
      const receiverId = notification.userId;
      sendNotification(receiverId, notification);
      message.success(`${orderId} shipped!`);
      fetchOrders();
    } catch (error) {
      message.error("Failed to update order status. Please try again.");
      console.error("Failed to update order status", error);
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
        highlight={highlight}
        fetchOrders={fetchOrders}
        orderId={orderId}
      />
    </div>
  );
};

export default SellerOrdersPage;
