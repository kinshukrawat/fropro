import { IsString } from 'class-validator';

export class CreatePaymentOrderDto {
  @IsString()
  listingId: string;

  @IsString()
  planId: string;
}
