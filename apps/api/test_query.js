const prisma = require('./src/utils/prisma');

async function test() {
  try {
    const where = {
      OR: [
        { firstName: { contains: "c" } },
        { lastName: { contains: "c" } },
        { email: { contains: "c" } },
        { phone: { contains: "c" } },
        { admissionNo: { contains: "c" } }
      ]
    };
    
    const count = await prisma.student.count({ where });
    console.log("Count:", count);
  } catch (err) {
    console.error("Prisma error:", err);
  }
}

test();
