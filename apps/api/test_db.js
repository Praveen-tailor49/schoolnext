const mariadb = require("mariadb");
const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

async function test() {
  try {
    const pool = mariadb.createPool({
      host: "localhost",
      user: "root",
      database: "school_erp"
    });
    const adapter = new PrismaMariaDb(pool);
    const prisma = new PrismaClient({ adapter });
    
    const users = await prisma.user.findMany();
    console.log("Prisma found users:", users.length);
  } catch (err) {
    console.error("Prisma error:", err);
  }
}

test();
