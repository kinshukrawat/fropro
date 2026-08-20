import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SavedListingsController } from './saved-listings.controller';
import { SavedListingsService } from './saved-listings.service';

@Module({
  imports: [PrismaModule],
  controllers: [SavedListingsController],
  providers: [SavedListingsService],
  exports: [SavedListingsService],
})
export class SavedListingsModule {}