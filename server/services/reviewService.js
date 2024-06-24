import ReviewModel from "../models/reviewModel.js";

export const createReview = async (reviewData) => {
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
