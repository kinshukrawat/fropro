import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import type { File as MulterFile } from 'multer';
import { PrismaService } from '../prisma/prisma.service';
import { AddListingImageDto } from './dto/add-listing-image.dto';

@Injectable()
export class UploadsService {
  constructor(private readonly prisma: PrismaService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: MulterFile) {
    if (!file) {
      throw new BadRequestException('Image file is required.');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed.');
    }

    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'fropro/listings',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });

    return {
      success: true,
      url: result.secure_url,
      cloudinaryId: result.public_id,
    };
  }

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

    await cloudinary.uploader.destroy(image.cloudinaryId);

    return this.prisma.listingImage.delete({ where: { id: imageId } });
  }
}
