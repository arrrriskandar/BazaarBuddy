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
  const [carts, setCarts] = useState([]);

  const fetchCarts = useCallback(async () => {
    if (currentUser) {
      try {
        const response = await axios.get(
          `${apiEndpoint}/cart/user/${currentUser._id}`
        );
        setCarts(response.data);
      } catch (error) {
        console.error("Failed to retrieve cart items: ", error.message);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    fetchCarts();
  }, [currentUser, fetchCarts]);

  const addToCart = async (product, quantity) => {
    try {
      await axios.post(`${apiEndpoint}/cart`, {
        product: product._id,
        quantity,
        user: currentUser._id,
        seller: product.seller,
      });
      await fetchCarts();
    } catch (error) {
      console.error("Failed to add to cart: ", error.message);
    }
  };

  const updateQuantity = async (id, product, quantity) => {
    try {
      await axios.put(`${apiEndpoint}/cart/updateQuantity/${id}`, {
        product,
        quantity,
      });
      fetchCarts();
    } catch (error) {
      console.error("Failed to update quantity: ", error.message);
    }
  };

  const removeFromCart = async (id, product) => {
    try {
      await axios.put(`${apiEndpoint}/cart/removeItem/${id}`, { product });
      fetchCarts();
    } catch (error) {
      console.error("Failed to remove item from cart: ", error.message);
    }
  };

  const deleteCart = async (id) => {
    try {
      await axios.delete(`${apiEndpoint}/cart/${id}`);
      fetchCarts();
    } catch (error) {
      console.error("Failed to delete cart: ", error.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        carts,
        addToCart,
        removeFromCart,
        updateQuantity,
        deleteCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
