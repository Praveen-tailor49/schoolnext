const handleMongoError = (error) => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0] || "field";
    return {
      statusCode: 400,
      message: `${field} must be unique.`,
    };
  }

  if (error.name === "ValidationError") {
    return {
      statusCode: 400,
      message: Object.values(error.errors)
        .map((item) => item.message)
        .join(", "),
    };
  }

  if (error.name === "CastError") {
    return {
      statusCode: 400,
      message: "Invalid resource identifier.",
    };
  }

  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    return {
      statusCode: 401,
      message: "Invalid or expired token.",
    };
  }

  return {
    statusCode: error.statusCode || 500,
    message: error.message || "Internal server error.",
  };
};

const errorHandler = (error, req, res, next) => {
  const handledError = handleMongoError(error);

  res.status(handledError.statusCode).json({
    success: false,
    message: handledError.message,
  });
};

module.exports = errorHandler;

