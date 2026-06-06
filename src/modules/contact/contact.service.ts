import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEnquiryDto) {
    return this.prisma.enquiry.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.enquiry.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}