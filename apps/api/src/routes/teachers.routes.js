const createResourceRouter = require("../utils/create-resource-router");
const { teacherController } = require("../controllers/resource.controllers");
const { STAFF_ROLES, ADMIN_ONLY } = require("../constants/roles");

module.exports = createResourceRouter({
  controller: teacherController,
  listRoles: STAFF_ROLES,
  createRoles: ADMIN_ONLY,
  readRoles: STAFF_ROLES,
  updateRoles: ADMIN_ONLY,
  deleteRoles: ADMIN_ONLY,
});

