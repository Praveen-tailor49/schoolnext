const prisma = require("../utils/prisma");
const asyncHandler = require("../utils/async-handler");

// ---------------------------------------------------------
// VEHICLES
// ---------------------------------------------------------
exports.getVehicles = asyncHandler(async (req, res) => {
  const vehicles = await prisma.vehicle.findMany({
    where: { schoolId: req.user.schoolId },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: vehicles });
});

exports.createVehicle = asyncHandler(async (req, res) => {
  const { vehicleNumber, capacity, driverName, driverPhone, status } = req.body;
  const vehicle = await prisma.vehicle.create({
    data: {
      schoolId: req.user.schoolId,
      vehicleNumber,
      capacity: parseInt(capacity),
      driverName,
      driverPhone,
      status,
    },
  });
  res.status(201).json({ success: true, data: vehicle });
});

exports.updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await prisma.vehicle.update({
    where: { id: req.params.id, schoolId: req.user.schoolId },
    data: req.body,
  });
  res.json({ success: true, data: vehicle });
});

exports.deleteVehicle = asyncHandler(async (req, res) => {
  await prisma.vehicle.delete({
    where: { id: req.params.id, schoolId: req.user.schoolId },
  });
  res.json({ success: true, message: "Vehicle deleted" });
});

// ---------------------------------------------------------
// ROUTES
// ---------------------------------------------------------
exports.getRoutes = asyncHandler(async (req, res) => {
  const routes = await prisma.route.findMany({
    where: { schoolId: req.user.schoolId },
    include: {
      vehicle: { select: { vehicleNumber: true, driverName: true } }
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: routes });
});

exports.createRoute = asyncHandler(async (req, res) => {
  const { routeName, vehicleId, stops } = req.body;
  const route = await prisma.route.create({
    data: {
      schoolId: req.user.schoolId,
      routeName,
      vehicleId,
      stops: stops ? JSON.parse(stops) : [],
    },
  });
  res.status(201).json({ success: true, data: route });
});

exports.updateRoute = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.stops) data.stops = JSON.parse(data.stops);
  const route = await prisma.route.update({
    where: { id: req.params.id, schoolId: req.user.schoolId },
    data,
  });
  res.json({ success: true, data: route });
});

exports.deleteRoute = asyncHandler(async (req, res) => {
  await prisma.route.delete({
    where: { id: req.params.id, schoolId: req.user.schoolId },
  });
  res.json({ success: true, message: "Route deleted" });
});

// ---------------------------------------------------------
// TRANSPORT ALLOCATIONS
// ---------------------------------------------------------
exports.getAllocations = asyncHandler(async (req, res) => {
  const allocations = await prisma.transportAllocation.findMany({
    where: { schoolId: req.user.schoolId },
    include: {
      student: { select: { firstName: true, lastName: true, admissionNo: true } },
      route: { select: { routeName: true } }
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: allocations });
});

exports.createAllocation = asyncHandler(async (req, res) => {
  const { studentId, routeId, pickupPoint, monthlyFee } = req.body;
  const allocation = await prisma.transportAllocation.upsert({
    where: { studentId },
    update: { routeId, pickupPoint, monthlyFee: parseFloat(monthlyFee) },
    create: {
      schoolId: req.user.schoolId,
      studentId,
      routeId,
      pickupPoint,
      monthlyFee: parseFloat(monthlyFee),
    },
  });
  res.status(201).json({ success: true, data: allocation });
});

exports.deleteAllocation = asyncHandler(async (req, res) => {
  await prisma.transportAllocation.delete({
    where: { id: req.params.id, schoolId: req.user.schoolId },
  });
  res.json({ success: true, message: "Allocation deleted" });
});
