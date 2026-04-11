-- AlterTable
ALTER TABLE "PortalUser" ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "passwordResetToken" TEXT,
ADD COLUMN     "passwordResetExpires" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "PortalUser_passwordResetToken_key" ON "PortalUser"("passwordResetToken");
