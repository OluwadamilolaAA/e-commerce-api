const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");

const createJwt = ({ payload, secret, expiresIn }) => {
  return jwt.sign({ payload }, secret, { expiresIn });
};

const verifyJwt = ({ token, secret }) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }
};

const createTokenUser = (user) => {
  return {
    userId: user._id,
    email: user.email,
    role: user.role,
  };
};

const attachCookiesToResponse = ({ res, accessToken, refreshToken }) => {
  const oneDay = 1000 * 60 * 60 * 24;
  const sevenDays = oneDay * 7;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    signed: true,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + sevenDays),
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    signed: true,
  });
};

const clearCookies = (res) => {
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    signed: true,
    expires: new Date(0),
  });

  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    signed: true,
    expires: new Date(0),
  });
};

module.exports = {
  createJwt,
  verifyJwt,
  createTokenUser,
  attachCookiesToResponse,
  clearCookies,
};