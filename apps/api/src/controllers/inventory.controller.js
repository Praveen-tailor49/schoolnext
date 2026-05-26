const prisma = require("../utils/prisma");
const asyncHandler = require("../utils/async-handler");

// ---------------------------------------------------------
// CATEGORIES
// ---------------------------------------------------------
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.inventoryCategory.findMany({
    where: { schoolId: req.user.schoolId },
    orderBy: { name: "asc" },
  });
  res.json({ success: true, data: categories });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await prisma.inventoryCategory.create({
    data: {
      schoolId: req.user.schoolId,
      name,
    },
  });
  res.status(201).json({ success: true, data: category });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  await prisma.inventoryCategory.delete({
    where: { id: req.params.id, schoolId: req.user.schoolId },
  });
  res.json({ success: true, message: "Category deleted" });
});

// ---------------------------------------------------------
// ITEMS
// ---------------------------------------------------------
exports.getItems = asyncHandler(async (req, res) => {
  const items = await prisma.inventoryItem.findMany({
    where: { schoolId: req.user.schoolId },
    include: {
      category: { select: { name: true } }
    },
    orderBy: { name: "asc" },
  });
  res.json({ success: true, data: items });
});

exports.createItem = asyncHandler(async (req, res) => {
  const { categoryId, name, sku, quantity, unitPrice, reorderLevel } = req.body;
  
  const status = parseInt(quantity) > 0 
    ? (parseInt(quantity) <= parseInt(reorderLevel) ? "low-stock" : "in-stock")
    : "out-of-stock";

  const item = await prisma.inventoryItem.create({
    data: {
      schoolId: req.user.schoolId,
      categoryId,
      name,
      sku,
      quantity: parseInt(quantity),
      unitPrice: parseFloat(unitPrice),
      reorderLevel: parseInt(reorderLevel),
      status,
    },
  });
  res.status(201).json({ success: true, data: item });
});

exports.updateItem = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.quantity) data.quantity = parseInt(data.quantity);
  if (data.unitPrice) data.unitPrice = parseFloat(data.unitPrice);
  if (data.reorderLevel) data.reorderLevel = parseInt(data.reorderLevel);
  
  if (data.quantity !== undefined && data.reorderLevel !== undefined) {
    data.status = data.quantity > 0 
      ? (data.quantity <= data.reorderLevel ? "low-stock" : "in-stock")
      : "out-of-stock";
  }

  const item = await prisma.inventoryItem.update({
    where: { id: req.params.id, schoolId: req.user.schoolId },
    data,
  });
  res.json({ success: true, data: item });
});

exports.deleteItem = asyncHandler(async (req, res) => {
  await prisma.inventoryItem.delete({
    where: { id: req.params.id, schoolId: req.user.schoolId },
  });
  res.json({ success: true, message: "Item deleted" });
});

// ---------------------------------------------------------
// TRANSACTIONS (STOCK IN/OUT)
// ---------------------------------------------------------
exports.getTransactions = asyncHandler(async (req, res) => {
  const transactions = await prisma.inventoryTransaction.findMany({
    where: { schoolId: req.user.schoolId },
    include: {
      item: { select: { name: true, sku: true } }
    },
    orderBy: { date: "desc" },
  });
  res.json({ success: true, data: transactions });
});

exports.createTransaction = asyncHandler(async (req, res) => {
  const { itemId, type, quantity, remarks, date } = req.body;
  const qty = parseInt(quantity);

  const item = await prisma.inventoryItem.findUnique({
    where: { id: itemId, schoolId: req.user.schoolId }
  });

  if (!item) {
    throw new AppError("Item not found", 404);
  }

  if (type === "out" && item.quantity < qty) {
    return res.status(400).json({ success: false, message: "Insufficient stock" });
  }

  const newQuantity = type === "in" ? item.quantity + qty : item.quantity - qty;
  const status = newQuantity > 0 
    ? (newQuantity <= item.reorderLevel ? "low-stock" : "in-stock")
    : "out-of-stock";

  // Create transaction and update item in a transaction block
  const [transaction] = await prisma.$transaction([
    prisma.inventoryTransaction.create({
      data: {
        schoolId: req.user.schoolId,
        itemId,
        type,
        quantity: qty,
        remarks,
        date: date ? new Date(date) : new Date(),
      }
    }),
    prisma.inventoryItem.update({
      where: { id: itemId },
      data: { quantity: newQuantity, status }
    })
  ]);

  res.status(201).json({ success: true, data: transaction });
});
