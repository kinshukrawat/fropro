import { Injectable } from '@nestjs/common';
import { slugify } from '../../common/utils/slugify';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findActive() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  findAll() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        ...dto,
        slug: slugify(dto.name),
      },
    });
  }

  update(id: string, dto: Partial<CreateCategoryDto> & { isActive?: boolean }) {
    return this.prisma.category.update({
      where: { id },
      data: {
        ...dto,
        slug: dto.name ? slugify(dto.name) : undefined,
      },
    });
  }
}
