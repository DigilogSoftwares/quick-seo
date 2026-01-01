/*
  Warnings:

  - You are about to drop the `AuthIntegration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AuthIntegration";

-- CreateTable
CREATE TABLE "Auth" (
    "id" UUID NOT NULL,
    "shop" TEXT NOT NULL,
    "googleConfig" JSONB NOT NULL,
    "bingIndexingUrl" TEXT NOT NULL,
    "settings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Auth_shop_idx" ON "Auth"("shop");
