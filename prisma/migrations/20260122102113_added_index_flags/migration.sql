-- AlterTable
ALTER TABLE "UrlEntry" ADD COLUMN     "isBingIndexed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isGoogleIndexed" BOOLEAN NOT NULL DEFAULT false;
