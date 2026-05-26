const createResourceRouter = require("../utils/create-resource-router");
const { feeStructureController } = require("../controllers/resource.controllers");
const { STAFF_ROLES, ADMIN_ONLY } = require("../constants/roles");

module.exports = createResourceRouter({
  controller: feeStructureController,
  listRoles: STAFF_ROLES,
  createRoles: ADMIN_ONLY,
  readRoles: STAFF_ROLES,
  updateRoles: ADMIN_ONLY,
  deleteRoles: ADMIN_ONLY,
});
