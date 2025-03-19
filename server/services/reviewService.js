import ReviewModel from "../models/reviewModel.js";
import { updateProductRating } from "../utils/productRatingUpdate.js";
import { updateUserRating } from "../utils/userRatingUpdate.js";

export const createReview = async (reviewData) => {
  const { product, rating, seller } = reviewData;
  await updateProductRating(product, rating);
  await updateUserRating(seller, rating);
  const review = new ReviewModel(reviewData);
  return await review.save();
};

export const getReview = async (id) => {
  return await ReviewModel.findById(id);
};

export const getReviews = async (queryParams) => {
  return await ReviewModel.find(queryParams);
};

export const updateReview = async (id, reviewData) => {
  return await ReviewModel.findByIdAndUpdate(id, reviewData, { new: true });
};

export const deleteReview = async (id) => {
  return await ReviewModel.findByIdAndDelete(id);
};
