const express = require("express");
const createResourceRouter = require("../utils/create-resource-router");
const { feeController } = require("../controllers/resource.controllers");
const { STAFF_ROLES, ADMIN_ONLY } = require("../constants/roles");
const { getFeeDashboardStats, assignFeeStructure, recordPayment, getStudentLedger } = require("../controllers/fees.advanced.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

// Create the base CRUD router for student fees
const router = createResourceRouter({
  controller: feeController,
  listRoles: STAFF_ROLES,
  createRoles: ADMIN_ONLY,
  readRoles: STAFF_ROLES,
  updateRoles: ADMIN_ONLY,
  deleteRoles: ADMIN_ONLY,
});

// Add custom enterprise endpoints
router.get("/dashboard/stats", protect, authorize(...STAFF_ROLES), getFeeDashboardStats);
router.post("/assign", protect, authorize(...ADMIN_ONLY), assignFeeStructure);
router.post("/pay", protect, authorize(...STAFF_ROLES), recordPayment);
router.get("/student/:studentId/ledger", protect, authorize(...STAFF_ROLES), getStudentLedger);

module.exports = router;
