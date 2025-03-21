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
  const { product, rating, sortBy, page = 1, limit = 10 } = queryParams;

  let query = { product };

  // Filter by specific rating (1 to 5 stars)
  if (rating) {
    query.rating = parseInt(rating); // Filter by exact rating
  }

  // Sort by different criteria
  let sortOptions = {};
  if (sortBy === "date_asc") {
    sortOptions = { reviewDate: 1 }; // Ascending order for date
  } else if (sortBy === "date_desc") {
    sortOptions = { reviewDate: -1 }; // Descending order for date
  } else if (sortBy === "rating_asc") {
    sortOptions = { rating: 1 }; // Ascending order for rating
  } else if (sortBy === "rating_desc") {
    sortOptions = { rating: -1 }; // Descending order for rating
  }

  // Fetch reviews with pagination
  const reviews = await ReviewModel.find(query)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("user", "username photoUrl");

  const totalReviews = await ReviewModel.countDocuments(query);

  const allProductReviews = await ReviewModel.find({ product });

  // Get the breakdown of reviews by rating
  const ratingBreakdown = [1, 2, 3, 4, 5].map((rating) => {
    const count = allProductReviews.filter(
      (review) => review.rating === rating
    ).length;
    return { rating, count };
  });

  return {
    reviews,
    totalReviews,
    totalPages: Math.ceil(totalReviews / limit),
    ratingBreakdown,
  };
};

export const updateReview = async (id, reviewData) => {
  return await ReviewModel.findByIdAndUpdate(id, reviewData, { new: true });
};

export const deleteReview = async (id) => {
  return await ReviewModel.findByIdAndDelete(id);
};
