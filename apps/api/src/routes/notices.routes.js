const createResourceRouter = require("../utils/create-resource-router");
const { noticeController } = require("../controllers/resource.controllers");
const { STAFF_ROLES, ADMIN_ONLY } = require("../constants/roles");

module.exports = createResourceRouter({
  controller: noticeController,
  listRoles: ["admin", "teacher", "student", "parent"],
  createRoles: STAFF_ROLES,
  readRoles: ["admin", "teacher", "student", "parent"],
  updateRoles: STAFF_ROLES,
  deleteRoles: ADMIN_ONLY,
});

