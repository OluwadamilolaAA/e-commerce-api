const User = require("../user/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createJwt, createTokenUser } = require("../../utils/jwt");
const { BadRequestError, UnauthorizedError } = require("../../errors");
const Token = require("./token.model");
const hashString = require("../../utils/hash-string");
const sendEmail = require("../../utils/send-email");

const register = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new BadRequestError("All field are required");
  }
  email = email.toLowerCase();

  if (password.length < 6) {
    throw new BadRequestError("Password must be at least 6 characters");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError("User already exist");
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    verificationToken,
  });

  const origin = process.env.APP_URL;
  const verifyEmailUrl = `${origin}/api/auth/verify-email?token=${verificationToken}&email=${email}`;

  await sendEmail({
    to: email,
    subject: "Verify your email",
    html: `
      <h3>Hello ${name}</h3>
      <p>Please click the link below to verify your account:</p>
      <a href="${verifyEmailUrl}">Verify Email</a>
    `,
  });

  return {
    msg: "Success! Please check your email to verify your account",
  };
};

const login = async ({ email, password, ip, userAgent }) => {
  if (!email || !password) {
    throw new BadRequestError("All field are required");
  }
  email = email.toLowerCase();

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  if (!user.isVerified) {
    throw new UnauthorizedError("Please verify your account");
  }

  const tokenUser = createTokenUser(user);

  const refreshToken = crypto.randomBytes(40).toString("hex");

  await Token.deleteMany({ user: user._id });

  await Token.create({
    refreshToken: hashString(refreshToken),
    ip,
    userAgent,
    user: user._id,
  });

  const accessToken = createJwt({
    payload: { user: tokenUser },
    secret: process.env.ACCESS_TOKEN_SECRET,
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshJwt = createJwt({
    payload: { user: tokenUser, refreshToken },
    secret: process.env.REFRESH_TOKEN_SECRET,
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });

  return {
    user: tokenUser,
    accessToken,
    refreshToken: refreshJwt,
  };
};

const verifyEmail = async ({ token, email }) => {
  if (!token || !email) {
    throw new BadRequestError("Invalid verification link");
  }

  const user = await User.findOne({ email });

  email = email.toLowerCase();

  if (!user) {
    throw new UnauthorizedError("Verification failed");
  }

  if (user.verificationToken !== token) {
    throw new UnauthorizedError("Verification failed");
  }

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";

  await user.save();
  return {
    msg: "Email verified successfully",
  };
};

const forgotPassword = async ({ email }) => {
  if (!email) {
    throw new BadRequestError("Please provide email");
  }

  email = email.toLowerCase();

  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError("No user with this email");
  }

  const passwordToken = crypto.randomBytes(70).toString("hex");

  const origin = process.env.APP_URL;

  const resetUrl = `${origin}/api/auth/reset-password?token=${passwordToken}&email=${email}`;

  await sendEmail({
    to: user.email,
    subject: "Reset Password",
    html: `
      <h3>Hello ${user.name}</h3>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 10 minutes.</p>
    `,
  });

  user.passwordToken = hashString(passwordToken);
  user.passwordTokenExpirationDate = new Date(Date.now() + 1000 * 60 * 10);

  await user.save();
  return {
    msg: "Please check your email for reset password link",
  };
};

const resetPassword = async ({ token, email, password }) => {
  if (!token || !email || !password) {
    throw new BadRequestError("Please provide all fields");
  }
  email = email.toLowerCase();

  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError("No user with this email");
  }

  const currentTime = new Date();
  const hashToken = hashString(token);

  if (
    user.passwordToken !== hashToken ||
    user.passwordTokenExpirationDate < currentTime
  ) {
    throw new UnauthorizedError("Invalid or expired reset token");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  user.passwordToken = null;
  user.passwordTokenExpirationDate = null;

  await user.save();

  return {
    msg: "Password reset successful",
  };
};

const logout = async (userId) => {
  await Token.findOneAndUpdate({ user: userId }, { isValid: false });
  return { msg: "logout successful" };
};
module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout,
};
