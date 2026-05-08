const Product = require("./product.model");
const { BadRequestError } = require("../../errors");
const Review = require("../reviews/review.model")
const path = require("path");

const createProducts = async ({
  userId,
  name,
  price,
  description,
  category,
  company,
  colors,
  image,
  inventory,
  featured,
  freeShipping,
}) => {
  if (!userId || !name || !description || !category || !company || !colors) {
    throw new BadRequestError("All fields are required");
  }

  if (price === undefined ) {
    throw new BadRequestError("Price is required");
  }

  const product = await Product.create({
    user: userId,
    name,
    price,
    description,
    category,
    image,
    company,
    colors,
    inventory,
    featured,
    freeShipping,
  });

  return product;
};

const getAllProducts = async () => {
  return await Product.find({});
};

const getProduct = async (productId) => {
  const product = await Product.findById(productId).populate('reviews');

  if (!product) {
    throw new BadRequestError("Product not found");
  }

  return product;
};

const updateProduct = async (productId, updateData) => {
  const product = await Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new BadRequestError("Product not found");
  }

  return product;
};

const deleteProduct = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new BadRequestError("Product not found");
  }

  await Review.deleteMany({ product: product._id });
  await product.deleteOne();

  return product;
};

const uploadImage = async(imageFile) => {
  const imagePath = path.join(__dirname, "../../../public/uploads/" + imageFile.name)
  await imageFile.mv(imagePath);

  return { src: `/uploads/${imageFile.name}` };
}

module.exports = {
  createProducts,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadImage
};
