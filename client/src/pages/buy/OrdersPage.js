import React, { useCallback, useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";
import { apiEndpoint } from "../../constants/constants";
import { message, Tabs } from "antd";
import OrderList from "../../components/order/OrderList";

function BuyerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState("To Pay"); // Default tab

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(apiEndpoint + `/order`, {
        params: { user: currentUser._id },
      });
      setOrders(response.data);
      filterOrders(response.data, activeTab); // Filter based on default tab
    } catch (error) {
      message.error("Failed to retrieve orders");
    }
  }, [currentUser, activeTab]);
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
      // Make a PUT request to update the order status to "To Ship"
      await axios.put(`${apiEndpoint}/order/${orderId}`, {
        status: "To Rate", // Update status
      });
      message.success("Order received!");
      fetchOrders();
    } catch (error) {
      message.error("Failed to update order status: " + error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Tabs defaultActiveKey="To Pay" onChange={handleTabChange}>
        {["To Pay", "To Ship", "To Receive", "To Rate", "Completed"].map(
          (status) => (
            <Tabs.TabPane tab={status} key={status}>
              <OrderList
                orders={filteredOrders}
                isSellerOrder={false}
                handleOrderStatusUpdate={handleOrderStatusUpdate}
                fetchOrders={fetchOrders}
              />
            </Tabs.TabPane>
          )
        )}
      </Tabs>
    </div>
  );
}

export default BuyerOrdersPage;
