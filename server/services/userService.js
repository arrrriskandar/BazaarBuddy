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

export const getUserBySupabaseId = async (supabaseId) => {
  return await UserModel.findOne({ supabaseId });
};

export const updateUser = async (userId, userData) => {
  const user = await getUser(userId);

  if (!user) throw new Error("User not found");

  const update = { ...userData };

  if (update.photoUrl !== undefined) {
    update.photoVersion = (user.photoVersion || 0) + 1;
  }

  return await UserModel.findByIdAndUpdate(userId, update, {
    new: true,
  });
};

export const deleteUser = async (userId) => {
  return await UserModel.findByIdAndDelete(userId);
};
