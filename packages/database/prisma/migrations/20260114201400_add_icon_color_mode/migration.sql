-- AlterEnum
ALTER TYPE "IconType" ADD VALUE IF NOT EXISTS 'SVG';

-- CreateEnum
CREATE TYPE "IconColorMode" AS ENUM ('MONOCHROME', 'COLORED');

-- AlterTable
ALTER TABLE "currencies" ADD COLUMN "icon_color_mode" "IconColorMode" NOT NULL DEFAULT 'MONOCHROME';
