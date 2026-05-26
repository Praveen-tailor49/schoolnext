const createResourceRouter = require("../utils/create-resource-router");
const { studentController } = require("../controllers/resource.controllers");
const { STAFF_ROLES, ADMIN_ONLY } = require("../constants/roles");

const { authorize } = require("../middlewares/auth.middleware");

const router = createResourceRouter({
  controller: studentController,
  listRoles: STAFF_ROLES,
  createRoles: STAFF_ROLES,
  readRoles: STAFF_ROLES,
  updateRoles: STAFF_ROLES,
  deleteRoles: ADMIN_ONLY,
});

router.post("/action/promote", authorize(...STAFF_ROLES), studentController.promote);

module.exports = router;

