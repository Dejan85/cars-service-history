-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "isSmallService" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Service_isSmallService_idx" ON "Service"("isSmallService");
