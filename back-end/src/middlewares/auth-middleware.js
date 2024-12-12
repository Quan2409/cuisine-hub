const JWT = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    next("Authentication Failed haha");
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);
    req.body.user = {
      userId: userToken.userId,
    };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: false,
        message: "Token expired. Please log in again.",
      });
    }
    return res.status(401).json({
      status: false,
      message: "Authentication Failed",
    });
  }
};

module.exports = authMiddleware;
