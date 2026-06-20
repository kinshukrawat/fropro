-- Add listing contact, timing, verification, and catalogue support
ALTER TABLE "BusinessListing" ADD COLUMN "email" TEXT;
ALTER TABLE "BusinessListing" ADD COLUMN "website" TEXT;
ALTER TABLE "BusinessListing" ADD COLUMN "instagramUrl" TEXT;
ALTER TABLE "BusinessListing" ADD COLUMN "opensAt" TEXT;
ALTER TABLE "BusinessListing" ADD COLUMN "closesAt" TEXT;
ALTER TABLE "BusinessListing" ADD COLUMN "isVerified" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "ListingCatalogueItem" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "buttonLabel" TEXT DEFAULT 'Ask for Price',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingCatalogueItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ListingCatalogueItem_listingId_sortOrder_idx" ON "ListingCatalogueItem"("listingId", "sortOrder");

ALTER TABLE "ListingCatalogueItem" ADD CONSTRAINT "ListingCatalogueItem_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "BusinessListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
