import ProductModel from "../models/productModel.js";

export const updateProductRating = async (productId, rating) => {
  try {
    // Update the rating count and total
    return await ProductModel.findByIdAndUpdate(
      productId,
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
