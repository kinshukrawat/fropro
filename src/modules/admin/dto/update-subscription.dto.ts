import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { SubscriptionStatus } from '@prisma/client';

export class UpdateSubscriptionDto {
  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
