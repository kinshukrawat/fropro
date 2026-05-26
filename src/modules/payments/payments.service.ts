import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ListingStatus, PaymentStatus, SubscriptionStatus } from '@prisma/client';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly razorpay: Razorpay | null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const keyId = this.config.get<string>('RAZORPAY_KEY_ID');
    const keySecret = this.config.get<string>('RAZORPAY_KEY_SECRET');
    this.razorpay =
      keyId && keySecret ? new Razorpay({ key_id: keyId, key_secret: keySecret }) : null;
  }

  async createOrder(userId: string, dto: CreatePaymentOrderDto) {
    const listing = await this.prisma.businessListing.findUnique({
      where: { id: dto.listingId },
    });

    if (!listing || listing.isDeleted) {
      throw new NotFoundException('Listing not found.');
    }

    if (listing.ownerId !== userId) {
      throw new ForbiddenException('You cannot pay for this listing.');
    }

    if (listing.status !== ListingStatus.APPROVED) {
      throw new BadRequestException('Listing must be approved before payment.');
    }

    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: dto.planId },
    });

    if (!plan?.isActive || plan.pricePaise <= 0) {
      throw new BadRequestException('Selected plan is unavailable or unpriced.');
    }

    const receipt = `listing_${listing.id}_${Date.now()}`.slice(0, 40);
    const order = this.razorpay
      ? await this.razorpay.orders.create({
          amount: plan.pricePaise,
          currency: 'INR',
          receipt,
        })
      : { id: `dev_order_${Date.now()}` };

    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        listingId: listing.id,
        planId: plan.id,
        status: SubscriptionStatus.PENDING,
      },
    });

    const payment = await this.prisma.payment.create({
      data: {
        userId,
        listingId: listing.id,
        subscriptionId: subscription.id,
        razorpayOrderId: order.id,
        amountPaise: plan.pricePaise,
        status: PaymentStatus.PENDING,
      },
    });

    return { orderId: order.id, amountPaise: plan.pricePaise, currency: 'INR', payment };
  }

  async verifyPayment(dto: VerifyPaymentDto) {
    const expectedSignature = crypto
      .createHmac('sha256', this.config.get<string>('RAZORPAY_KEY_SECRET') ?? '')
      .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== dto.razorpaySignature) {
      throw new BadRequestException('Invalid payment signature.');
    }

    return this.activatePayment(
      dto.razorpayOrderId,
      dto.razorpayPaymentId,
      dto.razorpaySignature,
    );
  }

  async activatePayment(orderId: string, paymentId?: string, signature?: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { razorpayOrderId: orderId },
      include: { subscription: { include: { plan: true } } },
    });

    if (!payment?.subscription) {
      throw new NotFoundException('Payment not found.');
    }

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(
      expiresAt.getMonth() +
        (payment.subscription.plan.duration === 'SIX_MONTHS' ? 6 : 3),
    );

    return this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.SUCCESSFUL,
          razorpayPaymentId: paymentId,
          razorpaySignature: signature,
        },
      }),
      this.prisma.subscription.update({
        where: { id: payment.subscription.id },
        data: {
          status: SubscriptionStatus.ACTIVE,
          startsAt: now,
          expiresAt,
        },
      }),
    ]);
  }

  findOwnerPayments(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      include: { listing: true, subscription: { include: { plan: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
