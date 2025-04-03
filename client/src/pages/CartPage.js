import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { List, message, Divider, Button } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import CartActions from "../components/cart/CartActions";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";

const Cart = () => {
  const { carts, removeFromCart, updateQuantity, deleteCart } = useCart();
  const [checkedItems, setCheckedItems] = useState({});

  const handleRemove = async (id, product) => {
    try {
      await removeFromCart(id, product);
      message.success("Product removed from cart!");
    } catch (error) {
      message.error("Failed to remove item from cart. Please try again");
      console.log("Failed to remove item from cart", error);
    }
  };

  const handleDeleteCart = async (id) => {
    try {
      await deleteCart(id);
      message.success("Cart deleted!");
    } catch (error) {
      message.error("Failed to delete cart. Please try again");
      message.error("Failed to delete cart", error);
    }
  };

  const handleQuantityChange = async (id, product, quantity) => {
    try {
      await updateQuantity(id, product, quantity);
      setCheckedItems((prevCheckedItems) => {
        const newCheckedItems = { ...prevCheckedItems };
        if (newCheckedItems[`${id}-${product}`]) {
          newCheckedItems[`${id}-${product}`] = true;
        }
        return newCheckedItems;
      });
    } catch (error) {
      message.error("Failed to update quantity. Please try again");
      console.error("Failed to update quantity.", error.message);
    }
  };

  const handleCheckboxChange = (cartId, productId, checked) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [`${cartId}-${productId}`]: checked,
    }));
  };

  const handleCheckAllChange = (cartId, checked) => {
    const newCheckedItems = {};
    carts
      .find((cart) => cart._id === cartId)
      .items.forEach((item) => {
        newCheckedItems[`${cartId}-${item.product._id}`] = checked;
      });
    setCheckedItems(newCheckedItems);
  };

  const isChecked = (cartId, productId) => {
    return checkedItems[`${cartId}-${productId}`] || false;
  };

  const getTotalCheckedItems = (cartId) => {
    let totalItems = 0;
    carts
      .find((cart) => cart._id === cartId)
      .items.forEach((item) => {
        if (checkedItems[`${cartId}-${item.product._id}`]) {
          totalItems += item.quantity;
        }
      });
    return totalItems;
  };

  const getTotalCheckedPrice = (cartId) => {
    let totalPrice = 0;
    carts
      .find((cart) => cart._id === cartId)
      .items.forEach((item) => {
        if (checkedItems[`${cartId}-${item.product._id}`]) {
          totalPrice += item.product.price * item.quantity;
        }
      });
    return totalPrice.toFixed(2);
  };

  const handleBuyNow = (cartId) => {
    const cart = carts.find((cart) => cart._id === cartId);
    const items = cart.items.filter(
      (item) => checkedItems[`${cartId}-${item.product._id}`]
    );
    const allItemsChecked = items.length === cart.items.length;
    return { cartId, items, allItemsChecked };
  };

  return (
    <div>
      {carts.length > 0 ? (
        <>
          {carts.map((cart) => {
            return (
              <div
                key={cart._id}
                style={{
                  marginBottom: "20px",
                  border: "1px solid #e8e8e8",
                  padding: "10px",
                }}
              >
                <CartActions
                  cart={cart}
                  handleDeleteCart={handleDeleteCart}
                  handleCheckAllChange={handleCheckAllChange}
                />
                <List
                  itemLayout="horizontal"
                  dataSource={cart.items}
                  renderItem={(item) => (
                    <CartItem
                      cartId={cart._id}
                      item={item}
                      isChecked={isChecked}
                      handleCheckboxChange={handleCheckboxChange}
                      handleQuantityChange={handleQuantityChange}
                      handleRemove={handleRemove}
                      cart={cart}
                    />
                  )}
                />
                <Divider />
                <CartSummary
                  totalItems={getTotalCheckedItems(cart._id)}
                  totalPrice={getTotalCheckedPrice(cart._id)}
                  handleBuyNow={handleBuyNow(cart._id)}
                />
              </div>
            );
          })}
        </>
      ) : (
        <div
          style={{
            display: "flex",
            minHeight: "50vh",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h2>Your cart is empty</h2>
          <Button type="primary" icon={<ShoppingOutlined />}>
            <Link to="/buy/product">Continue Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
