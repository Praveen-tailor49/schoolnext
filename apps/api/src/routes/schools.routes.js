const express = require("express");
const { protect, authorize } = require("../middlewares/auth.middleware");
const { createCrudController } = require("../utils/create-crud-controller");
const prisma = require("../utils/prisma");

const router = express.Router();

// Only Super Admins can manage schools (in a real app). 
// For now, we'll allow 'admin' to manage it so the UI is accessible for demo purposes.
router.use(protect);
router.use(authorize("admin", "super-admin"));

// Custom controller for School since it doesn't need schoolId filtering 
// like the default createCrudController does.
const schoolsController = {
  getAll: async (req, res, next) => {
    try {
      const items = await prisma.school.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.json({ items, pagination: { total: items.length } });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const item = await prisma.school.create({ data: req.body });
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const item = await prisma.school.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json(item);
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      await prisma.school.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
};

router.get("/", schoolsController.getAll);
router.post("/", schoolsController.create);
router.put("/:id", schoolsController.update);
router.delete("/:id", schoolsController.delete);

module.exports = router;
