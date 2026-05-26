const createResourceRouter = require("../utils/create-resource-router");
const { resultController } = require("../controllers/resource.controllers");
const { STAFF_ROLES, ADMIN_ONLY } = require("../constants/roles");

module.exports = createResourceRouter({
  controller: resultController,
  listRoles: STAFF_ROLES,
  createRoles: STAFF_ROLES,
  readRoles: STAFF_ROLES,
  updateRoles: STAFF_ROLES,
  deleteRoles: ADMIN_ONLY,
});

