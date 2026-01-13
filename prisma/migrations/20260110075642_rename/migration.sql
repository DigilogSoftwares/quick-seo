/*
  Warnings:

  - You are about to drop the column `originalUrl` on the `UrlEntry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shop,webUrl]` on the table `UrlEntry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `webUrl` to the `UrlEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UrlEntry_shop_originalUrl_key";

-- AlterTable
ALTER TABLE "UrlEntry" DROP COLUMN "originalUrl",
ADD COLUMN     "webUrl" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UrlEntry_shop_webUrl_key" ON "UrlEntry"("shop", "webUrl");
