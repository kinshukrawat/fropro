import { PrismaClient, PlanDuration, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash('ChangeMe123!', 12);
  const ownerPasswordHash = await bcrypt.hash('ChangeMe123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Platform Admin',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      name: 'Demo Owner',
      email: 'owner@example.com',
      phone: '+919876543210',
      passwordHash: ownerPasswordHash,
      role: UserRole.BUSINESS_OWNER,
    },
  });

  const salonCategory = await prisma.category.upsert({
    where: { slug: 'salon' },
    update: {},
    create: {
      name: 'Salon',
      slug: 'salon',
      description: 'Hair, beauty, and grooming services',
    },
  });

  const gymCategory = await prisma.category.upsert({
    where: { slug: 'gym' },
    update: {},
    create: {
      name: 'Gym',
      slug: 'gym',
      description: 'Fitness and training centers',
    },
  });

  const rohiniCity = await prisma.city.upsert({
    where: { slug: 'rohini-delhi' },
    update: {},
    create: {
      name: 'Rohini',
      state: 'Delhi',
      country: 'India',
      slug: 'rohini-delhi',
    },
  });

  const pitampuraCity = await prisma.city.upsert({
    where: { slug: 'pitampura-delhi' },
    update: {},
    create: {
      name: 'Pitampura',
      state: 'Delhi',
      country: 'India',
      slug: 'pitampura-delhi',
    },
  });

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

  await prisma.businessListing.upsert({
    where: { slug: 'demo-salon-rohini' },
    update: {},
    create: {
      ownerId: owner.id,
      categoryId: salonCategory.id,
      cityId: rohiniCity.id,
      name: 'Demo Salon Rohini',
      slug: 'demo-salon-rohini',
      description: 'A seeded demo salon listing for frontend testing.',
      services: ['Haircut', 'Bridal Makeup', 'Facial'],
      contactPhone: '+919876543210',
      whatsappPhone: '+919876543210',
      addressLine1: 'Rohini Sector 7, Delhi',
      addressLine2: 'Near Metro Station',
      landmark: 'City Center',
      pincode: '110085',
      status: 'APPROVED',
      approvedAt: new Date(),
      isFeatured: true,
      viewCount: 12,
      whatsappTapCount: 4,
    },
  });

  await prisma.businessListing.upsert({
    where: { slug: 'demo-gym-pitampura' },
    update: {},
    create: {
      ownerId: owner.id,
      categoryId: gymCategory.id,
      cityId: pitampuraCity.id,
      name: 'Demo Gym Pitampura',
      slug: 'demo-gym-pitampura',
      description: 'A second seeded listing for search and category testing.',
      services: ['Strength Training', 'Cardio', 'Personal Training'],
      contactPhone: '+919812345678',
      whatsappPhone: '+919812345678',
      addressLine1: 'Pitampura, Delhi',
      status: 'SUBMITTED',
    },
  });

  console.log(`Seeded admin ${admin.email} and owner ${owner.email}`);
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
