import { IsEnum } from 'class-validator';
import { EnquiryStatus } from '@prisma/client';

export class UpdateEnquiryStatusDto {
  @IsEnum(EnquiryStatus)
  status: EnquiryStatus;
}
