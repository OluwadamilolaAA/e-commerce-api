const asyncWrapper = require("../../middleware/async");
const userService = require("./user.service");
const checkPermissions = require("../../utils/check-permission")

const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await userService.getAllUsers();
  return res.status(200).json({ count: users.length, users });
});

const getUser = asyncWrapper(async (req, res) => {
  const user = await userService.getUser(req.params.id);

  return res.status(200).json({ user });
});

const showCurrentUser = asyncWrapper(async (req, res) => {
  const user = await userService.showCurrentUser(req.user.userId);
  return res.status(200).json({ user });
});

const updateUserPassword = asyncWrapper(async (req, res) => {
  const result = await userService.updateUserPassword({
    userId: req.user.userId,
    oldPassword: req.body.oldPassword,
    newPassword: req.body.newPassword,
  });
  return res.status(200).json({ result });
});

const updateUser = asyncWrapper(async (req, res) => {
  const { user } = await userService.updateUser(
    req.user.userId,
    req.body
  );

  return res.status(200).json({
    msg: "User updated successfully",
    user
  });
});

module.exports = {
  getAllUsers,
  getUser,
  showCurrentUser,
  updateUserPassword,
  updateUser,
};
