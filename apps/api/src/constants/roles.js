const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
};

const STAFF_ROLES = [ROLES.ADMIN, ROLES.TEACHER];
const ADMIN_ONLY = [ROLES.ADMIN];
const ALL_AUTH_ROLES = Object.values(ROLES);

module.exports = {
  ROLES,
  STAFF_ROLES,
  ADMIN_ONLY,
  ALL_AUTH_ROLES,
};

