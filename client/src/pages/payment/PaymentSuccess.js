import React, { useEffect, useRef } from "react";
import { message, Spin } from "antd"; // Add Spin for loading indicator
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import { useCart } from "../../contexts/CartContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { apiEndpoint, getNotificationMessage } from "../../constants/constants";
import { useSocket } from "../../contexts/SocketContext";

function PaymentSuccess() {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { stripeSessionId } = useParams();
  const data = JSON.parse(localStorage.getItem("checkOutData"));
  const { deleteCart, removeFromCart } = useCart();
  const { sendNotification } = useNotifications();
  const effectCalled = useRef(false);
  const { socketReady } = useSocket();

  const {
    item,
    shippingAddress,
    unitNumber,
    totalPrice,
    cartCheckout,
    seller,
    selectedItems,
  } = data;

  const items = cartCheckout
    ? selectedItems.items.map((i) => ({
        product: i.product._id,
        quantity: i.quantity,
      }))
    : [{ product: item.product._id, quantity: item.quantity }];

  useEffect(() => {
    if (
      effectCalled.current ||
      !stripeSessionId ||
      !currentUser ||
      !socketReady
    )
      return;
    message.success("Payment successful. Thank you for shopping with us!");
    effectCalled.current = true;
    const notificationMessage = getNotificationMessage("order_placed", {
      buyer: currentUser.username,
    });
    const createOrder = async () => {
      try {
        const response = await axios.post(`${apiEndpoint}/order`, {
          user: currentUser._id,
          seller,
          items,
          totalPrice,
          shippingAddress,
          unitNumber,
          notificationMessage,
          stripeSessionId,
        });

        const { order, notification } = response.data;
        handleCart();
        const receiverId = notification.userId;
        sendNotification(receiverId, notification);
        navigate(`/order/confirmation/${order._id}`);
        localStorage.removeItem("checkOutData");
      } catch (error) {
        message.error("Failed to create order. Please try again.");
        console.error("Failed to create order", error);
      }
    };

    createOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripeSessionId, currentUser, socketReady]);

  const handleCart = async () => {
    if (cartCheckout) {
      if (selectedItems.allItemsChecked) {
        // If the user has selected all items, delete the entire cart
        await deleteCart(selectedItems.cartId);
      } else {
        // Otherwise, remove items from the cart
        for (let i of items) {
          await removeFromCart(selectedItems.cartId, i.product);
        }
      }
    }
  };

  return <Spin size="large" style={{ margin: "20px auto" }} />;
}

export default PaymentSuccess;
