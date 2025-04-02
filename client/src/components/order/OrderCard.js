import React, { useEffect, useRef, useState } from "react";
import { List, Card, Descriptions, Divider, Button, Modal } from "antd";
import ReviewOrder from "./ReviewOrder";
import ChatNowButton from "../common/ChatNowButton";

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
  const user = isSellerOrder ? order.user : order.seller;

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
          <Descriptions.Item label="Buyer">{user.username}</Descriptions.Item>
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
        <div
          style={{
            display: "flex",
            justifyContent: "center", // Center the buttons
            gap: "10px", // Space between the buttons
            marginTop: "10px",
          }}
        >
          <ChatNowButton receiverId={user._id}></ChatNowButton>
          {!isSellerOrder && order.status === "To Rate" && (
            <Button type="primary" onClick={() => setOpenModal(true)}>
              Rate
            </Button>
          )}
          {((isSellerOrder && order.status === "To Ship") ||
            (!isSellerOrder && order.status === "To Receive")) && (
            <Button
              type="primary"
              onClick={() => handleOrderStatusUpdate(order._id)}
            >
              {isSellerOrder ? "Shipped" : "Received"}
            </Button>
          )}
        </div>
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
