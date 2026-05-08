const express = require("express");
const { createProducts, getAllProducts, getProduct, updateProduct, deleteProduct, uploadImage } = require("./product.controller");
const { isAuth, authorizePermission } = require("../../middleware/isAuth")
const router = express.Router();

router.post('/create-product', isAuth, authorizePermission('admin'), createProducts);
router.get('/get-all', getAllProducts);
router.get('/get-product/:id', getProduct);
router.patch('/update-product/:id', isAuth, authorizePermission('admin'), updateProduct);
router.delete('/delete-product/:id', isAuth, authorizePermission('admin'), deleteProduct);
router.post('/upload-image', isAuth, authorizePermission('admin'), uploadImage)

module.exports = router