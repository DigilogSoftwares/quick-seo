-- CreateTable
CREATE TABLE "AuthIntegration" (
    "id" UUID NOT NULL,
    "shopName" TEXT NOT NULL,
    "shopDomain" TEXT NOT NULL,
    "googleConfig" JSONB NOT NULL,
    "bingIndexingUrl" TEXT NOT NULL,
    "settings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuthIntegration_shopName_idx" ON "AuthIntegration"("shopName");

-- CreateIndex
CREATE INDEX "AuthIntegration_shopDomain_idx" ON "AuthIntegration"("shopDomain");
