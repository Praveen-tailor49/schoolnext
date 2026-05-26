const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth.middleware");
const { ROLES } = require("../constants/roles");
const hrController = require("../controllers/hr.controller");

router.use(protect);
router.use(authorize(ROLES.ADMIN));

// Attendance
router.get("/attendance", hrController.getStaffAttendance);
router.post("/attendance", hrController.markStaffAttendance);

// Leaves
router.get("/leaves", hrController.getStaffLeaves);
router.post("/leaves", hrController.applyLeave);
router.patch("/leaves/:id/status", hrController.updateLeaveStatus);

// Payroll
router.get("/payroll", hrController.getSalarySlips);
router.post("/payroll", hrController.generateSalarySlip);
router.patch("/payroll/:id/status", hrController.updateSalaryStatus);

module.exports = router;
