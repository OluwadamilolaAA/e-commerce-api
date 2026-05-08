const orderService = require("./order.service");
const { UnauthorizedError } = require("../../errors");
const asyncWrapper = require("../../middleware/async");

const createOrders = asyncWrapper(async (req, res) => {
  const order = await orderService.createOrders({
    userId: req.user.userId,
    orderItems: req.body.orderItems,
    tax: req.body.tax,
    shippingFee: req.body.shippingFee,
  });
  return res.status(201).json({ msg: "Order created successfully", order });
});

const getAllOrders = asyncWrapper(async (req, res) => {
  const orders = await orderService.getAllOrders();
  return res.status(200).json({ count: orders.length, orders });
});

const getCurrentUserOrders = asyncWrapper(async (req, res) => {
  const orders = await orderService.getCurrentUserOrders(req.user.userId);
  return res.status(200).json({ count: orders.length, orders });
});

const getSingleOrder = asyncWrapper(async (req, res) => {
  const order = await orderService.getSingleOrder({
    orderId: req.params.id,
    user: req.user,
  });
  return res.status(200).json({ order });
});

const updateOrder = asyncWrapper(async (req, res) => {
  const order = await orderService.updateOrder({
    orderId: req.params.id,
    user: req.user,
    paymentIntentId: req.body.paymentIntentId,
  });

  return res.status(200).json({
    msg: "Order updated successfully",
    order,
  });
});
module.exports = {
  createOrders,
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder
};
