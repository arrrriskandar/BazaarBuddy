import UserModel from "../models/userModel.js";

export const createUser = async (userData) => {
  const user = new UserModel(userData);
  return await user.save();
};

export const getUser = async (id) => {
  return await UserModel.findById(id);
};

export const updateUser = async (id, userData) => {
  return await UserModel.findByIdAndUpdate(id, userData, { new: true });
};

export const deleteUser = async (id) => {
  return await UserModel.findByIdAndDelete(id);
};
