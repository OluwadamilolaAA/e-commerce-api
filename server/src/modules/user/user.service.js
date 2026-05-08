const User = require("../user/user.model");
const { BadRequestError, UnauthorizedError } = require("../../errors");
const bcrypt = require("bcrypt");
const formatUser = require("../../utils/format-user");

const getAllUsers = async () => {
  const users = await User.find({ role: "user" }).select("-password");
  return users;
};

const getUser = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new BadRequestError(`No user with Id: ${userId}`);
  }
  return user;
};

const showCurrentUser = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new BadRequestError("User not found");
  }
  return user;
};

const updateUserPassword = async ({ userId, oldPassword, newPassword }) => {
  if (!oldPassword || !newPassword) {
    throw new BadRequestError("All field are required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new BadRequestError("User not found");
  }

  const isValidPassword = await bcrypt.compare(oldPassword, user.password);
  if (!isValidPassword) {
    throw new UnauthorizedError("Invalid Credentials");
  }
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  return { msg: "Password updated successfully" };
};

const updateUser = async (userId, { name, email }) => {
  if (!name && !email) {
    throw new BadRequestError("Please provide name or email");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new BadRequestError("User not found");
  }

  if (email) {
    email = email.toLowerCase();

    const existingEmail = await User.findOne({ email });

    if (existingEmail && existingEmail._id.toString() !== userId) {
      throw new BadRequestError("Email already exists");
    }

    user.email = email;
  }

  if (name) {
    user.name = name;
  }

  await user.save();

  return {
    user: formatUser(user),
  };
};

module.exports = {
  getAllUsers,
  getUser,
  showCurrentUser,
  updateUserPassword,
  updateUser,
};
