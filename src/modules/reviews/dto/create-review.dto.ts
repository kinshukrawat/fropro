import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  listingId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string;
}
