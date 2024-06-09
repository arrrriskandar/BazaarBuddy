import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { apiEndpoint } from "../constants/constants";
import { useUser } from "./UserContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useUser();
  const [cart, setCart] = useState([]);

  const fetchCart = useCallback(async () => {
    if (currentUser) {
      try {
        const response = await axios.get(
          `${apiEndpoint}/cart/user/${currentUser._id}`
        );
        setCart(response.data);
      } catch (error) {
        console.error("Failed to retrieve cart items: ", error.message);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCart();
  }, [currentUser, fetchCart]);

  const addToCart = async (productId, quantity) => {
    try {
      await axios.post(`${apiEndpoint}/cart`, {
        productId,
        quantity,
        userId: currentUser._id,
      });
      await fetchCart();
    } catch (error) {
      console.error("Failed to add to cart: ", error.message);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`${apiEndpoint}/cart/${cartItemId}`);
      fetchCart();
    } catch (error) {
      console.error("Failed to remove item from cart: ", error.message);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
