const express = require("express");
const { protect, authorize } = require("../middlewares/auth.middleware");
const createCrudController = require("../utils/create-crud-controller");
const prisma = require("../utils/prisma");

const router = express.Router();

// Only Admins can manage roles
router.use(protect);
router.use(authorize("admin"));

const rolesController = createCrudController(prisma.role, {
  searchFields: ["name", "description"],
});

router.get("/", rolesController.list);
router.get("/:id", rolesController.getById);
router.post("/", rolesController.create);
router.put("/:id", rolesController.update);
router.delete("/:id", rolesController.remove);

module.exports = router;
