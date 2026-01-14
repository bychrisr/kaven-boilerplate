-- AlterTable
ALTER TABLE "PlatformConfig" ADD COLUMN     "dateFormat" TEXT NOT NULL DEFAULT 'Y-m-d',
ADD COLUMN     "emailFrom" TEXT DEFAULT 'Kaven <noreply@kaven.com>',
ADD COLUMN     "smtpHost" TEXT DEFAULT 'localhost',
ADD COLUMN     "smtpPassword" TEXT,
ADD COLUMN     "smtpPort" INTEGER DEFAULT 1025,
ADD COLUMN     "smtpSecure" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "smtpUser" TEXT,
ADD COLUMN     "timeFormat" TEXT NOT NULL DEFAULT 'g:i A',
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC';
