import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SavedListingsService {
  constructor(private readonly prisma: PrismaService) {}

  // Save Listing
  async saveListing(userId: string, listingId: string) {
    const listing = await this.prisma.businessListing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const alreadySaved = await this.prisma.savedListing.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    if (alreadySaved) {
      throw new BadRequestException('Listing already saved');
    }

    return this.prisma.savedListing.create({
      data: {
        userId,
        listingId,
      },
    });
  }

  // Remove Saved Listing
  async removeSavedListing(userId: string, listingId: string) {
    const saved = await this.prisma.savedListing.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    if (!saved) {
      throw new NotFoundException('Saved listing not found');
    }

    await this.prisma.savedListing.delete({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    return {
      message: 'Listing removed from saved',
    };
  }

  // Get All Saved Listings
  async getSavedListings(userId: string) {
    return this.prisma.savedListing.findMany({
      where: {
        userId,
      },
      include: {
        listing: {
          include: {
            images: true,
            category: true,
            city: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Check if Listing is Saved
  async isListingSaved(userId: string, listingId: string) {
    const saved = await this.prisma.savedListing.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    return {
      saved: !!saved,
    };
  }
}
