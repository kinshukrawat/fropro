import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateListingDto } from './dto/create-listing.dto';
import { SearchListingsDto } from './dto/search-listings.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ListingsService } from './listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listings: ListingsService) {}

  @Get('debug/all')
debugAll() {
  return this.listings.findPublicListings();
}

  @Get()
  searchPublic(@Query() query: SearchListingsDto) {
    return this.listings.searchPublic(query);
  }
  

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER)
  create(@CurrentUser() user: CurrentUser, @Body() dto: CreateListingDto) {
    return this.listings.createOwnerListing(user.id, dto);
  }

  @Get('owner/mine')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER)
  findMine(@CurrentUser() user: CurrentUser) {
    return this.listings.findOwnerListings(user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER)
  update(
    @CurrentUser() user: CurrentUser,
    @Param('id') id: string,
    @Body() dto: UpdateListingDto,
  ) {
    return this.listings.updateOwnerListing(user.id, id, dto);
  }

  @Post(':id/submit')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER)
  submit(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.listings.submitOwnerListing(user.id, id);
  }

  @Get(':slug')
  findPublicBySlug(@Param('slug') slug: string) {
    return this.listings.findPublicBySlug(slug);
  }
}
