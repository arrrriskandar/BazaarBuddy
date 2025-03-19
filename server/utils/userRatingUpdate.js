import UserModel from "../models/userModel.js";

export const updateUserRating = async (id, rating) => {
  try {
    // Update the rating count and total
    return await UserModel.findByIdAndUpdate(
      id,
      {
        $inc: {
          ratingCount: 1, // Increment rating count
          ratingTotal: rating, // Add the new rating to the total
        },
      },
      { new: true } // Return the updated product
    );
  } catch (error) {
    throw new Error("Error updating product rating: " + error.message);
  }
};
