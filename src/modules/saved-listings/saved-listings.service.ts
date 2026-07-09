import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SavedListingsService {
  constructor(private readonly prisma: PrismaService) {}

  // ==========================
  // Save Listing
  // ==========================
  async saveListing(userId: string, listingId: string) {
    console.log('==============================');
    console.log('Received User ID =>', userId);
    console.log('Received Listing ID =>', listingId);

    const allListings = await this.prisma.businessListing.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    console.log('Business Listings In Database =>');
    console.log(allListings);

    const listing = await this.prisma.businessListing.findUnique({
      where: {
        id: listingId,
      },
    });

    console.log('Matched Listing =>');
    console.log(listing);

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

    const savedListing = await this.prisma.savedListing.create({
      data: {
        userId,
        listingId,
      },
    });

    console.log('Saved Successfully =>');
    console.log(savedListing);

    return savedListing;
  }

  // ==========================
  // Remove Saved Listing
  // ==========================
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

  // ==========================
  // Get All Saved Listings
  // ==========================
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

  // ==========================
  // Check Saved
  // ==========================
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
