const prisma = require("../utils/prisma");
const asyncHandler = require("../utils/async-handler");

// ---------------------------------------------------------
// HOSTELS
// ---------------------------------------------------------
exports.getHostels = asyncHandler(async (req, res) => {
  const hostels = await prisma.hostel.findMany({
    where: { schoolId: req.user.schoolId },
    orderBy: { name: "asc" },
  });
  res.json({ success: true, data: hostels });
});

exports.createHostel = asyncHandler(async (req, res) => {
  const { name, type, address, wardenName, wardenContact } = req.body;
  const hostel = await prisma.hostel.create({
    data: {
      schoolId: req.user.schoolId,
      name,
      type,
      address,
      wardenName,
      wardenContact,
    },
  });
  res.status(201).json({ success: true, data: hostel });
});

exports.updateHostel = asyncHandler(async (req, res) => {
  const hostel = await prisma.hostel.update({
    where: { id: req.params.id, schoolId: req.user.schoolId },
    data: req.body,
  });
  res.json({ success: true, data: hostel });
});

exports.deleteHostel = asyncHandler(async (req, res) => {
  await prisma.hostel.delete({
    where: { id: req.params.id, schoolId: req.user.schoolId },
  });
  res.json({ success: true, message: "Hostel deleted" });
});

// ---------------------------------------------------------
// HOSTEL ROOMS
// ---------------------------------------------------------
exports.getRooms = asyncHandler(async (req, res) => {
  const rooms = await prisma.hostelRoom.findMany({
    where: { schoolId: req.user.schoolId },
    include: {
      hostel: { select: { name: true } }
    },
    orderBy: { roomNumber: "asc" },
  });
  res.json({ success: true, data: rooms });
});

exports.createRoom = asyncHandler(async (req, res) => {
  const { hostelId, roomNumber, capacity, type, costPerBed } = req.body;
  const room = await prisma.hostelRoom.create({
    data: {
      schoolId: req.user.schoolId,
      hostelId,
      roomNumber,
      capacity: parseInt(capacity),
      type,
      costPerBed: parseFloat(costPerBed),
    },
  });
  res.status(201).json({ success: true, data: room });
});

exports.deleteRoom = asyncHandler(async (req, res) => {
  await prisma.hostelRoom.delete({
    where: { id: req.params.id, schoolId: req.user.schoolId },
  });
  res.json({ success: true, message: "Room deleted" });
});

// ---------------------------------------------------------
// HOSTEL ALLOCATIONS
// ---------------------------------------------------------
exports.getAllocations = asyncHandler(async (req, res) => {
  const allocations = await prisma.hostelAllocation.findMany({
    where: { schoolId: req.user.schoolId },
    include: {
      student: { select: { firstName: true, lastName: true, admissionNo: true } },
      room: { select: { roomNumber: true, hostel: { select: { name: true } } } }
    },
    orderBy: { joinDate: "desc" },
  });
  res.json({ success: true, data: allocations });
});

exports.createAllocation = asyncHandler(async (req, res) => {
  const { studentId, roomId, joinDate } = req.body;
  const allocation = await prisma.hostelAllocation.create({
    data: {
      schoolId: req.user.schoolId,
      studentId,
      roomId,
      joinDate: new Date(joinDate),
    },
  });
  res.status(201).json({ success: true, data: allocation });
});

exports.updateAllocation = asyncHandler(async (req, res) => {
  const { leaveDate } = req.body;
  const allocation = await prisma.hostelAllocation.update({
    where: { id: req.params.id, schoolId: req.user.schoolId },
    data: { 
      leaveDate: leaveDate ? new Date(leaveDate) : null,
    },
  });
  res.json({ success: true, data: allocation });
});

exports.deleteAllocation = asyncHandler(async (req, res) => {
  await prisma.hostelAllocation.delete({
    where: { id: req.params.id, schoolId: req.user.schoolId },
  });
  res.json({ success: true, message: "Allocation deleted" });
});
