const Review = require("./review.model");
const Product = require("../products/product.model");
const { BadRequestError } = require("../../errors");
const checkPermissions = require("../../utils/check-permission");

const createReviews = async ({ userId, productId, rating, title, comment }) => {
  if (!userId || !productId || !rating || !title || !comment) {
    throw new BadRequestError("All fields are required");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new BadRequestError("Product not found");
  }

  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: userId,
  });

  if (alreadyReviewed) {
    throw new BadRequestError("You have already reviewed this product");
  }

  const review = await Review.create({
    rating,
    title,
    comment,
    product: productId,
    user: userId,
  });

  return review;
};

const getAllReviews = async () => {
  const reviews = await Review.find({})
    .populate("user", "name")
    .populate("product", "name company price");

  return reviews;
};

const getSingleReview = async (reviewId) => {
  const review = await Review.findById(reviewId)
    .populate("user", "name")
    .populate("product", "name company price");

  if (!review) {
    throw new BadRequestError("Review not found");
  }

  return review;
};

const updateReview = async ({ reviewId, user, rating, title, comment }) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new BadRequestError("Review not found");
  }

  checkPermissions(user, review.user);

  review.rating = rating || review.rating;
  review.title = title || review.title;
  review.comment = comment || review.comment;

  await review.save();

  return review;
};

const deleteReview = async ({ reviewId, user }) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new BadRequestError("Review not found");
  }

  checkPermissions(user, review.user);

  await review.deleteOne();

  return review;
};

const getSingleProductReviews = async (productId) => {
  return await Review.find({ product: productId}).populate("user", "name")
}

module.exports = {
  createReviews,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews
};
