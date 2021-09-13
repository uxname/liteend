-- CreateTable
CREATE TABLE "AccountSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "accountId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "ipAddr" TEXT NOT NULL,
    "userAgent" TEXT,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "AccountSession_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountSession_token_key" ON "AccountSession"("token");

-- RedefineIndex
DROP INDEX "Account.email_unique";
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- RedefineIndex
DROP INDEX "EmailCode.email_unique";
CREATE UNIQUE INDEX "EmailCode_email_key" ON "EmailCode"("email");

-- RedefineIndex
DROP INDEX "Upload.filename_unique";
CREATE UNIQUE INDEX "Upload_filename_key" ON "Upload"("filename");
