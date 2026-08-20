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
    console.log('======================================');
    console.log('SAVE LISTING API CALLED');
    console.log('User ID =>', userId);
    console.log('Listing ID =>', listingId);

    // Show all listings present in database
    const allListings = await this.prisma.businessListing.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
      },
    });

    console.log('--------------------------------------');
    console.log('ALL BUSINESS LISTINGS');
    console.log(allListings);
    console.log('--------------------------------------');

    // Find requested listing
    const listing = await this.prisma.businessListing.findUnique({
      where: {
        id: listingId,
      },
    });

    console.log('MATCHED LISTING =>');
    console.log(listing);

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Check already saved
    const alreadySaved = await this.prisma.savedListing.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    console.log('ALREADY SAVED =>');
    console.log(alreadySaved);

    if (alreadySaved) {
      throw new BadRequestException('Listing already saved');
    }

    // Save listing
    const savedListing = await this.prisma.savedListing.create({
      data: {
        userId,
        listingId,
      },
    });

    console.log('SAVED SUCCESSFULLY');
    console.log(savedListing);
    console.log('======================================');

    return savedListing;
  }

  // ==========================
  // Remove Saved Listing
  // ==========================
  async removeSavedListing(userId: string, listingId: string) {
    console.log('REMOVE SAVED LISTING');
    console.log('User ID =>', userId);
    console.log('Listing ID =>', listingId);

    const saved = await this.prisma.savedListing.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    console.log('Saved Record =>');
    console.log(saved);

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

    console.log('Listing Removed Successfully');

    return {
      message: 'Listing removed from saved',
    };
  }

  // ==========================
  // Get All Saved Listings
  // ==========================
  async getSavedListings(userId: string) {
    console.log('GET SAVED LISTINGS');
    console.log('User ID =>', userId);

    const listings = await this.prisma.savedListing.findMany({
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

    console.log('Saved Listings =>');
    console.log(listings);

    return listings;
  }

  // ==========================
  // Check Saved Listing
  // ==========================
  async isListingSaved(userId: string, listingId: string) {
    console.log('CHECK SAVED');
    console.log('User ID =>', userId);
    console.log('Listing ID =>', listingId);

    const saved = await this.prisma.savedListing.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    console.log('Saved =>', saved);

    return {
      saved: !!saved,
    };
  }
}
