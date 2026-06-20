import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Get('recent')
  findRecent(@Query('limit') limit?: string) {
    const parsedLimit = limit ? Number(limit) : 20;
    return this.reviews.findRecent(Number.isFinite(parsedLimit) ? parsedLimit : 20);
  }

  @Get('owner/mine')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER)
  findOwnerMine(@CurrentUser() user: CurrentUser) {
    return this.reviews.findOwnerReviews(user.id);
  }

  @Post()
  create(@Body() dto: CreateReviewDto) {
    return this.reviews.create(dto);
  }

  @Get('listing/:listingId')
  findByListing(@Param('listingId') listingId: string) {
    return this.reviews.findByListing(listingId);
  }

  @Get('listing/:listingId/summary')
  summary(@Param('listingId') listingId: string) {
    return this.reviews.summaryForListing(listingId);
  }
}
