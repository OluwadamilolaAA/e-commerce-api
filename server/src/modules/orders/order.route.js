const express = require("express");
const router = express.Router();
const {
  createOrders,
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder,
} = require("./order.controller");

const { isAuth, authorizePermission } = require("../../middleware/isAuth")

router.post('/', isAuth, createOrders);
router.get('/get-all', authorizePermission('admin'), getAllOrders);
router.get('/show-my-orders', isAuth, getCurrentUserOrders);
router.get('/:id', isAuth, getSingleOrder);
router.patch('/update/:id', isAuth, updateOrder)

module.exports = router