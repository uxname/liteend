-- CreateTable
CREATE TABLE "StatisticItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "hardwareId" TEXT NOT NULL,
    "walletAddress" TEXT,
    "ipAddress" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "StatisticItem_hardwareId_key" ON "StatisticItem"("hardwareId");
