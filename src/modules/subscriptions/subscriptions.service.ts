import { Injectable } from '@nestjs/common';
import { SubscriptionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  findActivePlans() {
    return this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { pricePaise: 'asc' },
    });
  }

  findOwnerSubscriptions(userId: string) {
    return this.prisma.subscription.findMany({
      where: { userId },
      include: { listing: true, plan: true, payments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async expireOldSubscriptions(now = new Date()) {
    return this.prisma.subscription.updateMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        expiresAt: { lte: now },
      },
      data: { status: SubscriptionStatus.EXPIRED },
    });
  }

  durationMonths(duration: string) {
    return duration === 'SIX_MONTHS' ? 6 : 3;
  }
}
