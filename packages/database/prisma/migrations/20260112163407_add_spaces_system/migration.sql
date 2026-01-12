/*
  Warnings:

  - You are about to drop the column `usedAt` on the `PasswordResetToken` table. All the data in the column will be lost.
  - You are about to drop the `TenantInvite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TenantInvite" DROP CONSTRAINT "TenantInvite_invitedById_fkey";

-- DropForeignKey
ALTER TABLE "TenantInvite" DROP CONSTRAINT "TenantInvite_tenantId_fkey";

-- AlterTable
ALTER TABLE "PasswordResetToken" DROP COLUMN "usedAt";

-- DropTable
DROP TABLE "TenantInvite";

-- CreateTable
CREATE TABLE "tenant_invites" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "tenant_id" TEXT,
    "invited_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spaces" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT NOT NULL DEFAULT 'Folder',
    "color" TEXT NOT NULL DEFAULT '#6B7280',
    "default_permissions" TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_spaces" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,
    "custom_permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invite_spaces" (
    "id" TEXT NOT NULL,
    "invite_id" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invite_spaces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenant_invites_token_key" ON "tenant_invites"("token");

-- CreateIndex
CREATE INDEX "tenant_invites_email_idx" ON "tenant_invites"("email");

-- CreateIndex
CREATE INDEX "tenant_invites_token_idx" ON "tenant_invites"("token");

-- CreateIndex
CREATE INDEX "tenant_invites_tenant_id_idx" ON "tenant_invites"("tenant_id");

-- CreateIndex
CREATE INDEX "spaces_tenant_id_idx" ON "spaces"("tenant_id");

-- CreateIndex
CREATE INDEX "spaces_is_active_idx" ON "spaces"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "spaces_tenant_id_code_key" ON "spaces"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "user_spaces_user_id_idx" ON "user_spaces"("user_id");

-- CreateIndex
CREATE INDEX "user_spaces_space_id_idx" ON "user_spaces"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_spaces_user_id_space_id_key" ON "user_spaces"("user_id", "space_id");

-- CreateIndex
CREATE INDEX "invite_spaces_invite_id_idx" ON "invite_spaces"("invite_id");

-- CreateIndex
CREATE INDEX "invite_spaces_space_id_idx" ON "invite_spaces"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "invite_spaces_invite_id_space_id_key" ON "invite_spaces"("invite_id", "space_id");

-- AddForeignKey
ALTER TABLE "tenant_invites" ADD CONSTRAINT "tenant_invites_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_invites" ADD CONSTRAINT "tenant_invites_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spaces" ADD CONSTRAINT "spaces_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_spaces" ADD CONSTRAINT "user_spaces_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_spaces" ADD CONSTRAINT "user_spaces_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite_spaces" ADD CONSTRAINT "invite_spaces_invite_id_fkey" FOREIGN KEY ("invite_id") REFERENCES "tenant_invites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite_spaces" ADD CONSTRAINT "invite_spaces_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
