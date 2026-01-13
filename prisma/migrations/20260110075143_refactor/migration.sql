/*
  Warnings:

  - You are about to drop the column `bingIndexingUrl` on the `Auth` table. All the data in the column will be lost.
  - The primary key for the `UrlEntry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `processedAt` on the `UrlEntry` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `UrlEntry` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `UrlEntry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shop,baseId]` on the table `UrlEntry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bingApiKey` to the `Auth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseId` to the `UrlEntry` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `UrlEntry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `lastIndexedAt` on table `UrlEntry` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "UrlEntry_shop_productId_key";

-- DropIndex
DROP INDEX "UrlEntry_slug_key";

-- AlterTable
ALTER TABLE "Auth" DROP COLUMN "bingIndexingUrl",
ADD COLUMN     "bingApiKey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UrlEntry" DROP CONSTRAINT "UrlEntry_pkey",
DROP COLUMN "processedAt",
DROP COLUMN "productId",
DROP COLUMN "slug",
ADD COLUMN     "baseId" BIGINT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "attempts" SET DEFAULT 2,
ALTER COLUMN "lastIndexedAt" SET NOT NULL,
ALTER COLUMN "lastIndexedAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "UrlEntry_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "UrlEntry_lastIndexedAt_attempts_idx" ON "UrlEntry"("lastIndexedAt" ASC, "attempts" ASC);

-- CreateIndex
CREATE INDEX "UrlEntry_shop_status_lastIndexedAt_attempts_idx" ON "UrlEntry"("shop", "status", "lastIndexedAt" ASC, "attempts" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UrlEntry_shop_baseId_key" ON "UrlEntry"("shop", "baseId");
