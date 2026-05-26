import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AdminModule } from './modules/admin/admin.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CitiesModule } from './modules/cities/cities.module';
import { ListingsModule } from './modules/listings/listings.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 120,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    CitiesModule,
    ListingsModule,
    SubscriptionsModule,
    PaymentsModule,
    UploadsModule,
    AnalyticsModule,
    AdminModule,
  ],
})
export class AppModule {}
