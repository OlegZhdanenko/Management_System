// import { PrismaClient } from "@prisma/client";
// import * as bcrypt from "bcrypt";

// const prisma = new PrismaClient();

// async function main() {
//   const hashedPassword = await bcrypt.hash("admin123", 10);

//   await prisma.user.upsert({
//     where: { email: "admin@example.com" },
//     update: {},
//     create: {
//       email: "admin@example.com",
//       password: hashedPassword,
//       role: "ADMIN",
//     },
//   });

//   console.log("Admin seeded !");
// }

// main()
//   .catch(e => console.error(e))
//   .finally(() => prisma.$disconnect());
