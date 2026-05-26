const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const prisma = require("../utils/prisma");
const generateToken = require("../utils/generate-token");
const hashToken = require("../utils/hash-token");
const asyncHandler = require("../utils/async-handler");
const AppError = require("../utils/app-error");
const { ROLES } = require("../constants/roles");

const PUBLIC_REGISTRATION_ROLES = [ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT];

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  schoolId: user.schoolId,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

const createAuthResponse = (user) => ({
  token: generateToken(user.id),
  user: sanitizeUser(user),
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, schoolId } = req.body;
  const normalizedRole = PUBLIC_REGISTRATION_ROLES.includes(role)
    ? role
    : ROLES.PARENT;

  if (!schoolId) {
    throw new AppError("School ID is required for registration.", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      role: normalizedRole,
      schoolId,
    }
  });

  res.status(201).json(createAuthResponse(user));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Invalid email or password.", 401);
  }

  res.json(createAuthResponse(user));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { email: req.body.email } });

  if (!user) {
    throw new AppError("No account found for this email.", 404);
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(resetToken);
  const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
  
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: hashedToken,
      resetPasswordExpire,
    }
  });

  const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password/${resetToken}`;

  res.json({
    message: "Reset link generated successfully.",
    resetUrl,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = hashToken(req.params.token);
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { gt: new Date() },
    }
  });

  if (!user) {
    throw new AppError("Reset token is invalid or expired.", 400);
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpire: null,
    }
  });

  res.json(createAuthResponse(updatedUser));
});

const getProfile = asyncHandler(async (req, res) => {
  res.json({
    user: sanitizeUser(req.user), // Note: Assuming auth middleware sets req.user which should be updated too
  });
});

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
};
