import cartModel from "../models/cartModel.js";
import CartModel from "../models/cartModel.js";

export const createCart = async (cartData) => {
  const cart = new cartModel(cartData);
  return await cart.save();
};

export const getCart = async (id) => {
  return await cartModel.findById(id).populate("productId");
};

export const getCarts = async (userId) => {
  const sortOptions = { updatedAt: -1 };
  return await cartModel
    .find({ userId })
    .populate("productId")
    .sort(sortOptions);
};

export const updateCart = async (id, cartData) => {
  cartData.updatedAt = Date.now();
  return await cartModel.findByIdAndUpdate(id, cartData, { new: true });
};

export const deleteCart = async (id) => {
  return await cartModel.findByIdAndDelete(id);
};
