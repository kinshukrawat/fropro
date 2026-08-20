import { PriceRange } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';


export class ListingCatalogueItemDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title: string;

  @IsString()
  @MinLength(2)
  @MaxLength(500)
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  buttonLabel?: string;
}

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
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUrl({ require_protocol: false })
  website?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  instagramUrl?: string;

  @IsOptional()
  @IsEnum(PriceRange)
  priceRange?: PriceRange;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'opensAt must use HH:mm 24-hour format, for example 09:00.',
  })
  opensAt?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'closesAt must use HH:mm 24-hour format, for example 21:00.',
  })
  closesAt?: string;

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
  @Type(() => Number)
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListingCatalogueItemDto)
  catalogueItems?: ListingCatalogueItemDto[];
}

