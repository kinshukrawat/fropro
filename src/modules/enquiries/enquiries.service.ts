import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EnquiryStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';

@Injectable()
export class EnquiriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEnquiryDto) {
    if (dto.listingId) {
      const listing = await this.prisma.businessListing.findUnique({
        where: { id: dto.listingId },
        select: { id: true, isDeleted: true },
      });

      if (!listing || listing.isDeleted) {
        throw new BadRequestException('Selected listing is not available.');
      }
    }

    return this.prisma.enquiry.create({
      data: {
        name: dto.name.trim(),
        phone: dto.phone,
        message: dto.message.trim(),
        listingId: dto.listingId,
      },
    });
  }

  findAll(status?: EnquiryStatus) {
    const where: Prisma.EnquiryWhereInput = status ? { status } : {};

    return this.prisma.enquiry.findMany({
      where,
      include: {
        listing: {
          select: {
            id: true,
            name: true,
            slug: true,
            contactPhone: true,
            whatsappPhone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: EnquiryStatus) {
    const enquiry = await this.prisma.enquiry.findUnique({ where: { id } });

    if (!enquiry) {
      throw new NotFoundException('Enquiry not found.');
    }

    return this.prisma.enquiry.update({
      where: { id },
      data: { status },
    });
  }
}
