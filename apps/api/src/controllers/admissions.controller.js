const prisma = require("../utils/prisma");
const asyncHandler = require("../utils/async-handler");
const AppError = require("../utils/app-error");

exports.getEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await prisma.enquiry.findMany({
    where: { schoolId: req.user.schoolId },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: enquiries });
});

exports.createEnquiry = asyncHandler(async (req, res) => {
  const { studentName, parentName, phone, email, classApplied, notes } = req.body;
  const enquiry = await prisma.enquiry.create({
    data: {
      schoolId: req.user.schoolId,
      studentName,
      parentName,
      phone,
      email,
      classApplied,
      notes,
    },
  });
  res.status(201).json({ success: true, data: enquiry });
});

exports.updateEnquiryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const enquiry = await prisma.enquiry.update({
    where: { id: req.params.id, schoolId: req.user.schoolId },
    data: { status },
  });
  res.json({ success: true, data: enquiry });
});

exports.getApplications = asyncHandler(async (req, res) => {
  const applications = await prisma.admissionApplication.findMany({
    where: { schoolId: req.user.schoolId },
    orderBy: { appliedAt: "desc" },
  });
  res.json({ success: true, data: applications });
});

exports.createApplication = asyncHandler(async (req, res) => {
  const { firstName, lastName, dateOfBirth, gender, parentName, parentPhone, parentEmail, address, classApplied } = req.body;
  const application = await prisma.admissionApplication.create({
    data: {
      schoolId: req.user.schoolId,
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      parentName,
      parentPhone,
      parentEmail,
      address,
      classApplied,
    },
  });
  res.status(201).json({ success: true, data: application });
});

exports.updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const application = await prisma.admissionApplication.update({
    where: { id: req.params.id, schoolId: req.user.schoolId },
    data: { status },
  });
  res.json({ success: true, data: application });
});
