import {
  IsArray,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { PriceRange } from '@prisma/client';

export class CreateListingDto {
  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  cityId?: string;

  @IsString()
  name: string;

  @IsString()
  @MaxLength(4000)
  description: string;

  @IsArray()
  @IsString({ each: true })
  services: string[];

  @IsPhoneNumber('IN')
  contactPhone: string;

  @IsPhoneNumber('IN')
  whatsappPhone: string;

  @IsOptional()
  @IsString()
  instagramUrl?: string;

  @IsString()
  addressLine1: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsOptional()
  @IsString()
  landmark?: string;

  @IsOptional()
  @IsString()
  pincode?: string;

  @IsOptional()
  @IsString()
  opensAt?: string;

  @IsOptional()
  @IsString()
  closesAt?: string;

  @IsOptional()
  @IsEnum(PriceRange)
  priceRange?: PriceRange;
}
