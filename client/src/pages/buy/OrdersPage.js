import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";
import { apiEndpoint } from "../../constants/constants";
import { message, Tabs } from "antd";
import OrderList from "../../components/order/OrderList";

function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState("To Pay"); // Default tab

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(apiEndpoint + `/order`, {
          params: { user: currentUser._id },
        });
        setOrders(response.data);
        filterOrders(response.data, activeTab); // Filter based on default tab
      } catch (error) {
        message.error("Failed to retrieve orders");
      }
    };

    if (currentUser?._id) fetchOrders();
  }, [currentUser, activeTab]); // Fetch when user changes

  const filterOrders = (allOrders, status) => {
    const filtered = allOrders.filter((order) => order.status === status);
    setFilteredOrders(filtered);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    filterOrders(orders, key);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Tabs defaultActiveKey="To Pay" onChange={handleTabChange}>
        {["To Pay", "To Ship", "To Receive", "To Rate", "Completed"].map(
          (status) => (
            <Tabs.TabPane tab={status} key={status}>
              <OrderList orders={filteredOrders} isSellerOrder={true} />
            </Tabs.TabPane>
          )
        )}
      </Tabs>
    </div>
  );
}

export default SellerOrdersPage;
