import React from "react";
import { Button, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiEndpoint } from "../constants/constants";
import { useCart } from "../contexts/CartContext";
import { useSocket } from "../contexts/SocketContext";
import { useUser } from "../contexts/UserContext";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { deleteCart, removeFromCart } = useCart();
  const { getNotificationMessage, sendNotification } = useSocket();
  const { currentUser } = useUser();

  const { selectedItems, item, address, unitNumber, totalPrice, cartCheckout } =
    location.state;

  const handlePayment = async () => {
    try {
      // Create the order data (either cartCheckout or single product)
      const seller = cartCheckout
        ? selectedItems.items[0].product.seller
        : item.product.seller;
      const items = cartCheckout
        ? selectedItems.items.map((i) => ({
            product: i.product._id,
            quantity: i.quantity,
          }))
        : [{ product: item.product._id, quantity: item.quantity }];

      const notificationMessage = getNotificationMessage("order_placed", {
        buyer: currentUser.username,
      });

      // Make the request to create an order
      const response = await axios.post(`${apiEndpoint}/order`, {
        user: currentUser._id,
        seller,
        items,
        totalPrice,
        shippingAddress: address,
        unitNumber,
        notificationMessage,
      });

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
      sendNotification(seller._id, notificationMessage);
      message.success("Thank you for your purchase!");
      navigate(`/confirmation/${response.data._id}`);
    } catch (error) {
      // Handle the case if payment fails
      message.error("Payment failed. Please try again.");
      console.log(error);

      // Redirect to the previous page based on whether it was cart or product checkout
      if (cartCheckout) {
        navigate("/cart/checkout", {
          state: { selectedItems }, // ✅ Keeps the selected cart items
        });
      } else {
        navigate("/buy/checkout", {
          state: { item },
        });
      }
    }
  };

  return (
    <div>
      <h1>Payment Page</h1>
      <Button type="primary" onClick={handlePayment}>
        Complete Payment
      </Button>
    </div>
  );
};

export default PaymentPage;
