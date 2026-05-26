const createResourceRouter = require("../utils/create-resource-router");
const { timetableController } = require("../controllers/resource.controllers");
const { STAFF_ROLES, ADMIN_ONLY } = require("../constants/roles");

module.exports = createResourceRouter({
  controller: timetableController,
  listRoles: ["admin", "teacher", "student"],
  createRoles: STAFF_ROLES,
  readRoles: ["admin", "teacher", "student"],
  updateRoles: STAFF_ROLES,
  deleteRoles: ADMIN_ONLY,
});

