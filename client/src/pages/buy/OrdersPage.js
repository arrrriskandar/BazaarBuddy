import React, { useCallback, useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";
import { apiEndpoint } from "../../constants/constants";
import { message, Tabs } from "antd";
import OrderList from "../../components/order/OrderList";
import { getNotificationMessage } from "../../constants/constants";
import { useNotifications } from "../../contexts/NotificationContext";
import { useSearchParams } from "react-router-dom";

function BuyerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState("To Ship"); // Default tab
  const { sendNotification } = useNotifications();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [highlight, setHighlight] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(apiEndpoint + `/order`, {
        params: { user: currentUser._id },
      });
      setOrders(response.data);
      filterOrders(response.data, activeTab); // Filter based on default tab
    } catch (error) {
      message.error("Failed to retrieve orders. Please try again.");
      console.error("Failed to retrieve orders.", error);
    }
  }, [currentUser, activeTab]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    // If orderId is present in the URL, highlight the corresponding order
    if (orderId) {
      setHighlight(true);
      // Find the order by ID to determine the tab
      const order = orders.find((order) => order._id === orderId);
      if (order) {
        // Set the active tab based on the order's status
        setActiveTab(order.status);
      }
    }
  }, [orderId, orders]);

  const filterOrders = (allOrders, status) => {
    const filtered = allOrders.filter((order) => order.status === status);
    setFilteredOrders(filtered);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    filterOrders(orders, key);
  };

  const handleOrderStatusUpdate = async (orderId) => {
    try {
      const notificationMessage = getNotificationMessage("order_received", {
        orderId,
        buyer: currentUser.username,
      });
      // Make a PUT request to update the order status to "To Rate"
      const response = await axios.put(`${apiEndpoint}/order/${orderId}`, {
        status: "To Rate", // Update status
        notificationMessage,
        notifyBuyer: false,
        releasePayment: true,
      });
      const { notification } = response.data;
      const receiverId = notification.userId;
      sendNotification(receiverId, notification);
      message.success(`${orderId} received!`);
      fetchOrders();
    } catch (error) {
      message.error("Failed to update order status. Please try again.");
      console.error("Failed to update order status", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        {["To Ship", "To Receive", "To Rate", "Completed"].map((status) => (
          <Tabs.TabPane tab={status} key={status}>
            <OrderList
              orders={filteredOrders}
              isSellerOrder={false}
              handleOrderStatusUpdate={handleOrderStatusUpdate}
              fetchOrders={fetchOrders}
              highlight={highlight}
              orderId={orderId}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
}

export default BuyerOrdersPage;
