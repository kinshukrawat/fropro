import { Injectable } from '@nestjs/common';
import { EnquiryStatus, ListingStatus, Prisma, SubscriptionStatus } from '@prisma/client';
import { AnalyticsService } from '../analytics/analytics.service';
import { EnquiriesService } from '../enquiries/enquiries.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analytics: AnalyticsService,
    private readonly enquiries: EnquiriesService,
  ) {}

  findListings(q?: string) {
    return this.prisma.businessListing.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { owner: { email: { contains: q, mode: 'insensitive' } } },
              { category: { name: { contains: q, mode: 'insensitive' } } },
            ],
          }
        : undefined,
      include: {
        owner: { select: { id: true, name: true, email: true, phone: true } },
        category: true,
        city: true,
        subscriptions: { include: { plan: true }, orderBy: { createdAt: 'desc' } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  approveListing(adminId: string, id: string) {
    return this.prisma.$transaction([
      this.prisma.businessListing.update({
        where: { id },
        data: {
          status: ListingStatus.APPROVED,
          approvedAt: new Date(),
          rejectionReason: null,
        },
      }),
      this.audit(adminId, 'listing.approved', 'BusinessListing', id),
    ]);
  }

  rejectListing(adminId: string, id: string, reason: string) {
    return this.prisma.$transaction([
      this.prisma.businessListing.update({
        where: { id },
        data: {
          status: ListingStatus.REJECTED,
          rejectionReason: reason,
        },
      }),
      this.audit(adminId, 'listing.rejected', 'BusinessListing', id, { reason }),
    ]);
  }

  toggleFeatured(adminId: string, id: string, isFeatured: boolean) {
    return this.prisma.$transaction([
      this.prisma.businessListing.update({
        where: { id },
        data: { isFeatured },
      }),
      this.audit(adminId, 'listing.featured_updated', 'BusinessListing', id, {
        isFeatured,
      }),
    ]);
  }

  suspendListing(adminId: string, id: string) {
    return this.prisma.$transaction([
      this.prisma.businessListing.update({
        where: { id },
        data: { status: ListingStatus.SUSPENDED },
      }),
      this.audit(adminId, 'listing.suspended', 'BusinessListing', id),
    ]);
  }

  findUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  setUserActive(adminId: string, id: string, isActive: boolean) {
    return this.prisma.$transaction([
      this.prisma.user.update({ where: { id }, data: { isActive } }),
      this.audit(adminId, 'user.active_updated', 'User', id, { isActive }),
    ]);
  }

  findPayments() {
    return this.prisma.payment.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        listing: true,
        subscription: { include: { plan: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findSubscriptions() {
    return this.prisma.subscription.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        listing: true,
        plan: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  updateSubscription(
    adminId: string,
    id: string,
    status: SubscriptionStatus,
    expiresAt?: string,
  ) {
    return this.prisma.$transaction([
      this.prisma.subscription.update({
        where: { id },
        data: {
          status,
          startsAt: status === SubscriptionStatus.ACTIVE ? new Date() : undefined,
          expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        },
      }),
      this.audit(adminId, 'subscription.updated', 'Subscription', id, {
        status,
        expiresAt,
      }),
    ]);
  }

  

  stats() {
    return this.analytics.platformStats();
  }

  findEnquiries(status?: EnquiryStatus) {
    return this.enquiries.findAll(status);
  }

  updateEnquiryStatus(id: string, status: EnquiryStatus) {
    return this.enquiries.updateStatus(id, status);
  }

  private audit(
    actorUserId: string,
    action: string,
    entityType: string,
    entityId: string,
    metadata?: Prisma.InputJsonValue,
  ) {
    return this.prisma.auditLog.create({
      data: { actorUserId, action, entityType, entityId, metadata },
    });
  }
}
