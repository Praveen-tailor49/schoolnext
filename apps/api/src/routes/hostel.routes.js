const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth.middleware");
const { ROLES } = require("../constants/roles");
const hostelController = require("../controllers/hostel.controller");

router.use(protect);
router.use(authorize(ROLES.ADMIN));

// Hostels
router.get("/hostels", hostelController.getHostels);
router.post("/hostels", hostelController.createHostel);
router.patch("/hostels/:id", hostelController.updateHostel);
router.delete("/hostels/:id", hostelController.deleteHostel);

// Rooms
router.get("/rooms", hostelController.getRooms);
router.post("/rooms", hostelController.createRoom);
router.delete("/rooms/:id", hostelController.deleteRoom);

// Allocations
router.get("/allocations", hostelController.getAllocations);
router.post("/allocations", hostelController.createAllocation);
router.patch("/allocations/:id", hostelController.updateAllocation);
router.delete("/allocations/:id", hostelController.deleteAllocation);

module.exports = router;
