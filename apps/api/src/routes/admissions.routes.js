const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth.middleware");
const { ROLES } = require("../constants/roles");
const admissionsController = require("../controllers/admissions.controller");

router.use(protect);
router.use(authorize(ROLES.ADMIN));

router.get("/enquiries", admissionsController.getEnquiries);
router.post("/enquiries", admissionsController.createEnquiry);
router.patch("/enquiries/:id/status", admissionsController.updateEnquiryStatus);

router.get("/applications", admissionsController.getApplications);
router.post("/applications", admissionsController.createApplication);
router.patch("/applications/:id/status", admissionsController.updateApplicationStatus);

module.exports = router;
