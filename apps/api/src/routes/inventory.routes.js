const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth.middleware");
const { ROLES } = require("../constants/roles");
const inventoryController = require("../controllers/inventory.controller");

router.use(protect);
router.use(authorize(ROLES.ADMIN));

// Categories
router.get("/categories", inventoryController.getCategories);
router.post("/categories", inventoryController.createCategory);
router.delete("/categories/:id", inventoryController.deleteCategory);

// Items
router.get("/items", inventoryController.getItems);
router.post("/items", inventoryController.createItem);
router.patch("/items/:id", inventoryController.updateItem);
router.delete("/items/:id", inventoryController.deleteItem);

// Transactions
router.get("/transactions", inventoryController.getTransactions);
router.post("/transactions", inventoryController.createTransaction);

module.exports = router;
