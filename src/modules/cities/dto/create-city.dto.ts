import { IsOptional, IsString } from 'class-validator';

export class CreateCityDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
