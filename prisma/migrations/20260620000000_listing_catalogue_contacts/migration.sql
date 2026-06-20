-- Add listing contact, timing, verification, and catalogue support.
-- Idempotent because some production DBs already received part of this schema manually or from an earlier deploy.
ALTER TABLE "BusinessListing" ADD COLUMN IF NOT EXISTS "email" TEXT;
ALTER TABLE "BusinessListing" ADD COLUMN IF NOT EXISTS "website" TEXT;
ALTER TABLE "BusinessListing" ADD COLUMN IF NOT EXISTS "instagramUrl" TEXT;
ALTER TABLE "BusinessListing" ADD COLUMN IF NOT EXISTS "opensAt" TEXT;
ALTER TABLE "BusinessListing" ADD COLUMN IF NOT EXISTS "closesAt" TEXT;
ALTER TABLE "BusinessListing" ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS "ListingCatalogueItem" (
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

CREATE INDEX IF NOT EXISTS "ListingCatalogueItem_listingId_sortOrder_idx" ON "ListingCatalogueItem"("listingId", "sortOrder");

DO $$ BEGIN
  ALTER TABLE "ListingCatalogueItem"
    ADD CONSTRAINT "ListingCatalogueItem_listingId_fkey"
    FOREIGN KEY ("listingId") REFERENCES "BusinessListing"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
