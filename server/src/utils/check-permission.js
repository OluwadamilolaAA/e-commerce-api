const { UnauthorizedError } = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  // admin can access everything
  if (requestUser.role === "admin") return;

  // normal user can access only their own resource
  if (requestUser.userId === resourceUserId.toString()) return;

  throw new UnauthorizedError("Not authorized to access this resource");
};

module.exports = checkPermissions;