export const getAverageRating = (ratingCount, ratingTotal) => {
  return ratingCount > 0 ? ratingTotal / ratingCount : 0;
};
