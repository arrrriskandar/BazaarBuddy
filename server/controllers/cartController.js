import {
  addToCart,
  deleteCart,
  getCart,
  getCarts,
  updateCartItemQuantity,
  removeCartItem,
} from "../services/cartService.js";

export const addToCartController = async (req, res) => {
  try {
    const cart = await addToCart(req.body);
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCartController = async (req, res) => {
  try {
    const cart = await getCart(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCartsController = async (req, res) => {
  try {
    const carts = await getCarts(req.params.userId);
    res.json(carts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCartItemQuantityController = async (req, res) => {
  try {
    const updatedCart = await updateCartItemQuantity(
      req.params.id,
      req.body.product,
      req.body.quantity
    );
    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeCartItemController = async (req, res) => {
  try {
    const updatedCart = await removeCartItem(req.params.id, req.body.product);
    if (!updatedCart) {
      res.json({ message: "Cart deleted" });
    }
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCartController = async (req, res) => {
  try {
    const deletedCart = await deleteCart(req.params.id);
    if (!deletedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json({ message: "Cart deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
