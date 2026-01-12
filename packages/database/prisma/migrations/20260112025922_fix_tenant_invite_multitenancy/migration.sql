-- DropForeignKey
ALTER TABLE "TenantInvite" DROP CONSTRAINT "TenantInvite_tenantId_fkey";

-- AlterTable
ALTER TABLE "TenantInvite" ALTER COLUMN "tenantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TenantInvite" ADD CONSTRAINT "TenantInvite_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
