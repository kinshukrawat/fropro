import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminService } from './admin.service';
import { RejectListingDto } from './dto/reject-listing.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('contact')


  @Get('stats')
  stats() {
    return this.admin.stats();
  }

  @Get('listings')
  listings(@Query('q') q?: string) {
    return this.admin.findListings(q);
  }

  @Post('listings/:id/approve')
  approveListing(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.admin.approveListing(user.id, id);
  }

  @Post('listings/:id/reject')
  rejectListing(
    @CurrentUser() user: CurrentUser,
    @Param('id') id: string,
    @Body() dto: RejectListingDto,
  ) {
    return this.admin.rejectListing(user.id, id, dto.reason);
  }

  @Post('listings/:id/suspend')
  suspendListing(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.admin.suspendListing(user.id, id);
  }

  @Patch('listings/:id/featured')
  toggleFeatured(
    @CurrentUser() user: CurrentUser,
    @Param('id') id: string,
    @Body('isFeatured') isFeatured: boolean,
  ) {
    return this.admin.toggleFeatured(user.id, id, isFeatured);
  }

  @Get('users')
  users() {
    return this.admin.findUsers();
  }

  @Patch('users/:id/active')
  setUserActive(
    @CurrentUser() user: CurrentUser,
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.admin.setUserActive(user.id, id, isActive);
  }

  @Get('payments')
  payments() {
    return this.admin.findPayments();
  }

  @Get('subscriptions')
  subscriptions() {
    return this.admin.findSubscriptions();
  }

  @Get('contact')
getEnquiries() {
  return this.admin.findEnquiries();
}

  @Patch('subscriptions/:id')
  updateSubscription(
    @CurrentUser() user: CurrentUser,
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionDto,
  ) {
    return this.admin.updateSubscription(user.id, id, dto.status, dto.expiresAt);
  }
}
