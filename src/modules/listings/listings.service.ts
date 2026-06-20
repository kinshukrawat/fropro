import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ListingStatus, Prisma } from '@prisma/client';
import { slugify } from '../../common/utils/slugify';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { SearchListingsDto } from './dto/search-listings.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async searchPublic(query: SearchListingsDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;

    const where: Prisma.BusinessListingWhereInput = {
      status: ListingStatus.APPROVED,
      isDeleted: false,
    };

    const searchFilters: Prisma.BusinessListingWhereInput[] = [];

    if (query.q) {
      searchFilters.push({
        OR: [
          { name: { contains: query.q, mode: 'insensitive' } },
          { description: { contains: query.q, mode: 'insensitive' } },
          { addressLine1: { contains: query.q, mode: 'insensitive' } },
          { addressLine2: { contains: query.q, mode: 'insensitive' } },
          { landmark: { contains: query.q, mode: 'insensitive' } },
          { pincode: { contains: query.q, mode: 'insensitive' } },
          { email: { contains: query.q, mode: 'insensitive' } },
          { services: { hasSome: [query.q] } },
        ],
      });
    }

    if (query.category) {
      searchFilters.push({
        OR: [
          { category: { slug: query.category } },
          {
            category: {
              name: { contains: query.category, mode: 'insensitive' },
            },
          },
        ],
      });
    }

    if (query.city) {
      searchFilters.push({
        OR: [
          { city: { slug: query.city } },
          {
            city: {
              name: { contains: query.city, mode: 'insensitive' },
            },
          },
        ],
      });
    }

    if (query.location) {
      searchFilters.push({
        OR: [
          { city: { name: { contains: query.location, mode: 'insensitive' } } },
          { addressLine1: { contains: query.location, mode: 'insensitive' } },
          { addressLine2: { contains: query.location, mode: 'insensitive' } },
          { landmark: { contains: query.location, mode: 'insensitive' } },
          { pincode: { contains: query.location, mode: 'insensitive' } },
        ],
      });
    }

    if (query.priceRange) {
      searchFilters.push({
        priceRange: query.priceRange,
      });
    }

    if (query.openNow === 'true') {
      const now = new Date();

      const currentTime = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Kolkata',
      });

      searchFilters.push({
        opensAt: {
          not: null,
          lte: currentTime,
        },
        closesAt: {
          not: null,
          gte: currentTime,
        },
      });
    }

    if (searchFilters.length > 0) {
      where.AND = searchFilters;
    }

    if (query.minRating) {
      const qualifyingIds = await this.listingIdsMeetingMinRating(query.minRating);
      where.id = { in: qualifyingIds };
    }

    const items = await this.prisma.businessListing.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ isFeatured: 'desc' }, { updatedAt: 'desc' }],
      include: this.listingListInclude(),
    });

    const total = await this.prisma.businessListing.count({ where });
    const itemsWithReviews = await this.attachReviewSummaries(items);

    return { items: itemsWithReviews, page, limit, total };
  }

  async findPublicBySlug(slug: string) {
    const listing = await this.prisma.businessListing.findFirst({
      where: {
        slug,
        status: ListingStatus.APPROVED,
        isDeleted: false,
      },
      include: this.listingInclude({ catalogueActiveOnly: true }),
    });

    if (!listing) {
      throw new NotFoundException('Listing not found.');
    }

    await this.prisma.businessListing.update({
      where: { id: listing.id },
      data: { viewCount: { increment: 1 } },
    });

    const reviewSummary = await this.reviewSummary(listing.id);

    return { ...listing, ...reviewSummary };
  }

  async createOwnerListing(ownerId: string, dto: CreateListingDto) {
    const { catalogueItems, ...listingData } = dto;

    return this.prisma.businessListing.create({
      data: {
        ...listingData,
        ownerId,
        slug: await this.uniqueSlug(dto.name),
        status: ListingStatus.DRAFT,
        catalogueItems: this.catalogueCreateInput(catalogueItems),
      },
      include: this.listingInclude(),
    });
  }

  findOwnerListings(ownerId: string) {
    return this.prisma.businessListing.findMany({
      where: { ownerId, isDeleted: false },
      include: {
        ...this.listingInclude(),
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { plan: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async updateOwnerListing(ownerId: string, id: string, dto: UpdateListingDto) {
    await this.assertOwnerListing(ownerId, id);

    const { catalogueItems, ...listingData } = dto;

    const updateData: Prisma.BusinessListingUpdateInput = {
      ...listingData,
      status: ListingStatus.DRAFT,
      rejectionReason: null,
    };

    if (catalogueItems) {
      updateData.catalogueItems = {
        deleteMany: {},
        create: catalogueItems.map((item, index) => ({
          title: item.title,
          description: item.description,
          buttonLabel: item.buttonLabel ?? 'Ask for Price',
          sortOrder: index,
        })),
      };
    }

    return this.prisma.businessListing.update({
      where: { id },
      data: updateData,
      include: this.listingInclude(),
    });
  }

  async submitOwnerListing(ownerId: string, id: string) {
    await this.assertOwnerListing(ownerId, id);

    return this.prisma.businessListing.update({
      where: { id },
      data: {
        status: ListingStatus.SUBMITTED,
        submittedAt: new Date(),
      },
    });
  }

  async findPublicListings() {
    const items = await this.prisma.businessListing.findMany({
      where: {
        status: ListingStatus.APPROVED,
        isDeleted: false,
      },
      orderBy: [{ isFeatured: 'desc' }, { updatedAt: 'desc' }],
      include: this.listingListInclude(),
    });

    return this.attachReviewSummaries(items);
  }

  async incrementWhatsappTap(id: string) {
    return this.prisma.businessListing.update({
      where: { id },
      data: { whatsappTapCount: { increment: 1 } },
      select: { id: true, whatsappTapCount: true },
    });
  }

  private async reviewSummary(listingId: string) {
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

  private async attachReviewSummaries<T extends { id: string }>(items: T[]) {
    if (!items.length) {
      return items;
    }

    try {
      const aggregates = await this.prisma.review.groupBy({
        by: ['listingId'],
        where: {
          listingId: { in: items.map((item) => item.id) },
          isApproved: true,
        },
        _avg: { rating: true },
        _count: { rating: true },
      });

      const summaryByListingId = new Map(
        aggregates.map((aggregate) => [
          aggregate.listingId,
          {
            rating: aggregate._avg.rating
              ? Number(aggregate._avg.rating.toFixed(1))
              : 0,
            reviewCount: aggregate._count.rating,
          },
        ]),
      );

      return items.map((item) => {
        const summary = summaryByListingId.get(item.id);
        return {
          ...item,
          rating: summary?.rating ?? 0,
          reviewCount: summary?.reviewCount ?? 0,
        };
      });
    } catch {
      return items.map((item) => ({
        ...item,
        rating: 0,
        reviewCount: 0,
      }));
    }
  }

  private async listingIdsMeetingMinRating(minRating: number) {
    const qualifying = await this.prisma.review.groupBy({
      by: ['listingId'],
      where: { isApproved: true },
      _avg: { rating: true },
      having: {
        rating: {
          _avg: {
            gte: minRating,
          },
        },
      },
    });

    return qualifying.map((entry) => entry.listingId);
  }

  private listingListInclude() {
    return {
      category: true,
      city: true,
      images: {
        orderBy: { sortOrder: 'asc' as const },
        take: 1,
      },
    };
  }

  private listingInclude(options?: { imageLimit?: number; catalogueActiveOnly?: boolean }) {
    return {
      category: true,
      city: true,
      images: {
        orderBy: { sortOrder: 'asc' as const },
        ...(options?.imageLimit ? { take: options.imageLimit } : {}),
      },
      catalogueItems: {
        where: options?.catalogueActiveOnly ? { isActive: true } : undefined,
        orderBy: { sortOrder: 'asc' as const },
      },
    };
  }

  private catalogueCreateInput(catalogueItems?: CreateListingDto['catalogueItems']) {
    if (!catalogueItems?.length) {
      return undefined;
    }

    return {
      create: catalogueItems.map((item, index) => ({
        title: item.title,
        description: item.description,
        buttonLabel: item.buttonLabel ?? 'Ask for Price',
        sortOrder: index,
      })),
    };
  }

  private async assertOwnerListing(ownerId: string, id: string) {
    const listing = await this.prisma.businessListing.findUnique({
      where: { id },
      select: { ownerId: true, isDeleted: true },
    });

    if (!listing || listing.isDeleted) {
      throw new NotFoundException('Listing not found.');
    }

    if (listing.ownerId !== ownerId) {
      throw new ForbiddenException('You cannot manage this listing.');
    }
  }

  private async uniqueSlug(name: string) {
    const base = slugify(name);
    let slug = base;
    let counter = 2;

    while (await this.prisma.businessListing.findUnique({ where: { slug } })) {
      slug = `${base}-${counter}`;
      counter += 1;
    }

    return slug;
  }
}


