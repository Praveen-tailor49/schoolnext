const createResourceRouter = require("../utils/create-resource-router");
const { userController } = require("../controllers/resource.controllers");
const { ADMIN_ONLY } = require("../constants/roles");

module.exports = createResourceRouter({
  controller: userController,
  listRoles: ADMIN_ONLY,
  createRoles: ADMIN_ONLY,
  readRoles: ADMIN_ONLY,
  updateRoles: ADMIN_ONLY,
  deleteRoles: ADMIN_ONLY,
});

