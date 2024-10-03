const JWT = require("jsonwebtoken");

const createToken = (id) => {
  return JWT.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

module.exports = createToken;
