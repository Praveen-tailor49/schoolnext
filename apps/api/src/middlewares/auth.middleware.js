const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");
const AppError = require("../utils/app-error");
const asyncHandler = require("../utils/async-handler");

const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    return req.headers.authorization.split(" ")[1];
  }

  if (req.cookies && req.cookies.auth_token) {
    return req.cookies.auth_token;
  }

  return null;
};

const protect = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    throw new AppError("Authentication required.", 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await prisma.user.findUnique({
    where: { id: decoded.id }
  });

  if (!user || !user.isActive) {
    throw new AppError("User not found or inactive.", 401);
  }
  
  delete user.password;
  req.user = user;
  next();
});

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Access denied.", 403));
    }

    next();
  };

module.exports = {
  protect,
  authorize,
};
