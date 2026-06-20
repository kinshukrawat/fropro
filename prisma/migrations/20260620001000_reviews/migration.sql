CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "name" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Review_listingId_createdAt_idx" ON "Review"("listingId", "createdAt");
CREATE INDEX "Review_isApproved_idx" ON "Review"("isApproved");

ALTER TABLE "Review" ADD CONSTRAINT "Review_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "BusinessListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
