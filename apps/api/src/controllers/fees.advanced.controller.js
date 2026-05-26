const prisma = require("../utils/prisma");

const getFeeDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      todayPayments,
      monthPayments,
      yearPayments,
      pendingFees,
      recentTransactions
    ] = await Promise.all([
      prisma.feePayment.aggregate({
        where: { paymentDate: { gte: today } },
        _sum: { amount: true },
      }),
      prisma.feePayment.aggregate({
        where: { paymentDate: { gte: firstDayOfMonth } },
        _sum: { amount: true },
      }),
      prisma.feePayment.aggregate({
        where: { paymentDate: { gte: firstDayOfYear } },
        _sum: { amount: true },
      }),
      prisma.studentFee.aggregate({
        where: { status: { in: ["Due", "Partially Paid"] } },
        _sum: { dueAmount: true },
      }),
      prisma.feePayment.findMany({
        take: 5,
        orderBy: { paymentDate: "desc" },
        include: {
          studentFee: {
            include: {
              student: { select: { firstName: true, lastName: true, admissionNo: true, className: true } }
            }
          }
        },
      }),
    ]);

    res.json({
      todayCollection: todayPayments._sum.amount || 0,
      monthCollection: monthPayments._sum.amount || 0,
      yearCollection: yearPayments._sum.amount || 0,
      pendingAmount: pendingFees._sum.dueAmount || 0,
      recentTransactions,
    });
  } catch (error) {
    next(error);
  }
};

const assignFeeStructure = async (req, res, next) => {
  res.status(400).json({ message: "Fee structures are now automatically assigned on creation and admission." });
};

const recordPayment = async (req, res, next) => {
  try {
    const { studentFeeId, amount, paymentMethod, method, discount } = req.body;
    const finalMethod = paymentMethod || method || "cash";
    const discountAmount = parseFloat(discount) || 0;

    const studentFee = await prisma.studentFee.findUnique({
      where: { id: studentFeeId },
    });

    if (!studentFee) return res.status(404).json({ message: "Fee record not found" });
    if (studentFee.status === "Paid") return res.status(400).json({ message: "Fee is already fully paid" });
    if (parseFloat(amount) + discountAmount > studentFee.dueAmount) return res.status(400).json({ message: "Amount and discount exceed due amount" });

    const payment = await prisma.feePayment.create({
      data: {
        studentFeeId,
        amount: parseFloat(amount),
        discount: discountAmount,
        paymentMethod: finalMethod,
        receiptNumber: `RCPT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      }
    });

    const newPaidAmount = studentFee.paidAmount + parseFloat(amount);
    const newDiscountTotal = studentFee.discount + discountAmount;
    const newDueAmount = studentFee.totalFee - newPaidAmount - newDiscountTotal;
    let newStatus = "Partially Paid";
    
    if (newDueAmount <= 0) {
      newStatus = "Paid";
    }

    await prisma.studentFee.update({
      where: { id: studentFeeId },
      data: {
        paidAmount: newPaidAmount,
        discount: newDiscountTotal,
        dueAmount: newDueAmount,
        status: newStatus,
      },
    });

    res.json({ message: "Payment successful", payment });
  } catch (error) {
    next(error);
  }
};

const getStudentLedger = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    
    const fees = await prisma.studentFee.findMany({
      where: { studentId },
      include: {
        feePayments: true,
      },
    });

    res.json({ fees });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeeDashboardStats,
  assignFeeStructure,
  recordPayment,
  getStudentLedger,
};
