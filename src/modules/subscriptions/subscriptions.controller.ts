import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptions: SubscriptionsService) {}

  @Get('plans')
  findPlans() {
    return this.subscriptions.findActivePlans();
  }

  @Get('mine')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER)
  findMine(@CurrentUser() user: CurrentUser) {
    return this.subscriptions.findOwnerSubscriptions(user.id);
  }
}
