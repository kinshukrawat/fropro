import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploads.uploadImage(file);
  }

  @Post('listing-images')
  addListingImage(@CurrentUser() user: CurrentUser, @Body() dto: AddListingImageDto) {
    return this.uploads.addListingImage(user.id, dto);
  }

  @Delete('listing-images/:id')
  removeListingImage(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.uploads.removeListingImage(user.id, id);
  }
}
