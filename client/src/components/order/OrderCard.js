import React from "react";
import { List, Card, Descriptions, Divider } from "antd";

function OrderCard({ order, isSellerOrder }) {
  return (
    <List.Item>
      <Card style={{ marginBottom: "20px" }}>
        <Descriptions title={`Order ID: ${order._id}`} bordered column={2}>
          {isSellerOrder ? (
            <Descriptions.Item label="Buyer">
              {order.user.username}
            </Descriptions.Item>
          ) : (
            <Descriptions.Item label="Seller">
              {order.seller.username}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Total Price">
            ${order.totalPrice}
          </Descriptions.Item>
          <Descriptions.Item label="Status">{order.status}</Descriptions.Item>
          <Descriptions.Item label="Order Date">
            {new Date(order.orderDate).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Shipping Address">
            {order.shippingAddress} {order.unitNumber}
          </Descriptions.Item>
        </Descriptions>
        <Divider orientation="left">Items</Divider>
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={order.items}
          renderItem={(item) => (
            <List.Item>
              <Card>
                <Card.Meta
                  avatar={
                    <img
                      src={item.product.images}
                      alt={item.product.name}
                      style={{ width: "50px" }}
                    />
                  }
                  title={item.product.name}
                  description={`Quantity: ${item.quantity} | Price: ${item.product.price}`}
                />
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </List.Item>
  );
}

export default OrderCard;
