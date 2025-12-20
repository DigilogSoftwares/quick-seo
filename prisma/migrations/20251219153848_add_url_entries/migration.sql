-- CreateEnum
CREATE TYPE "UrlStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "UrlEntry" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "slug" TEXT,
    "status" "UrlStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastTriedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "UrlEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UrlEntry_slug_key" ON "UrlEntry"("slug");

-- CreateIndex
CREATE INDEX "UrlEntry_shop_idx" ON "UrlEntry"("shop");

-- CreateIndex
CREATE INDEX "UrlEntry_status_idx" ON "UrlEntry"("status");
