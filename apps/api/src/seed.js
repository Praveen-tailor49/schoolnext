require("dotenv").config();
const prisma = require("./utils/prisma");
const bcrypt = require("bcryptjs");
const { ROLES } = require("./constants/roles");

const roleSeed = [
  {
    name: ROLES.ADMIN,
    description: "Full administrative access",
    permissions: ["*"],
  },
  {
    name: ROLES.TEACHER,
    description: "Teacher operations access",
    permissions: [
      "students:read",
      "attendance:*",
      "results:*",
      "homework:*",
      "notices:*",
      "timetable:*",
    ],
  },
  {
    name: ROLES.STUDENT,
    description: "Student self-service access",
    permissions: ["results:read", "homework:read", "notices:read"],
  },
  {
    name: ROLES.PARENT,
    description: "Parent communication access",
    permissions: ["fees:read", "communications:read", "notices:read"],
  },
];

const seed = async () => {
  const schoolName = "Default LearnNext School";
  let defaultSchool = await prisma.school.findFirst({ where: { name: schoolName } });
  if (!defaultSchool) {
    defaultSchool = await prisma.school.create({
      data: {
        name: schoolName,
        email: "contact@learnnext.com"
      }
    });
  }

  for (const role of roleSeed) {
    await prisma.role.upsert({
      where: { schoolId_name: { schoolId: defaultSchool.id, name: role.name } },
      update: { description: role.description, permissions: role.permissions },
      create: { name: role.name, description: role.description, permissions: role.permissions, schoolId: defaultSchool.id },
    });
  }

  const email = process.env.DEFAULT_ADMIN_EMAIL || "admin@learnnext.com";
  const password = process.env.DEFAULT_ADMIN_PASSWORD || "Admin@123";
  const existingAdmin = await prisma.user.findUnique({ where: { email } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        name: "System Administrator",
        email,
        password: hashedPassword,
        role: ROLES.ADMIN,
        schoolId: defaultSchool.id,
      },
    });
  }

  console.log("Seed completed successfully.");
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
