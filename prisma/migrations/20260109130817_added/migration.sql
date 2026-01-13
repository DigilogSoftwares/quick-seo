/*
  Warnings:

  - A unique constraint covering the columns `[shop]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Auth_shop_key" ON "Auth"("shop");
