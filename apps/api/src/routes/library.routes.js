const createResourceRouter = require("../utils/create-resource-router");
const { libraryController } = require("../controllers/resource.controllers");
const { STAFF_ROLES, ADMIN_ONLY } = require("../constants/roles");

module.exports = createResourceRouter({
  controller: libraryController,
  listRoles: ["admin", "teacher", "student"],
  createRoles: STAFF_ROLES,
  readRoles: ["admin", "teacher", "student"],
  updateRoles: STAFF_ROLES,
  deleteRoles: ADMIN_ONLY,
});

