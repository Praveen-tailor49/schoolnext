const createResourceRouter = require("../utils/create-resource-router");
const { alumniController } = require("../controllers/resource.controllers");
const { STAFF_ROLES, ADMIN_ONLY } = require("../constants/roles");

const router = createResourceRouter({
  controller: alumniController,
  listRoles: STAFF_ROLES,
  createRoles: STAFF_ROLES,
  readRoles: STAFF_ROLES,
  updateRoles: STAFF_ROLES,
  deleteRoles: ADMIN_ONLY,
});

module.exports = router;
