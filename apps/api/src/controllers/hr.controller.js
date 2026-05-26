const prisma = require("../utils/prisma");
const asyncHandler = require("../utils/async-handler");

// ---------------------------------------------------------
// STAFF ATTENDANCE
// ---------------------------------------------------------
exports.getStaffAttendance = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const whereClause = { schoolId: req.user.schoolId };
  
  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    whereClause.date = { gte: startOfDay, lte: endOfDay };
  }

  const attendance = await prisma.staffAttendance.findMany({
    where: whereClause,
    include: {
      teacher: {
        select: { id: true, firstName: true, lastName: true, employeeId: true }
      }
    },
    orderBy: { date: "desc" },
  });
  
  res.json({ success: true, data: attendance });
});

exports.markStaffAttendance = asyncHandler(async (req, res) => {
  const { teacherId, date, status, remarks } = req.body;
  const recordDate = new Date(date);

  const record = await prisma.staffAttendance.upsert({
    where: {
      teacherId_date: {
        teacherId,
        date: recordDate,
      }
    },
    update: { status, remarks },
    create: {
      schoolId: req.user.schoolId,
      teacherId,
      date: recordDate,
      status,
      remarks,
    },
  });

  res.json({ success: true, data: record });
});

// ---------------------------------------------------------
// STAFF LEAVES
// ---------------------------------------------------------
exports.getStaffLeaves = asyncHandler(async (req, res) => {
  const leaves = await prisma.staffLeave.findMany({
    where: { schoolId: req.user.schoolId },
    include: {
      teacher: {
        select: { id: true, firstName: true, lastName: true, employeeId: true }
      }
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: leaves });
});

exports.applyLeave = asyncHandler(async (req, res) => {
  const { teacherId, startDate, endDate, reason } = req.body;
  const leave = await prisma.staffLeave.create({
    data: {
      schoolId: req.user.schoolId,
      teacherId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
    },
  });
  res.status(201).json({ success: true, data: leave });
});

exports.updateLeaveStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const leave = await prisma.staffLeave.update({
    where: { id: req.params.id, schoolId: req.user.schoolId },
    data: { status },
  });
  res.json({ success: true, data: leave });
});

// ---------------------------------------------------------
// PAYROLL (SALARY SLIPS)
// ---------------------------------------------------------
exports.getSalarySlips = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const whereClause = { schoolId: req.user.schoolId };
  if (month) whereClause.month = parseInt(month);
  if (year) whereClause.year = parseInt(year);

  const slips = await prisma.salarySlip.findMany({
    where: whereClause,
    include: {
      teacher: {
        select: { id: true, firstName: true, lastName: true, employeeId: true }
      }
    },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });
  res.json({ success: true, data: slips });
});

exports.generateSalarySlip = asyncHandler(async (req, res) => {
  const { teacherId, month, year, basicSalary, allowances, deductions } = req.body;
  
  const netSalary = (basicSalary + (allowances || 0)) - (deductions || 0);

  const slip = await prisma.salarySlip.upsert({
    where: {
      teacherId_month_year: {
        teacherId,
        month: parseInt(month),
        year: parseInt(year),
      }
    },
    update: { basicSalary, allowances, deductions, netSalary },
    create: {
      schoolId: req.user.schoolId,
      teacherId,
      month: parseInt(month),
      year: parseInt(year),
      basicSalary,
      allowances: allowances || 0,
      deductions: deductions || 0,
      netSalary,
    },
  });
  res.json({ success: true, data: slip });
});

exports.updateSalaryStatus = asyncHandler(async (req, res) => {
  const { status, paymentDate } = req.body;
  const slip = await prisma.salarySlip.update({
    where: { id: req.params.id, schoolId: req.user.schoolId },
    data: { 
      status, 
      paymentDate: paymentDate ? new Date(paymentDate) : null 
    },
  });
  res.json({ success: true, data: slip });
});
