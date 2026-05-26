const express = require("express");
const { protect, authorize } = require("../middlewares/auth.middleware");

const createResourceRouter = ({
  controller,
  listRoles,
  createRoles,
  readRoles,
  updateRoles,
  deleteRoles,
}) => {
  const router = express.Router();

  router.use(protect);

  router
    .route("/")
    .get(authorize(...listRoles), controller.list)
    .post(authorize(...createRoles), controller.create);

  router
    .route("/:id")
    .get(authorize(...readRoles), controller.getById)
    .put(authorize(...updateRoles), controller.update)
    .delete(authorize(...deleteRoles), controller.remove);

  return router;
};

module.exports = createResourceRouter;
