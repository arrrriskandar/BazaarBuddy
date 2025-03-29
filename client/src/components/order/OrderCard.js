import React, { useEffect, useRef, useState } from "react";
import { List, Card, Descriptions, Divider, Button, Modal, Alert } from "antd";
import ReviewOrder from "./ReviewOrder";

function OrderCard({
  order,
  isSellerOrder,
  handleOrderStatusUpdate,
  fetchOrders,
  highlight,
  orderId,
}) {
  const [openModal, setOpenModal] = useState(false);
  const cardRef = useRef(null);
  useEffect(() => {
    // Scroll to the highlighted order if it matches the orderId
    if (highlight && order._id === orderId) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [highlight, order._id, orderId]);

  return (
    <List.Item style={{ listStyleType: "none" }} ref={cardRef}>
      <Card
        style={{
          marginBottom: "20px",
          borderColor:
            highlight && order._id === orderId ? "#0000FF" : "#f0f0f0",
        }}
      >
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
        {!isSellerOrder && order.status === "To Rate" && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="primary" onClick={() => setOpenModal(true)}>
              Rate
            </Button>
          </div>
        )}
        {((isSellerOrder && order.status === "To Ship") ||
          (!isSellerOrder && order.status === "To Receive")) && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={() => handleOrderStatusUpdate(order._id)}
            >
              {isSellerOrder ? "Shipped Order" : "Received Order"}
            </Button>
          </div>
        )}
      </Card>

      <Modal
        open={openModal}
        footer={null}
        closable={false}
        centered={true}
        width={800}
      >
        <ReviewOrder
          setOpenModal={setOpenModal}
          order={order}
          fetchOrders={fetchOrders}
        />
      </Modal>
    </List.Item>
  );
}

export default OrderCard;
