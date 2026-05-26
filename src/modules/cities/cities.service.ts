import { Injectable } from '@nestjs/common';
import { slugify } from '../../common/utils/slugify';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCityDto } from './dto/create-city.dto';

@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}

  findActive() {
    return this.prisma.city.findMany({
      where: { isActive: true },
      orderBy: [{ state: 'asc' }, { name: 'asc' }],
    });
  }

  create(dto: CreateCityDto) {
    return this.prisma.city.create({
      data: {
        name: dto.name,
        state: dto.state,
        country: dto.country ?? 'India',
        slug: slugify([dto.name, dto.state].filter(Boolean).join(' ')),
      },
    });
  }
}
