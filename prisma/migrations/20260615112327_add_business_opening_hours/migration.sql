-- AlterTable
ALTER TABLE "BusinessListing" ADD COLUMN     "closesAt" TEXT,
ADD COLUMN     "opensAt" TEXT;

-- AlterTable
ALTER TABLE "Enquiry" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
