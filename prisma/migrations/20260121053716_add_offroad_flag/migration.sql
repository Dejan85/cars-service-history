-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "isOffroad" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Service_isOffroad_idx" ON "Service"("isOffroad");
