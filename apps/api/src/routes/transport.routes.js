const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth.middleware");
const { ROLES } = require("../constants/roles");
const transportController = require("../controllers/transport.controller");

router.use(protect);
router.use(authorize(ROLES.ADMIN));

// Vehicles
router.get("/vehicles", transportController.getVehicles);
router.post("/vehicles", transportController.createVehicle);
router.patch("/vehicles/:id", transportController.updateVehicle);
router.delete("/vehicles/:id", transportController.deleteVehicle);

// Routes
router.get("/routes", transportController.getRoutes);
router.post("/routes", transportController.createRoute);
router.patch("/routes/:id", transportController.updateRoute);
router.delete("/routes/:id", transportController.deleteRoute);

// Allocations
router.get("/allocations", transportController.getAllocations);
router.post("/allocations", transportController.createAllocation);
router.delete("/allocations/:id", transportController.deleteAllocation);

module.exports = router;
