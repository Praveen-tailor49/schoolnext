const prisma = require("../utils/prisma");
const asyncHandler = require("../utils/async-handler");

// ---------------------------------------------------------
// EXPENSE CATEGORIES
// ---------------------------------------------------------
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.expenseCategory.findMany({
    where: { schoolId: req.user.schoolId },
    orderBy: { name: "asc" },
  });
  res.json({ success: true, data: categories });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await prisma.expenseCategory.create({
    data: {
      schoolId: req.user.schoolId,
      name,
    },
  });
  res.status(201).json({ success: true, data: category });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  await prisma.expenseCategory.delete({
    where: { id: req.params.id, schoolId: req.user.schoolId },
  });
  res.json({ success: true, message: "Category deleted" });
});

// ---------------------------------------------------------
// EXPENSES
// ---------------------------------------------------------
exports.getExpenses = asyncHandler(async (req, res) => {
  const expenses = await prisma.expense.findMany({
    where: { schoolId: req.user.schoolId },
    include: {
      category: { select: { name: true } }
    },
    orderBy: { date: "desc" },
  });
  res.json({ success: true, data: expenses });
});

exports.createExpense = asyncHandler(async (req, res) => {
  const { categoryId, amount, date, description, receiptUrl } = req.body;
  const expense = await prisma.expense.create({
    data: {
      schoolId: req.user.schoolId,
      categoryId,
      amount: parseFloat(amount),
      date: new Date(date),
      description,
      receiptUrl,
    },
  });
  res.status(201).json({ success: true, data: expense });
});

exports.deleteExpense = asyncHandler(async (req, res) => {
  await prisma.expense.delete({
    where: { id: req.params.id, schoolId: req.user.schoolId },
  });
  res.json({ success: true, message: "Expense deleted" });
});
