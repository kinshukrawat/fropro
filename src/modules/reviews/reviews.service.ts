import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateReviewDto) {
    const listing = await this.prisma.businessListing.findFirst({
      where: { id: dto.listingId, isDeleted: false },
      select: { id: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found.');
    }

    return this.prisma.review.create({
      data: {
        listingId: dto.listingId,
        rating: Number(dto.rating),
        name: dto.name?.trim() || 'Guest',
        comment: dto.comment?.trim(),
      },
    });
  }

  findByListing(listingId: string) {
    return this.prisma.review.findMany({
      where: { listingId, isApproved: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async summaryForListing(listingId: string) {
    const aggregate = await this.prisma.review.aggregate({
      where: { listingId, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
      rating: aggregate._avg.rating ? Number(aggregate._avg.rating.toFixed(1)) : 0,
      reviewCount: aggregate._count.rating,
    };
  }

  findRecent(limit = 20) {
    return this.prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        listing: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  findOwnerReviews(ownerId: string) {
    return this.prisma.review.findMany({
      where: {
        isApproved: true,
        listing: { ownerId, isDeleted: false },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        listing: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }
}
