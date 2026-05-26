import { PrismaClient, PlanDuration, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.subscriptionPlan.upsert({
    where: { duration: PlanDuration.THREE_MONTHS },
    update: {},
    create: {
      name: '3 Month Listing Plan',
      duration: PlanDuration.THREE_MONTHS,
      pricePaise: 0,
    },
  });

  await prisma.subscriptionPlan.upsert({
    where: { duration: PlanDuration.SIX_MONTHS },
    update: {},
    create: {
      name: '6 Month Listing Plan',
      duration: PlanDuration.SIX_MONTHS,
      pricePaise: 0,
    },
  });

  const passwordHash = await bcrypt.hash('ChangeMe123!', 12);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Platform Admin',
      email: 'admin@example.com',
      passwordHash,
      role: UserRole.ADMIN,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
