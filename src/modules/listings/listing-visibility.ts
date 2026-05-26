import { ListingStatus, SubscriptionStatus } from '@prisma/client';

type VisibilityInput = {
  status: ListingStatus;
  isDeleted: boolean;
  subscriptions?: Array<{
    status: SubscriptionStatus;
    expiresAt: Date | null;
  }>;
};

export function isListingPublic(
  listing: VisibilityInput,
  now: Date = new Date(),
): boolean {
  if (listing.status !== ListingStatus.APPROVED || listing.isDeleted) {
    return false;
  }

  return Boolean(
    listing.subscriptions?.some(
      (subscription) =>
        subscription.status === SubscriptionStatus.ACTIVE &&
        subscription.expiresAt !== null &&
        subscription.expiresAt > now,
    ),
  );
}
