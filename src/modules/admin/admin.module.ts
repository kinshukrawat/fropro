import { Module } from '@nestjs/common';
import { AnalyticsModule } from '../analytics/analytics.module';
import { EnquiriesModule } from '../enquiries/enquiries.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [AnalyticsModule, EnquiriesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
