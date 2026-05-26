import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddListingImageDto } from './dto/add-listing-image.dto';

@Injectable()
export class UploadsService {
  constructor(private readonly prisma: PrismaService) {}

  async addListingImage(userId: string, dto: AddListingImageDto) {
    const listing = await this.prisma.businessListing.findUnique({
      where: { id: dto.listingId },
      include: { images: true },
    });

    if (!listing || listing.isDeleted) {
      throw new NotFoundException('Listing not found.');
    }

    if (listing.ownerId !== userId) {
      throw new ForbiddenException('You cannot upload images for this listing.');
    }

    if (listing.images.length >= 10) {
      throw new BadRequestException('A listing can have up to 10 images.');
    }

    return this.prisma.listingImage.create({
      data: {
        listingId: listing.id,
        cloudinaryId: dto.cloudinaryId,
        url: dto.url,
        altText: dto.altText,
        sortOrder: listing.images.length,
      },
    });
  }

  async removeListingImage(userId: string, imageId: string) {
    const image = await this.prisma.listingImage.findUnique({
      where: { id: imageId },
      include: { listing: true },
    });

    if (!image || image.listing.isDeleted) {
      throw new NotFoundException('Image not found.');
    }

    if (image.listing.ownerId !== userId) {
      throw new ForbiddenException('You cannot remove this image.');
    }

    return this.prisma.listingImage.delete({ where: { id: imageId } });
  }
}
