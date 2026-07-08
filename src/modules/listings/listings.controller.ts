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

import { CurrentUser } from '../../common/decorators/current-user.decorator';

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

  // ==========================
  // TEMP DEBUG
  // ==========================
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @CurrentUser() user: CurrentUser,
    @Body() dto: CreateListingDto,
  ) {
    console.log('USER =>', user);

    return this.listings.createOwnerListing(user.id, dto);
  }

  @Get('owner/mine')
  @UseGuards(AuthGuard('jwt'))
  findMine(@CurrentUser() user: CurrentUser) {
    return this.listings.findOwnerListings(user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @CurrentUser() user: CurrentUser,
    @Param('id') id: string,
    @Body() dto: UpdateListingDto,
  ) {
    return this.listings.updateOwnerListing(user.id, id, dto);
  }

  @Post(':id/submit')
  @UseGuards(AuthGuard('jwt'))
  submit(
    @CurrentUser() user: CurrentUser,
    @Param('id') id: string,
  ) {
    return this.listings.submitOwnerListing(user.id, id);
  }

  @Get(':slug')
  findPublicBySlug(@Param('slug') slug: string) {
    return this.listings.findPublicBySlug(slug);
  }
}

