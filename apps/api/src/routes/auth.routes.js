const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const handleValidationErrors = require("../middlewares/validate.middleware");
const { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator, } = require("../validators/auth.validators");

const router = express.Router();

router.post("/register", registerValidator, handleValidationErrors, register);
router.post("/login", loginValidator, handleValidationErrors, login);
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  handleValidationErrors,
  forgotPassword
);
router.post(
  "/reset-password/:token",
  resetPasswordValidator,
  handleValidationErrors,
  resetPassword
);
router.get("/me", protect, getProfile);

module.exports = router;

