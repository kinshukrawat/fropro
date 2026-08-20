import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SavedListingsService } from './saved-listings.service';

@Controller('saved-listings')
@UseGuards(AuthGuard('jwt'))
export class SavedListingsController {
  constructor(
    private readonly savedListingsService: SavedListingsService,
  ) {}

  // Save Listing
  @Post(':listingId')
  saveListing(
    @CurrentUser() user: CurrentUser,
    @Param('listingId') listingId: string,
  ) {
    return this.savedListingsService.saveListing(
      user.id,
      listingId,
    );
  }

  // Remove Saved Listing
  @Delete(':listingId')
  removeSavedListing(
    @CurrentUser() user: CurrentUser,
    @Param('listingId') listingId: string,
  ) {
    return this.savedListingsService.removeSavedListing(
      user.id,
      listingId,
    );
  }

  // Get All Saved Listings
  @Get()
  getSavedListings(@CurrentUser() user: CurrentUser) {
    return this.savedListingsService.getSavedListings(user.id);
  }

  // Check if Listing is Saved
  @Get('check/:listingId')
  checkSaved(
    @CurrentUser() user: CurrentUser,
    @Param('listingId') listingId: string,
  ) {
    return this.savedListingsService.isListingSaved(
      user.id,
      listingId,
    );
  }
}