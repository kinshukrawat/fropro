-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "PriceRange" AS ENUM ('BUDGET', 'MID_RANGE', 'PREMIUM');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AlterTable
ALTER TABLE "BusinessListing" ADD COLUMN IF NOT EXISTS "priceRange" "PriceRange";
