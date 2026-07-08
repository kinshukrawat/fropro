import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { PrismaModule } from './modules/prisma/prisma.module';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

import { CategoriesModule } from './modules/categories/categories.module';
import { CitiesModule } from './modules/cities/cities.module';


import { ListingsModule } from './modules/listings/listings.module';
import { SavedListingsModule } from './modules/saved-listings/saved-listings.module';

import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { PaymentsModule } from './modules/payments/payments.module';

import { ReviewsModule } from './modules/reviews/reviews.module';


import { UploadsModule } from './modules/uploads/uploads.module';
import { EnquiriesModule } from './modules/enquiries/enquiries.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AdminModule } from './modules/admin/admin.module';
import { ContactModule } from './modules/contact/contact.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
    }),

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
    SavedListingsModule,

    SubscriptionsModule,
    PaymentsModule,

    ReviewsModule,
    UploadsModule,
    EnquiriesModule,

    AnalyticsModule,
    AdminModule,
    ContactModule,
    MailModule,
  ],
})
export class AppModule {}

