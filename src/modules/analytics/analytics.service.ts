import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  trackWhatsappTap(listingId: string) {
    return this.prisma.businessListing.update({
      where: { id: listingId },
      data: { whatsappTapCount: { increment: 1 } },
      select: { id: true, whatsappTapCount: true },
    });
  }

  ownerListingPerformance(ownerId: string) {
    return this.prisma.businessListing.findMany({
      where: { ownerId, isDeleted: false },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        viewCount: true,
        whatsappTapCount: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async platformStats() {
    const [totalListings, activePlans, revenue] = await this.prisma.$transaction([
      this.prisma.businessListing.count({ where: { isDeleted: false } }),
      this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      this.prisma.payment.aggregate({
        where: { status: 'SUCCESSFUL' },
        _sum: { amountPaise: true },
      }),
    ]);

    return {
      totalListings,
      activePlans,
      revenuePaise: revenue._sum.amountPaise ?? 0,
    };
  }
}
