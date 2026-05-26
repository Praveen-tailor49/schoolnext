const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth.middleware");
const { ROLES } = require("../constants/roles");
const expensesController = require("../controllers/expenses.controller");

router.use(protect);
router.use(authorize(ROLES.ADMIN));

// Categories
router.get("/categories", expensesController.getCategories);
router.post("/categories", expensesController.createCategory);
router.delete("/categories/:id", expensesController.deleteCategory);

// Expenses
router.get("/", expensesController.getExpenses);
router.post("/", expensesController.createExpense);
router.delete("/:id", expensesController.deleteExpense);

module.exports = router;
