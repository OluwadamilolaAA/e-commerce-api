const asyncWrapper = require("../../middleware/async");
const authService = require("./auth.service");
const { attachCookiesToResponse, clearCookies } = require("../../utils/jwt");

const register = asyncWrapper(async (req, res) => {
  const user = await authService.register(req.body);
  return res.status(201).json({
    msg: "Success! Please check your email to verify your account",
    user,
  });
});

const login = asyncWrapper(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login({
    email: req.body.email,
    password: req.body.password,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  attachCookiesToResponse({ res, accessToken, refreshToken });

  return res.status(200).json({ msg: "User login successfully", user });
});

const verifyEmail = asyncWrapper(async (req, res) => {
  const result = await authService.verifyEmail(req.query);
  return res.status(200).json({ msg: "Email verified successfully", result });
});

const forgotPassword = asyncWrapper(async (req, res) => {
  const result = await authService.forgotPassword(req.body);
  return res.status(200).json({ result });
});

const resetPassword = asyncWrapper(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  return res.status(200).json({ result });
});

const logout = asyncWrapper(async (req, res) => {
  await authService.logout(req.user.userId);

  clearCookies(res);

  return res.status(200).json({ msg: "User logged out successfully" });
});

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout,
};
