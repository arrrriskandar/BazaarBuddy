import UserModel from "../models/userModel.js";

export const updateUserRating = async (id, rating) => {
  try {
    const user = await UserModel.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    const newCount = user.ratingCount + 1;
    const newTotal = user.ratingTotal + rating;
    const newAverage = newTotal / newCount;

    user.ratingCount = newCount;
    user.ratingTotal = newTotal;
    user.averageRating = newAverage;

    return await user.save();
  } catch (error) {
    throw new Error("Error updating user rating: " + error.message);
  }
};
