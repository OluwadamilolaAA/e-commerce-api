const express = require("express");
const router = express.Router();
const { getAllUsers, getUser, showCurrentUser, updateUserPassword, updateUser } = require("./user.controller");
const { isAuth, authorizePermission } = require("../../middleware/isAuth")

router.get('/get-all-users', isAuth, authorizePermission('admin'), getAllUsers);
router.get('/get-user/:id', isAuth, authorizePermission("admin"), getUser);
router.get('/show-me', isAuth, showCurrentUser);
router.patch('/update-user-pwd', isAuth, updateUserPassword);
router.patch('/update-user', isAuth, updateUser)

module.exports = router