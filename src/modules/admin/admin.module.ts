import { Module } from '@nestjs/common';

import { EnquiriesModule } from '../enquiries/enquiries.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [PrismaModule, AnalyticsModule, EnquiriesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
