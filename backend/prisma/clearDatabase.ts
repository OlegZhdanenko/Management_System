import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database cleanup...');
  await prisma.notes.deleteMany({});
  await prisma.groups.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('All data deleted!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
