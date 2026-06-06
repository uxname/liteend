-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "displayName" TEXT;

-- CreateIndex
CREATE INDEX "Upload_uploaderIp_idx" ON "Upload"("uploaderIp");

-- CreateIndex
CREATE INDEX "Upload_createdAt_idx" ON "Upload"("createdAt");
