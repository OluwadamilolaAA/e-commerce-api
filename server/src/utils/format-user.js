const formatUser = (user) => {
  return {
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

module.exports = formatUser
