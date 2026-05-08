const express = require("express");
const router = express.Router();
const {
  createReviews,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews
} = require("../reviews/review.controller");
const { isAuth } = require("../../middleware/isAuth")

router.post('/', isAuth, createReviews);
router.get('/all', getAllReviews);
router.get('/product/:productId', getSingleProductReviews)
router.get('/:id', getSingleReview);
router.patch('/update/:id', isAuth, updateReview);
router.delete('/delete/:id', isAuth, deleteReview);


module.exports = router;