import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} from "../services/reviewService.js";

export const createReviewController = async (req, res) => {
  try {
    const review = await createReview(req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getReviewController = async (req, res) => {
  try {
    const review = await getReview(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getReviewsController = async (req, res) => {
  try {
    const reviews = await getReviews(req.query);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateReviewController = async (req, res) => {
  try {
    const updatedReview = await updateReview(req.params.id, req.body);
    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(updatedReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteReviewController = async (req, res) => {
  try {
    const deletedReview = await deleteReview(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
