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
    console.log('======================================');
    console.log('SAVE LISTING API HIT');
    console.log('User ID =>', userId);
    console.log('Listing ID =>', listingId);

    const listing = await this.prisma.businessListing.findUnique({
      where: { id: listingId },
    });

    console.log('Listing Found =>', listing);

    if (!listing) {
      console.log('ERROR => Listing not found');
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

    console.log('Already Saved =>', alreadySaved);

    if (alreadySaved) {
      console.log('ERROR => Listing already saved');
      throw new BadRequestException('Listing already saved');
    }

    const saved = await this.prisma.savedListing.create({
      data: {
        userId,
        listingId,
      },
    });

    console.log('Saved Successfully =>', saved);
    console.log('======================================');

    return saved;
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
