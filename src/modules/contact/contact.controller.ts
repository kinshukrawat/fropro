import { Controller, Get, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() dto: CreateEnquiryDto) {
    return this.contactService.create(dto);
  }

  @Get()  // ← Yeh hona chahiye
  findAll() {
    return this.contactService.findAll();
  }
}