const Order = require("./order.model");
const Product = require("../products/product.model");
const { BadRequestError } = require("../../errors");
const checkPermissions = require("../../utils/check-permission");

const fakeStripeAPI = async ({ amount, currency }) => {
  return {
    client_secret: "SomeRandomValue",
    paymentIntentId: "fake_payment_intent_id",
  };
};

const createOrders = async ({ userId, tax, shippingFee, orderItems }) => {
  if (!orderItems || orderItems.length < 1) {
    throw new BadRequestError("No order items provided");
  }

  if (tax === undefined || shippingFee === undefined) {
    throw new BadRequestError("Please provide tax and shipping fee");
  }

  let finalOrderItems = [];
  let subtotal = 0;

  for (const item of orderItems) {
    const dbProduct = await Product.findById(item.product);

    if (!dbProduct) {
      throw new BadRequestError(`No product with id: ${item.product}`);
    }

    const singleOrderItem = {
      name: dbProduct.name,
      image: dbProduct.image,
      price: dbProduct.price,
      amount: item.amount,
      product: dbProduct._id,
    };

    finalOrderItems.push(singleOrderItem);
    subtotal += item.amount * dbProduct.price;
  }

  const total = tax + shippingFee + subtotal;

  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    tax,
    shippingFee,
    subtotal,
    total,
    orderItems: finalOrderItems,
    user: userId,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.paymentIntentId,
  });

  return order;
};

const getAllOrders = async () => {
  return await Order.find({}).populate("user", "name email");
};

const getCurrentUserOrders = async (userId) => {
  return await Order.find({ user: userId });
};

const getSingleOrder = async ({ orderId, user }) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new BadRequestError("Order not found");
  }

  checkPermissions(user, order.user);

  return order;
};

const updateOrder = async ({ orderId, user, paymentIntentId }) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new BadRequestError("Order not found");
  }

  checkPermissions(user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";

  await order.save();

  return order;
};

module.exports = {
  createOrders,
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder,
};