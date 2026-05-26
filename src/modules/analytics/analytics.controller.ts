import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Post('listings/:id/whatsapp-tap')
  trackWhatsappTap(@Param('id') id: string) {
    return this.analytics.trackWhatsappTap(id);
  }

  @Get('owner/listings')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER)
  ownerPerformance(@CurrentUser() user: CurrentUser) {
    return this.analytics.ownerListingPerformance(user.id);
  }
}
