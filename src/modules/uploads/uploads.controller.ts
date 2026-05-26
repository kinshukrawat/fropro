import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AddListingImageDto } from './dto/add-listing-image.dto';
import { UploadsService } from './uploads.service';

@Controller('uploads')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.BUSINESS_OWNER)
export class UploadsController {
  constructor(private readonly uploads: UploadsService) {}

  @Post('listing-images')
  addListingImage(@CurrentUser() user: CurrentUser, @Body() dto: AddListingImageDto) {
    return this.uploads.addListingImage(user.id, dto);
  }

  @Delete('listing-images/:id')
  removeListingImage(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.uploads.removeListingImage(user.id, id);
  }
}
