import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'ROOT_ADMIN@example.com' },
    update: {},
    create: {
      name: 'ROOT',
      email: 'ROOT_ADMIN@example.com',
      password: hashedPassword,
      role: 'ROOT_ADMIN',
      verify: true,
    },
  });

  console.log('ROOT_ADMIN seeded !');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
