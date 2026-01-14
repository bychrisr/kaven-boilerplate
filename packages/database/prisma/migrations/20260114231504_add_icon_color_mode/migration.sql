/*
  Warnings:

  - You are about to drop the column `icon_color_mode` on the `currencies` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_space_id_fkey";

-- DropIndex
DROP INDEX "projects_status_idx";

-- DropIndex
DROP INDEX "tasks_priority_idx";

-- DropIndex
DROP INDEX "tasks_status_idx";

-- AlterTable
ALTER TABLE "currencies" DROP COLUMN "icon_color_mode";

-- DropEnum
DROP TYPE "IconColorMode";

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
