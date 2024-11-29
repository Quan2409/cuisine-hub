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

  //check duplicate
  if (error.code === 11000) {
    defaultError.code = 404;
    defaultError.message = `${Object.values(
      error.keyValue
    )} field has to be unique`;
  }

  console.log(error);

  res.status(defaultError.code).json({
    status: defaultError.status,
    message: defaultError.message,
  });
};

module.exports = errorMiddleware;
