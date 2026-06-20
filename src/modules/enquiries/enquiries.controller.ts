import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EnquiryStatus, UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryStatusDto } from './dto/update-enquiry-status.dto';
import { EnquiriesService } from './enquiries.service';

@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiries: EnquiriesService) {}

  @Post()
  create(@Body() dto: CreateEnquiryDto) {
    return this.enquiries.create(dto);
  }

  @Get('owner/mine')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER)
  findMine(@CurrentUser() user: CurrentUser) {
    return this.enquiries.findOwnerEnquiries(user.id);
  }
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(@Query('status') status?: EnquiryStatus) {
    return this.enquiries.findAll(status);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateEnquiryStatusDto) {
    return this.enquiries.updateStatus(id, dto.status);
  }
}

