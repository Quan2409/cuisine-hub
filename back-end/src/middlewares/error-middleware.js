const errorMiddleware = (error, req, res, next) => {
  const defaultError = {
    code: 404,
    status: false,
    message: error,
  };

  if (error.name === "ValidationError") {
    defaultError.statusCode = 404;
    defaultError.message = Object.values(error, error)
      .map((el) => el.message)
      .join(",");
  }

  res.status(defaultError.code).json({
    status: defaultError.status,
    message: defaultError.message,
  });
};

module.exports = errorMiddleware;
