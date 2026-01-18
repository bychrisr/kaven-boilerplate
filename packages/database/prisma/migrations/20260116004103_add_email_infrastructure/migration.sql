/*
  Warnings:

  - A unique constraint covering the columns `[unsubscribe_token]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "IconColorMode" AS ENUM ('MONOCHROME', 'COLORED');

-- CreateEnum
CREATE TYPE "EmailProvider" AS ENUM ('POSTMARK', 'RESEND', 'AWS_SES', 'SMTP');

-- CreateEnum
CREATE TYPE "EmailType" AS ENUM ('TRANSACTIONAL', 'MARKETING');

-- CreateEnum
CREATE TYPE "EmailEventType" AS ENUM ('SENT', 'DELIVERED', 'BOUNCE', 'COMPLAINT', 'OPEN', 'CLICK', 'UNSUBSCRIBE');

-- CreateEnum
CREATE TYPE "BounceType" AS ENUM ('HARD', 'SOFT', 'TRANSIENT');

-- CreateEnum
CREATE TYPE "TemplateStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EmailQueueStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'RETRY');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email_bounce_type" "BounceType",
ADD COLUMN     "email_bounced" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email_bounced_at" TIMESTAMP(3),
ADD COLUMN     "email_complaint_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "email_opt_out" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email_opt_out_date" TIMESTAMP(3),
ADD COLUMN     "unsubscribe_token" TEXT;

-- AlterTable
ALTER TABLE "currencies" ADD COLUMN     "iconColorMode" "IconColorMode" NOT NULL DEFAULT 'MONOCHROME';

-- CreateTable
CREATE TABLE "email_integrations" (
    "id" TEXT NOT NULL,
    "provider" "EmailProvider" NOT NULL DEFAULT 'SMTP',
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "api_key" TEXT,
    "api_secret" TEXT,
    "webhook_secret" TEXT,
    "smtp_host" TEXT,
    "smtp_port" INTEGER DEFAULT 587,
    "smtp_secure" BOOLEAN DEFAULT false,
    "smtp_user" TEXT,
    "smtp_password" TEXT,
    "transactional_domain" TEXT,
    "marketing_domain" TEXT,
    "from_name" TEXT DEFAULT 'Kaven Platform',
    "from_email" TEXT,
    "transactional_stream" TEXT DEFAULT 'outbound',
    "marketing_stream" TEXT DEFAULT 'broadcasts',
    "track_opens" BOOLEAN NOT NULL DEFAULT true,
    "track_clicks" BOOLEAN NOT NULL DEFAULT true,
    "enable_dkim" BOOLEAN NOT NULL DEFAULT true,
    "enable_bimi" BOOLEAN NOT NULL DEFAULT false,
    "daily_limit" INTEGER,
    "hourly_limit" INTEGER,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_events" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "tenant_id" TEXT,
    "email" TEXT NOT NULL,
    "event_type" "EmailEventType" NOT NULL,
    "email_type" "EmailType" NOT NULL DEFAULT 'TRANSACTIONAL',
    "message_id" TEXT NOT NULL,
    "template" TEXT,
    "bounce_type" "BounceType",
    "bounce_reason" TEXT,
    "complaint_feedback_type" TEXT,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "link_clicked" TEXT,
    "provider" "EmailProvider",
    "provider_event_id" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_templates" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "EmailType" NOT NULL DEFAULT 'TRANSACTIONAL',
    "status" "TemplateStatus" NOT NULL DEFAULT 'ACTIVE',
    "subject_pt" TEXT NOT NULL,
    "subject_en" TEXT,
    "html_content_pt" TEXT NOT NULL,
    "html_content_en" TEXT,
    "text_content_pt" TEXT,
    "text_content_en" TEXT,
    "variables" JSONB,
    "postmark_template_id" TEXT,
    "resend_template_id" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_queue" (
    "id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "cc" TEXT[],
    "bcc" TEXT[],
    "subject" TEXT NOT NULL,
    "html_body" TEXT,
    "text_body" TEXT,
    "template_code" TEXT,
    "template_data" JSONB,
    "email_type" "EmailType" NOT NULL DEFAULT 'TRANSACTIONAL',
    "provider" "EmailProvider",
    "from_email" TEXT,
    "from_name" TEXT,
    "reply_to" TEXT,
    "status" "EmailQueueStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 3,
    "last_error" TEXT,
    "message_id" TEXT,
    "user_id" TEXT,
    "tenant_id" TEXT,
    "idempotency_key" TEXT,
    "scheduled_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_metrics" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "hour" INTEGER,
    "tenant_id" TEXT,
    "email_type" "EmailType",
    "provider" "EmailProvider",
    "template_code" TEXT,
    "sent_count" INTEGER NOT NULL DEFAULT 0,
    "delivered_count" INTEGER NOT NULL DEFAULT 0,
    "bounce_count" INTEGER NOT NULL DEFAULT 0,
    "hard_bounce_count" INTEGER NOT NULL DEFAULT 0,
    "soft_bounce_count" INTEGER NOT NULL DEFAULT 0,
    "complaint_count" INTEGER NOT NULL DEFAULT 0,
    "open_count" INTEGER NOT NULL DEFAULT 0,
    "unique_open_count" INTEGER NOT NULL DEFAULT 0,
    "click_count" INTEGER NOT NULL DEFAULT 0,
    "unique_click_count" INTEGER NOT NULL DEFAULT 0,
    "unsubscribe_count" INTEGER NOT NULL DEFAULT 0,
    "delivery_rate" DECIMAL(5,2),
    "bounce_rate" DECIMAL(5,2),
    "open_rate" DECIMAL(5,2),
    "click_rate" DECIMAL(5,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email_integrations_provider_idx" ON "email_integrations"("provider");

-- CreateIndex
CREATE INDEX "email_integrations_is_active_idx" ON "email_integrations"("is_active");

-- CreateIndex
CREATE INDEX "email_integrations_is_primary_idx" ON "email_integrations"("is_primary");

-- CreateIndex
CREATE UNIQUE INDEX "email_integrations_is_primary_key" ON "email_integrations"("is_primary");

-- CreateIndex
CREATE INDEX "email_events_user_id_idx" ON "email_events"("user_id");

-- CreateIndex
CREATE INDEX "email_events_tenant_id_idx" ON "email_events"("tenant_id");

-- CreateIndex
CREATE INDEX "email_events_email_idx" ON "email_events"("email");

-- CreateIndex
CREATE INDEX "email_events_message_id_idx" ON "email_events"("message_id");

-- CreateIndex
CREATE INDEX "email_events_event_type_idx" ON "email_events"("event_type");

-- CreateIndex
CREATE INDEX "email_events_created_at_idx" ON "email_events"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "email_templates_code_key" ON "email_templates"("code");

-- CreateIndex
CREATE INDEX "email_templates_code_idx" ON "email_templates"("code");

-- CreateIndex
CREATE INDEX "email_templates_type_idx" ON "email_templates"("type");

-- CreateIndex
CREATE INDEX "email_templates_status_idx" ON "email_templates"("status");

-- CreateIndex
CREATE UNIQUE INDEX "email_queue_idempotency_key_key" ON "email_queue"("idempotency_key");

-- CreateIndex
CREATE INDEX "email_queue_status_idx" ON "email_queue"("status");

-- CreateIndex
CREATE INDEX "email_queue_scheduled_at_idx" ON "email_queue"("scheduled_at");

-- CreateIndex
CREATE INDEX "email_queue_user_id_idx" ON "email_queue"("user_id");

-- CreateIndex
CREATE INDEX "email_queue_tenant_id_idx" ON "email_queue"("tenant_id");

-- CreateIndex
CREATE INDEX "email_queue_idempotency_key_idx" ON "email_queue"("idempotency_key");

-- CreateIndex
CREATE INDEX "email_metrics_date_idx" ON "email_metrics"("date");

-- CreateIndex
CREATE INDEX "email_metrics_tenant_id_idx" ON "email_metrics"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "email_metrics_date_hour_tenant_id_email_type_provider_templ_key" ON "email_metrics"("date", "hour", "tenant_id", "email_type", "provider", "template_code");

-- CreateIndex
CREATE UNIQUE INDEX "User_unsubscribe_token_key" ON "User"("unsubscribe_token");

-- CreateIndex
CREATE INDEX "User_email_bounced_idx" ON "User"("email_bounced");

-- CreateIndex
CREATE INDEX "User_email_opt_out_idx" ON "User"("email_opt_out");

-- CreateIndex
CREATE INDEX "User_unsubscribe_token_idx" ON "User"("unsubscribe_token");

-- AddForeignKey
ALTER TABLE "email_events" ADD CONSTRAINT "email_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_events" ADD CONSTRAINT "email_events_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
