const { UnauthorizedError } = require("../errors");
const { verifyJwt } = require("../utils/jwt");

const isAuth = async (req, res, next) => {
  const token = req.signedCookies.accessToken;
  if (!token) {
    throw new UnauthorizedError("Invalid Authorization");
  }
  try {
    const decoded = verifyJwt({
      token,
      secret: process.env.ACCESS_TOKEN_SECRET,
    });

    req.user = decoded.payload.user;

    next();
  } catch (err) {
    throw new UnauthorizedError("Invalid Authorization");
  }
};

const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};

module.exports = {
  isAuth,
  authorizePermission,
};
