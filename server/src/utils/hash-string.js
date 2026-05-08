const crypto = require("crypto")

const hashString = (string) => {
  return crypto.createHash("sha256").update(string).digest("hex");
};

module.exports = hashString