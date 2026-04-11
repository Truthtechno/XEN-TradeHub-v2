-- AlterTable
ALTER TABLE "PortalUser" ADD COLUMN     "mustChangePassword" BOOLEAN NOT NULL DEFAULT false;

-- Drop link-based columns from earlier setup (replaced by temporary password flow)
DROP INDEX IF EXISTS "PortalUser_passwordResetToken_key";

ALTER TABLE "PortalUser" DROP COLUMN IF EXISTS "passwordResetToken";
ALTER TABLE "PortalUser" DROP COLUMN IF EXISTS "passwordResetExpires";
