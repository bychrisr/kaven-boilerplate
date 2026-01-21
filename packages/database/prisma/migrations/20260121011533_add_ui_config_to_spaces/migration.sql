/*
  Warnings:

  - You are about to drop the column `headers` on the `email_queue` table. All the data in the column will be lost.
  - You are about to drop the `password_reset_tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CapabilitySensitivity" AS ENUM ('NORMAL', 'SENSITIVE', 'HIGHLY_SENSITIVE', 'CRITICAL');

-- CreateEnum
CREATE TYPE "CapabilityScope" AS ENUM ('GLOBAL', 'TENANT', 'SPACE', 'SELF', 'ASSIGNED');

-- CreateEnum
CREATE TYPE "GrantType" AS ENUM ('ADD', 'DENY');

-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('READ_ONLY', 'READ_WRITE');

-- CreateEnum
CREATE TYPE "GrantStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "GrantRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "GrantApprovalLevel" AS ENUM ('NORMAL', 'SENSITIVE', 'CRITICAL');

-- CreateEnum
CREATE TYPE "PolicyType" AS ENUM ('MFA_REQUIRED', 'IP_RESTRICTION', 'TIME_RESTRICTION', 'DEVICE_RESTRICTION', 'APPROVAL_REQUIRED', 'RATE_LIMIT', 'JUSTIFICATION_REQUIRED');

-- CreateEnum
CREATE TYPE "PolicyTargetType" AS ENUM ('SPACE', 'ROLE', 'CAPABILITY', 'USER');

-- CreateEnum
CREATE TYPE "PolicyEnforcement" AS ENUM ('DENY', 'WARN', 'REQUIRE_MFA');

-- CreateEnum
CREATE TYPE "ImpersonationStatus" AS ENUM ('ACTIVE', 'ENDED', 'EXPIRED');

-- DropForeignKey
ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "password_reset_tokens_userId_fkey";

-- DropForeignKey
ALTER TABLE "verification_tokens" DROP CONSTRAINT "verification_tokens_userId_fkey";

-- DropIndex
DROP INDEX "email_integrations_is_primary_key";

-- AlterTable
ALTER TABLE "email_integrations" ADD COLUMN     "test_email" TEXT;

-- AlterTable
ALTER TABLE "email_queue" DROP COLUMN "headers";

-- DropTable
DROP TABLE "password_reset_tokens";

-- DropTable
DROP TABLE "verification_tokens";

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capabilities" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "sensitivity" "CapabilitySensitivity" NOT NULL DEFAULT 'NORMAL',
    "scope" "CapabilityScope" NOT NULL DEFAULT 'SPACE',
    "requiresMFA" BOOLEAN NOT NULL DEFAULT false,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "space_roles" (
    "id" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "hierarchy" INTEGER NOT NULL DEFAULT 0,
    "canApproveGrants" BOOLEAN NOT NULL DEFAULT false,
    "canApproveLevel" "GrantApprovalLevel",
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "space_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_capabilities" (
    "id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "capability_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_capabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_space_roles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_space_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grants" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "space_id" TEXT,
    "capability_id" TEXT,
    "type" "GrantType" NOT NULL DEFAULT 'ADD',
    "accessLevel" "AccessLevel" NOT NULL DEFAULT 'READ_ONLY',
    "scope" "CapabilityScope" NOT NULL DEFAULT 'SPACE',
    "justification" TEXT NOT NULL,
    "granted_by" TEXT NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "status" "GrantStatus" NOT NULL DEFAULT 'ACTIVE',
    "revoked_at" TIMESTAMP(3),
    "revoked_by" TEXT,
    "revoke_reason" TEXT,
    "grant_request_id" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grant_requests" (
    "id" TEXT NOT NULL,
    "requester_id" TEXT NOT NULL,
    "space_id" TEXT,
    "capability_id" TEXT,
    "accessLevel" "AccessLevel" NOT NULL DEFAULT 'READ_ONLY',
    "scope" "CapabilityScope" NOT NULL DEFAULT 'SPACE',
    "justification" TEXT NOT NULL,
    "requestedDuration" INTEGER NOT NULL DEFAULT 7,
    "status" "GrantRequestStatus" NOT NULL DEFAULT 'PENDING',
    "approved_by" TEXT,
    "approved_at" TIMESTAMP(3),
    "rejected_by" TEXT,
    "rejected_at" TIMESTAMP(3),
    "rejection_reason" TEXT,
    "request_ip" TEXT,
    "request_device" TEXT,
    "request_user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grant_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "PolicyType" NOT NULL,
    "targetType" "PolicyTargetType" NOT NULL,
    "target_id" TEXT,
    "conditions" JSONB NOT NULL,
    "enforcement" "PolicyEnforcement" NOT NULL DEFAULT 'DENY',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy_ip_whitelist" (
    "id" TEXT NOT NULL,
    "policy_id" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "label" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "policy_ip_whitelist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy_device_tracking" (
    "id" TEXT NOT NULL,
    "policy_id" TEXT,
    "user_id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "device_name" TEXT,
    "device_type" TEXT,
    "first_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_trusted" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,

    CONSTRAINT "policy_device_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "space_owners" (
    "id" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "can_delegate" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "space_owners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capability_audit_events" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "capability_id" TEXT NOT NULL,
    "space_id" TEXT,
    "action" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "reason" TEXT,
    "grant_id" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "device_id" TEXT,
    "device_type" TEXT,
    "origin" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "capability_audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grant_audit_events" (
    "id" TEXT NOT NULL,
    "grant_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "performed_by" TEXT,
    "reason" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grant_audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "impersonation_sessions" (
    "id" TEXT NOT NULL,
    "impersonator_id" TEXT NOT NULL,
    "impersonated_id" TEXT NOT NULL,
    "justification" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3),
    "ip_address" TEXT,
    "user_agent" TEXT,
    "actions_log" JSONB,
    "blocked_actions" TEXT[],
    "status" "ImpersonationStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "impersonation_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_export_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "export_type" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "record_count" INTEGER NOT NULL,
    "columns" TEXT[],
    "filters" JSONB,
    "has_pii" BOOLEAN NOT NULL DEFAULT false,
    "watermark" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_export_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE INDEX "VerificationToken_token_idx" ON "VerificationToken"("token");

-- CreateIndex
CREATE INDEX "VerificationToken_userId_idx" ON "VerificationToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_token_idx" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "capabilities_code_key" ON "capabilities"("code");

-- CreateIndex
CREATE INDEX "capabilities_code_idx" ON "capabilities"("code");

-- CreateIndex
CREATE INDEX "capabilities_category_idx" ON "capabilities"("category");

-- CreateIndex
CREATE INDEX "capabilities_sensitivity_idx" ON "capabilities"("sensitivity");

-- CreateIndex
CREATE INDEX "capabilities_isActive_idx" ON "capabilities"("isActive");

-- CreateIndex
CREATE INDEX "space_roles_space_id_idx" ON "space_roles"("space_id");

-- CreateIndex
CREATE INDEX "space_roles_isActive_idx" ON "space_roles"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "space_roles_space_id_code_key" ON "space_roles"("space_id", "code");

-- CreateIndex
CREATE INDEX "role_capabilities_role_id_idx" ON "role_capabilities"("role_id");

-- CreateIndex
CREATE INDEX "role_capabilities_capability_id_idx" ON "role_capabilities"("capability_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_capabilities_role_id_capability_id_key" ON "role_capabilities"("role_id", "capability_id");

-- CreateIndex
CREATE INDEX "user_space_roles_user_id_idx" ON "user_space_roles"("user_id");

-- CreateIndex
CREATE INDEX "user_space_roles_space_id_idx" ON "user_space_roles"("space_id");

-- CreateIndex
CREATE INDEX "user_space_roles_role_id_idx" ON "user_space_roles"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_space_roles_user_id_space_id_role_id_key" ON "user_space_roles"("user_id", "space_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "grants_grant_request_id_key" ON "grants"("grant_request_id");

-- CreateIndex
CREATE INDEX "grants_user_id_idx" ON "grants"("user_id");

-- CreateIndex
CREATE INDEX "grants_space_id_idx" ON "grants"("space_id");

-- CreateIndex
CREATE INDEX "grants_capability_id_idx" ON "grants"("capability_id");

-- CreateIndex
CREATE INDEX "grants_status_idx" ON "grants"("status");

-- CreateIndex
CREATE INDEX "grants_expires_at_idx" ON "grants"("expires_at");

-- CreateIndex
CREATE INDEX "grants_granted_by_idx" ON "grants"("granted_by");

-- CreateIndex
CREATE INDEX "grant_requests_requester_id_idx" ON "grant_requests"("requester_id");

-- CreateIndex
CREATE INDEX "grant_requests_space_id_idx" ON "grant_requests"("space_id");

-- CreateIndex
CREATE INDEX "grant_requests_capability_id_idx" ON "grant_requests"("capability_id");

-- CreateIndex
CREATE INDEX "grant_requests_status_idx" ON "grant_requests"("status");

-- CreateIndex
CREATE INDEX "grant_requests_created_at_idx" ON "grant_requests"("created_at");

-- CreateIndex
CREATE INDEX "policies_type_idx" ON "policies"("type");

-- CreateIndex
CREATE INDEX "policies_targetType_idx" ON "policies"("targetType");

-- CreateIndex
CREATE INDEX "policies_target_id_idx" ON "policies"("target_id");

-- CreateIndex
CREATE INDEX "policies_isActive_idx" ON "policies"("isActive");

-- CreateIndex
CREATE INDEX "policy_ip_whitelist_policy_id_idx" ON "policy_ip_whitelist"("policy_id");

-- CreateIndex
CREATE INDEX "policy_ip_whitelist_ip_address_idx" ON "policy_ip_whitelist"("ip_address");

-- CreateIndex
CREATE INDEX "policy_ip_whitelist_isActive_idx" ON "policy_ip_whitelist"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "policy_device_tracking_device_id_key" ON "policy_device_tracking"("device_id");

-- CreateIndex
CREATE INDEX "policy_device_tracking_policy_id_idx" ON "policy_device_tracking"("policy_id");

-- CreateIndex
CREATE INDEX "policy_device_tracking_user_id_idx" ON "policy_device_tracking"("user_id");

-- CreateIndex
CREATE INDEX "policy_device_tracking_device_id_idx" ON "policy_device_tracking"("device_id");

-- CreateIndex
CREATE INDEX "policy_device_tracking_is_trusted_idx" ON "policy_device_tracking"("is_trusted");

-- CreateIndex
CREATE INDEX "space_owners_space_id_idx" ON "space_owners"("space_id");

-- CreateIndex
CREATE INDEX "space_owners_user_id_idx" ON "space_owners"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "space_owners_space_id_user_id_key" ON "space_owners"("space_id", "user_id");

-- CreateIndex
CREATE INDEX "capability_audit_events_user_id_idx" ON "capability_audit_events"("user_id");

-- CreateIndex
CREATE INDEX "capability_audit_events_capability_id_idx" ON "capability_audit_events"("capability_id");

-- CreateIndex
CREATE INDEX "capability_audit_events_space_id_idx" ON "capability_audit_events"("space_id");

-- CreateIndex
CREATE INDEX "capability_audit_events_created_at_idx" ON "capability_audit_events"("created_at");

-- CreateIndex
CREATE INDEX "capability_audit_events_ip_address_idx" ON "capability_audit_events"("ip_address");

-- CreateIndex
CREATE INDEX "capability_audit_events_device_id_idx" ON "capability_audit_events"("device_id");

-- CreateIndex
CREATE INDEX "capability_audit_events_action_idx" ON "capability_audit_events"("action");

-- CreateIndex
CREATE INDEX "capability_audit_events_result_idx" ON "capability_audit_events"("result");

-- CreateIndex
CREATE INDEX "grant_audit_events_grant_id_idx" ON "grant_audit_events"("grant_id");

-- CreateIndex
CREATE INDEX "grant_audit_events_performed_by_idx" ON "grant_audit_events"("performed_by");

-- CreateIndex
CREATE INDEX "grant_audit_events_action_idx" ON "grant_audit_events"("action");

-- CreateIndex
CREATE INDEX "grant_audit_events_created_at_idx" ON "grant_audit_events"("created_at");

-- CreateIndex
CREATE INDEX "impersonation_sessions_impersonator_id_idx" ON "impersonation_sessions"("impersonator_id");

-- CreateIndex
CREATE INDEX "impersonation_sessions_impersonated_id_idx" ON "impersonation_sessions"("impersonated_id");

-- CreateIndex
CREATE INDEX "impersonation_sessions_status_idx" ON "impersonation_sessions"("status");

-- CreateIndex
CREATE INDEX "impersonation_sessions_started_at_idx" ON "impersonation_sessions"("started_at");

-- CreateIndex
CREATE INDEX "impersonation_sessions_expires_at_idx" ON "impersonation_sessions"("expires_at");

-- CreateIndex
CREATE INDEX "data_export_logs_user_id_idx" ON "data_export_logs"("user_id");

-- CreateIndex
CREATE INDEX "data_export_logs_resource_idx" ON "data_export_logs"("resource");

-- CreateIndex
CREATE INDEX "data_export_logs_created_at_idx" ON "data_export_logs"("created_at");

-- CreateIndex
CREATE INDEX "data_export_logs_has_pii_idx" ON "data_export_logs"("has_pii");

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space_roles" ADD CONSTRAINT "space_roles_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_capabilities" ADD CONSTRAINT "role_capabilities_capability_id_fkey" FOREIGN KEY ("capability_id") REFERENCES "capabilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_capabilities" ADD CONSTRAINT "role_capabilities_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "space_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_space_roles" ADD CONSTRAINT "user_space_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "space_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_space_roles" ADD CONSTRAINT "user_space_roles_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_space_roles" ADD CONSTRAINT "user_space_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grants" ADD CONSTRAINT "grants_capability_id_fkey" FOREIGN KEY ("capability_id") REFERENCES "capabilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grants" ADD CONSTRAINT "grants_grant_request_id_fkey" FOREIGN KEY ("grant_request_id") REFERENCES "grant_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grants" ADD CONSTRAINT "grants_granted_by_fkey" FOREIGN KEY ("granted_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grants" ADD CONSTRAINT "grants_revoked_by_fkey" FOREIGN KEY ("revoked_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grants" ADD CONSTRAINT "grants_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grants" ADD CONSTRAINT "grants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_requests" ADD CONSTRAINT "grant_requests_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_requests" ADD CONSTRAINT "grant_requests_capability_id_fkey" FOREIGN KEY ("capability_id") REFERENCES "capabilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_requests" ADD CONSTRAINT "grant_requests_rejected_by_fkey" FOREIGN KEY ("rejected_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_requests" ADD CONSTRAINT "grant_requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_requests" ADD CONSTRAINT "grant_requests_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policies" ADD CONSTRAINT "policies_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "capabilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_ip_whitelist" ADD CONSTRAINT "policy_ip_whitelist_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_device_tracking" ADD CONSTRAINT "policy_device_tracking_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_device_tracking" ADD CONSTRAINT "policy_device_tracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space_owners" ADD CONSTRAINT "space_owners_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space_owners" ADD CONSTRAINT "space_owners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capability_audit_events" ADD CONSTRAINT "capability_audit_events_capability_id_fkey" FOREIGN KEY ("capability_id") REFERENCES "capabilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capability_audit_events" ADD CONSTRAINT "capability_audit_events_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capability_audit_events" ADD CONSTRAINT "capability_audit_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_audit_events" ADD CONSTRAINT "grant_audit_events_grant_id_fkey" FOREIGN KEY ("grant_id") REFERENCES "grants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_audit_events" ADD CONSTRAINT "grant_audit_events_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impersonation_sessions" ADD CONSTRAINT "impersonation_sessions_impersonated_id_fkey" FOREIGN KEY ("impersonated_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impersonation_sessions" ADD CONSTRAINT "impersonation_sessions_impersonator_id_fkey" FOREIGN KEY ("impersonator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_export_logs" ADD CONSTRAINT "data_export_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
