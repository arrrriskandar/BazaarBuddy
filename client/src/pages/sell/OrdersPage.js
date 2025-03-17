import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";
import { apiEndpoint } from "../../constants/constants";
import { message, Tabs } from "antd";
import OrderList from "../../components/order/OrderList";

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState("To Ship");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/order`, {
          params: { seller: currentUser._id },
        });
        setOrders(response.data);
      } catch (error) {
        message.error("Failed to retrieve orders");
      }
    };

    fetchOrders();
  }, [currentUser]);

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

  return (
    <div style={{ padding: "20px" }}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="To Ship" key="To Ship" />
        <Tabs.TabPane tab="Shipped" key="Shipped" />
        <Tabs.TabPane tab="Completed" key="Completed" />
      </Tabs>
      <OrderList orders={filteredOrders} isSellerOrder={true} />
    </div>
  );
};

export default SellerOrdersPage;
