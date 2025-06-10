import React from "react";
import { List } from "antd";
import OrderCard from "./OrderCard";

const OrderList = ({
  orders,
  isSellerOrder,
  handleOrderStatusUpdate,
  fetchOrders,
  highlight,
  orderId,
}) => {
  return (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={orders}
      locale={{ emptyText: "No orders" }}
      renderItem={(order) => (
        <OrderCard
          key={order._id}
          order={order}
          isSellerOrder={isSellerOrder}
          handleOrderStatusUpdate={handleOrderStatusUpdate}
          fetchOrders={fetchOrders}
          highlight={highlight}
          orderId={orderId}
        />
      )}
    />
  );
};

export default OrderList;
