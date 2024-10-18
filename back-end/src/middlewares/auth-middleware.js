const JWT = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startWidth("Bearer")) {
    next("Authentixation Failed");
  }
  const token = authHeader?.split("")[1];
  try {
    const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);
    req.body.user = {
      userId: userToken.userId,
    };
  } catch (error) {
    console.log(error);
    next("Authentication Failed");
  }
};

module.exports = authMiddleware;
