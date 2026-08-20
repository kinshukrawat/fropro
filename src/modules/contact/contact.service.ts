import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEnquiryDto) {
    const enquiry = await this.prisma.enquiry.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        message: dto.message,
      },
    });

    return {
      success: true,
      message: 'Contact enquiry submitted successfully',
      data: enquiry,
    };
  }

  async findAll() {
    const enquiries = await this.prisma.enquiry.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      message: 'Contact enquiries fetched successfully',
      data: enquiries,
    };
  }
}
