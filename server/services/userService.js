import UserModel from "../models/userModel.js";
import { createStripeCustomer } from "./stripeService.js";

export const createUser = async (userData) => {
  const { username, email } = userData;
  const customer = await createStripeCustomer(username, email);
  const user = new UserModel({ ...userData, stripeCustomerId: customer.id });
  return await user.save();
};

export const getUser = async (userId) => {
  return await UserModel.findById(userId);
};

export const updateUser = async (userId, userData) => {
  return await UserModel.findByIdAndUpdate(userId, userData, { new: true });
};

export const deleteUser = async (userId) => {
  return await UserModel.findByIdAndDelete(userId);
};
