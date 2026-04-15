import ProductModel from "../models/productModel.js";

export const updateProductRating = async (productId, rating) => {
  try {
    const product = await ProductModel.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    const newCount = product.ratingCount + 1;
    const newTotal = product.ratingTotal + rating;
    const newAverage = newTotal / newCount;

    product.ratingCount = newCount;
    product.ratingTotal = newTotal;
    product.averageRating = newAverage;

    return await product.save();
  } catch (error) {
    throw new Error("Error updating product rating: " + error.message);
  }
};
