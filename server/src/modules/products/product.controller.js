const productService = require("./product.service");
const asyncWrapper = require("../../middleware/async");
const { BadRequestError } = require("../../errors");

const createProducts = asyncWrapper(async (req, res) => {
  const product = await productService.createProducts({
    ...req.body,
    userId: req.user.userId,
  });
  return res.status(201).json({ msg: "Product created successfully", product });
});

const getAllProducts = asyncWrapper(async (req, res) => {
  const products = await productService.getAllProducts();
  return res.status(200).json({ count: products.length, products });
});

const getProduct = asyncWrapper(async (req, res) => {
  const product = await productService.getProduct(req.params.id);
  return res.status(200).json({ product });
});

const updateProduct = asyncWrapper(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  return res.status(200).json({ msg: "Product updated successfully", product });
});

const deleteProduct = asyncWrapper(async (req, res) => {
  const product = await productService.deleteProduct(req.params.id);
  return res.status(200).json({ msg: "Product deleted successfully", product });
});

const uploadImage = asyncWrapper(async (req, res) => {
  if (!req.files || !req.files.image) {
    throw new BadRequestError("No file uploaded");
  }

  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload an image file");
  }

  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new BadRequestError("Please upload an image less than 1MB");
  }

  const imageUrl = await productService.uploadImage(productImage);

  return res.status(200).json({
    message: "Image uploaded successfully",
    imageUrl,
  });
});

module.exports = {
  createProducts,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
