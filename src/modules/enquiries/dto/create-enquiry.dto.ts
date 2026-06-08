import { IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateEnquiryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @IsPhoneNumber('IN')
  phone: string;

  @IsString()
  @MinLength(5)
  @MaxLength(2000)
  message: string;

  @IsOptional()
  @IsString()
  listingId?: string;
}
