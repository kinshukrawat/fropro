import { IsOptional, IsString, IsUrl } from 'class-validator';

export class AddListingImageDto {
  @IsString()
  listingId: string;

  @IsString()
  cloudinaryId: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  altText?: string;
}
