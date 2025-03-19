import React from "react";
import { List } from "antd";
import OrderCard from "./OrderCard";

const OrderList = ({
  orders,
  isSellerOrder,
  handleOrderStatusUpdate,
  fetchOrders,
}) => {
  return (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={orders}
      renderItem={(order) => (
        <OrderCard
          order={order}
          isSellerOrder={isSellerOrder}
          handleOrderStatusUpdate={handleOrderStatusUpdate}
          fetchOrders={fetchOrders}
        />
      )}
    />
  );
};

export default OrderList;
