import { Injectable } from '@nestjs/common';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';

@Injectable()
export class ContactService {
  async create(dto: CreateEnquiryDto) {
    console.log('New contact enquiry:', dto);

    return {
      success: true,
      message: 'Contact enquiry submitted successfully',
      data: dto,
    };
  }

  async findAll() {
    return {
      success: true,
      message: 'Contact API is working',
      data: [],
    };
  }
}
