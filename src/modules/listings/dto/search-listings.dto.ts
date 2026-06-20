import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PriceRange } from '@prisma/client';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class SearchListingsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(PriceRange)
  priceRange?: PriceRange;

  @IsOptional()
  @IsString()
  openNow?: string;
}
