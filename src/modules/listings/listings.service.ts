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

    const items = await this.prisma.businessListing.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ isFeatured: 'desc' }, { updatedAt: 'desc' }],
      include: {
        category: true,
        city: true,
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
    });

    const total = await this.prisma.businessListing.count({ where });

    return { items, page, limit, total };
  }

  async findPublicBySlug(slug: string) {
    const listing = await this.prisma.businessListing.findFirst({
      where: {
        slug,
        status: ListingStatus.APPROVED,
        isDeleted: false,
      },
      include: {
        category: true,
        city: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });


    if (!listing) {
      throw new NotFoundException('Listing not found.');
    }

    await this.prisma.businessListing.update({
      where: { id: listing.id },
      data: { viewCount: { increment: 1 } },
    });

    return listing;
  }

  async createOwnerListing(ownerId: string, dto: CreateListingDto) {
    return this.prisma.businessListing.create({
      data: {
        ...dto,
        ownerId,
        slug: await this.uniqueSlug(dto.name),
        status: ListingStatus.DRAFT,
      },
    });
  }

  findOwnerListings(ownerId: string) {
    return this.prisma.businessListing.findMany({
      where: { ownerId, isDeleted: false },
      include: {
        category: true,
        city: true,
        images: { orderBy: { sortOrder: 'asc' } },
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

    return this.prisma.businessListing.update({
      where: { id },
      data: {
        ...dto,
        status: ListingStatus.DRAFT,
        rejectionReason: null,
      },
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

  findPublicListings() {
    return this.prisma.businessListing.findMany({
      where: {
        status: ListingStatus.APPROVED,
        isDeleted: false,
      },
      orderBy: [{ isFeatured: 'desc' }, { updatedAt: 'desc' }],
      include: {
        category: true,
        city: true,
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      },
    });
  }

  async incrementWhatsappTap(id: string) {
    return this.prisma.businessListing.update({
      where: { id },
      data: { whatsappTapCount: { increment: 1 } },
      select: { id: true, whatsappTapCount: true },
    });
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
