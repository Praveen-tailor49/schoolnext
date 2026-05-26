const express = require("express");
const { getDashboardSummary } = require("../controllers/dashboard.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");
const { STAFF_ROLES } = require("../constants/roles");

const router = express.Router();

router.get("/summary", protect, getDashboardSummary);

module.exports = router;

