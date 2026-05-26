import { Body, Controller, Get, Headers, Post, RawBodyRequest, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@prisma/client';
import * as crypto from 'crypto';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly payments: PaymentsService,
    private readonly config: ConfigService,
  ) {}

  @Post('orders')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER)
  createOrder(@CurrentUser() user: CurrentUser, @Body() dto: CreatePaymentOrderDto) {
    return this.payments.createOrder(user.id, dto);
  }

  @Post('verify')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER)
  verify(@Body() dto: VerifyPaymentDto) {
    return this.payments.verifyPayment(dto);
  }

  @Get('mine')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS_OWNER)
  findMine(@CurrentUser() user: CurrentUser) {
    return this.payments.findOwnerPayments(user.id);
  }

  @Post('razorpay/webhook')
  async webhook(
    @Req() request: RawBodyRequest<Request>,
    @Headers('x-razorpay-signature') signature?: string,
  ) {
    const secret = this.config.get<string>('RAZORPAY_WEBHOOK_SECRET') ?? '';
    const rawBody = request.rawBody?.toString() ?? JSON.stringify(request.body);
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

    if (signature !== expected) {
      return { received: false };
    }

    const event = request.body;
    if (event?.event === 'payment.captured') {
      const payment = event.payload?.payment?.entity;
      await this.payments.activatePayment(payment.order_id, payment.id);
    }

    return { received: true };
  }
}
