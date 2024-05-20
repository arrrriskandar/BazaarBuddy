import UserModel from "../models/userModel.js";

export const createUser = async (userData) => {
  const user = new UserModel(userData);
  return await user.save();
};
