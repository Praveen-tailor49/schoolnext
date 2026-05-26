const prisma = require("../utils/prisma");
const asyncHandler = require("../utils/async-handler");

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getDashboardSummary = asyncHandler(async (req, res) => {
  const userRole = req.user.role;

  if (userRole === "student" || userRole === "parent") {
    // STUDENT DASHBOARD LOGIC
    const student = await prisma.student.findFirst({
      where: userRole === "student" ? { userId: req.user.id } : { parentEmail: req.user.email } // simplified parent matching
    });

    if (!student) {
      return res.json({
        stats: { attendance: 0, pendingFees: 0, upcomingExams: 0 },
        recentNotices: [],
        upcomingExams: [],
        studentFees: [],
      });
    }

    const [
      attendanceCount,
      myFees,
      recentNotices,
      upcomingExams,
      homework,
      results
    ] = await Promise.all([
      prisma.attendance.count({ where: { studentId: student.id, status: "Present" } }),
      prisma.studentFee.findMany({ where: { studentId: student.id }, include: { feeStructure: true } }),
      prisma.notice.findMany({
        where: { audience: { in: ["All", "Students"] } },
        orderBy: { publishDate: 'desc' },
        take: 5,
      }),
      prisma.exam.findMany({
        where: { date: { gte: new Date() }, className: student.className },
        orderBy: { date: 'asc' },
        take: 5,
      }),
      prisma.homework.findMany({
        where: { className: student.className, section: student.section, dueDate: { gte: new Date() } },
        orderBy: { dueDate: 'asc' },
        take: 5,
      }),
      prisma.result.findMany({
        where: { studentId: student.id },
        include: { exam: true },
        orderBy: { publishedAt: 'desc' },
        take: 5,
      }),
    ]);

    const pendingFees = myFees.reduce((sum, f) => sum + (f.dueAmount || 0), 0);

    return res.json({
      role: userRole,
      stats: {
        attendance: attendanceCount,
        pendingFees,
        upcomingExams: upcomingExams.length,
      },
      recentNotices,
      upcomingExams,
      studentFees: myFees,
      profile: student,
      homework,
      results,
    });
  }

  // ADMIN/TEACHER DASHBOARD LOGIC
  const [
    studentCount,
    teacherCount,
    attendanceCount,
    feeCount,
    paymentCount,
    noticeCount,
    libraryCount,
    attendanceGroup,
    financeRawGroup,
    recentNotices,
    upcomingExams,
    totalIncome,
    totalExpenses,
    totalPayroll,
    defaultersList
  ] = await Promise.all([
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.attendance.count(),
    prisma.studentFee.count(),
    prisma.feePayment.count(),
    prisma.notice.count(),
    prisma.library.count(),
    prisma.attendance.groupBy({
      by: ['status'],
      _count: {
        status: true,
      }
    }),
    prisma.$queryRaw`
      SELECT MONTH(payment_date) as monthNumber, SUM(amount) as total
      FROM fee_payments
      GROUP BY MONTH(payment_date)
      ORDER BY monthNumber ASC
    `,
    prisma.notice.findMany({
      orderBy: { publishDate: 'desc' },
      take: 5,
    }),
    prisma.exam.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: 'asc' },
      take: 5,
    }),
    prisma.feePayment.aggregate({ _sum: { amount: true } }),
    prisma.expense.aggregate({ _sum: { amount: true } }),
    prisma.salarySlip.aggregate({ _sum: { netSalary: true } }),
    prisma.studentFee.findMany({
      where: { status: "Due" },
      include: { student: { select: { firstName: true, lastName: true, className: true, admissionNo: true } } },
      orderBy: { dueAmount: 'desc' },
      take: 5,
    }),
  ]);

  const attendanceOverview = attendanceGroup.map(item => ({
    name: item.status,
    value: item._count.status
  }));

  const financeSeries = financeRawGroup.map((item) => ({
    month: monthLabels[(Number(item.monthNumber) || 1) - 1],
    total: Number(item.total || 0),
  }));

  const pendingFees = await prisma.studentFee.aggregate({
    where: { status: { in: ["Due", "Partially Paid"] } },
    _sum: { dueAmount: true }
  });

  res.json({
    role: userRole,
    stats: {
      students: studentCount,
      teachers: teacherCount,
      attendance: attendanceCount,
      fees: feeCount,
      pendingFees: pendingFees._sum.dueAmount || 0,
      payments: paymentCount,
      notices: noticeCount,
      libraryBooks: libraryCount,
    },
    attendanceOverview,
    financeOverview: financeSeries,
    recentNotices,
    upcomingExams,
    pl: {
      income: totalIncome?._sum?.amount || 0,
      expenses: totalExpenses?._sum?.amount || 0,
      payroll: totalPayroll?._sum?.netSalary || 0,
    },
    defaulters: defaultersList || [],
  });
});

module.exports = {
  getDashboardSummary,
};
