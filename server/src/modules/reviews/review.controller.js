const reviewService = require("./review.service");
const asyncWrapper = require("../../middleware/async");

const createReviews = asyncWrapper(async (req, res) => {
  const review = await reviewService.createReviews({
    ...req.body,
    userId: req.user.userId,
  });
  return res.status(201).json({ msg: "Review created successfully", review });
});

const getAllReviews = asyncWrapper(async (req, res) => {
  const reviews = await reviewService.getAllReviews();
  return res.status(200).json({ count: reviews.length, reviews });
});

const getSingleReview = asyncWrapper(async (req, res) => {
  const review = await reviewService.getSingleReview(req.params.id);
  return res.status(200).json({ review });
});

const updateReview = asyncWrapper(async (req, res) => {
  const review = await reviewService.updateReview({
    reviewId: req.params.id,
    user: req.user,
    rating: req.body.rating,
    title: req.body.title,
    comment: req.body.comment,
  });
  return res.status(200).json({ msg: "Review updated successfully", review });
});

const deleteReview = asyncWrapper(async (req, res) => {
  const review = await reviewService.deleteReview({ reviewId: req.params.id, user: req.user });
  return res.status(200).json({ msg: "Review deleted successfully", review });
});

const getSingleProductReviews = asyncWrapper(async(req, res) => {
  const reviews = await reviewService.getSingleProductReviews(req.params.productId);
  return res.status(200).json({count: reviews.length, reviews})
})

module.exports = {
  createReviews,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews
};
