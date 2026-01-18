-- Migration: Add Email Infrastructure Support
-- Created: 2026-01-15
-- Description: Adds comprehensive email infrastructure with multi-provider support,
--              bounce/complaint tracking, and email events logging

-- ============================================
-- EMAIL PROVIDER CONFIGURATION
-- ============================================

CREATE TYPE "EmailProvider" AS ENUM ('POSTMARK', 'RESEND', 'AWS_SES', 'SMTP');
CREATE TYPE "EmailType" AS ENUM ('TRANSACTIONAL', 'MARKETING');
CREATE TYPE "EmailEventType" AS ENUM ('SENT', 'DELIVERED', 'BOUNCE', 'COMPLAINT', 'OPEN', 'CLICK', 'UNSUBSCRIBE');
CREATE TYPE "BounceType" AS ENUM ('HARD', 'SOFT', 'TRANSIENT');

-- Email Integration Configuration (stored in Platform Settings)
CREATE TABLE "email_integrations" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  
  -- Provider Configuration
  "provider" "EmailProvider" NOT NULL DEFAULT 'SMTP',
  "is_active" BOOLEAN NOT NULL DEFAULT false,
  "is_primary" BOOLEAN NOT NULL DEFAULT false,
  
  -- Provider-specific credentials (encrypted)
  "api_key" TEXT, -- For Postmark/Resend/AWS SES
  "api_secret" TEXT, -- For AWS SES
  "webhook_secret" TEXT, -- For webhook validation
  
  -- SMTP Configuration (fallback)
  "smtp_host" TEXT,
  "smtp_port" INTEGER DEFAULT 587,
  "smtp_secure" BOOLEAN DEFAULT false,
  "smtp_user" TEXT,
  "smtp_password" TEXT,
  
  -- Domain Configuration
  "transactional_domain" TEXT, -- e.g., auth.kaven.site
  "marketing_domain" TEXT, -- e.g., mail.kaven.site
  "from_name" TEXT DEFAULT 'Kaven Platform',
  "from_email" TEXT, -- e.g., noreply@auth.kaven.site
  
  -- Message Streams (Postmark)
  "transactional_stream" TEXT DEFAULT 'outbound',
  "marketing_stream" TEXT DEFAULT 'broadcasts',
  
  -- Features
  "track_opens" BOOLEAN DEFAULT true,
  "track_clicks" BOOLEAN DEFAULT true,
  "enable_dkim" BOOLEAN DEFAULT true,
  "enable_bimi" BOOLEAN DEFAULT false,
  
  -- Rate Limiting
  "daily_limit" INTEGER, -- Max emails per day
  "hourly_limit" INTEGER, -- Max emails per hour
  
  -- Metadata
  "metadata" JSONB,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_email_integrations_provider" ON "email_integrations"("provider");
CREATE INDEX "idx_email_integrations_is_active" ON "email_integrations"("is_active");
CREATE INDEX "idx_email_integrations_is_primary" ON "email_integrations"("is_primary");

-- Ensure only one primary integration
CREATE UNIQUE INDEX "idx_email_integrations_primary_unique" 
  ON "email_integrations"("is_primary") 
  WHERE "is_primary" = true;

-- ============================================
-- EMAIL EVENTS TRACKING
-- ============================================

CREATE TABLE "email_events" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  
  -- User/Tenant Association
  "user_id" TEXT,
  "tenant_id" TEXT,
  "email" TEXT NOT NULL,
  
  -- Event Details
  "event_type" "EmailEventType" NOT NULL,
  "email_type" "EmailType" NOT NULL DEFAULT 'TRANSACTIONAL',
  "message_id" TEXT NOT NULL, -- Provider message ID
  "template" TEXT, -- Template name used
  
  -- Bounce/Complaint Details
  "bounce_type" "BounceType",
  "bounce_reason" TEXT,
  "complaint_feedback_type" TEXT,
  
  -- Tracking
  "user_agent" TEXT,
  "ip_address" TEXT,
  "link_clicked" TEXT, -- URL clicked (for CLICK events)
  
  -- Provider Info
  "provider" "EmailProvider",
  "provider_event_id" TEXT, -- Original event ID from provider
  
  -- Metadata
  "metadata" JSONB,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_email_events_user_id" ON "email_events"("user_id");
CREATE INDEX "idx_email_events_tenant_id" ON "email_events"("tenant_id");
CREATE INDEX "idx_email_events_email" ON "email_events"("email");
CREATE INDEX "idx_email_events_message_id" ON "email_events"("message_id");
CREATE INDEX "idx_email_events_event_type" ON "email_events"("event_type");
CREATE INDEX "idx_email_events_created_at" ON "email_events"("created_at");

-- Foreign keys
ALTER TABLE "email_events" 
  ADD CONSTRAINT "fk_email_events_user" 
  FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL;

ALTER TABLE "email_events" 
  ADD CONSTRAINT "fk_email_events_tenant" 
  FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE SET NULL;

-- ============================================
-- USER EMAIL STATUS
-- ============================================

-- Add email tracking fields to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "email_bounced" BOOLEAN DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "email_bounced_at" TIMESTAMP;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "email_bounce_type" "BounceType";
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "email_opt_out" BOOLEAN DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "email_opt_out_date" TIMESTAMP;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "email_complaint_count" INTEGER DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "unsubscribe_token" TEXT UNIQUE;

CREATE INDEX "idx_user_email_bounced" ON "User"("email_bounced");
CREATE INDEX "idx_user_email_opt_out" ON "User"("email_opt_out");
CREATE INDEX "idx_user_unsubscribe_token" ON "User"("unsubscribe_token");

-- ============================================
-- EMAIL TEMPLATES
-- ============================================

CREATE TYPE "TemplateStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

CREATE TABLE "email_templates" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  
  -- Template Info
  "code" TEXT NOT NULL UNIQUE, -- e.g., welcome, password-reset
  "name" TEXT NOT NULL,
  "description" TEXT,
  "type" "EmailType" NOT NULL DEFAULT 'TRANSACTIONAL',
  "status" "TemplateStatus" NOT NULL DEFAULT 'ACTIVE',
  
  -- Content (supports i18n)
  "subject_pt" TEXT NOT NULL,
  "subject_en" TEXT,
  "html_content_pt" TEXT NOT NULL,
  "html_content_en" TEXT,
  "text_content_pt" TEXT,
  "text_content_en" TEXT,
  
  -- Template Variables
  "variables" JSONB, -- Array of required variables
  
  -- Provider-specific IDs
  "postmark_template_id" TEXT,
  "resend_template_id" TEXT,
  
  -- Metadata
  "metadata" JSONB,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_email_templates_code" ON "email_templates"("code");
CREATE INDEX "idx_email_templates_type" ON "email_templates"("type");
CREATE INDEX "idx_email_templates_status" ON "email_templates"("status");

-- ============================================
-- EMAIL QUEUE (for async sending)
-- ============================================

CREATE TYPE "EmailQueueStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'RETRY');

CREATE TABLE "email_queue" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  
  -- Recipient
  "to" TEXT NOT NULL,
  "cc" TEXT[],
  "bcc" TEXT[],
  
  -- Content
  "subject" TEXT NOT NULL,
  "html_body" TEXT,
  "text_body" TEXT,
  "template_code" TEXT,
  "template_data" JSONB,
  
  -- Configuration
  "email_type" "EmailType" NOT NULL DEFAULT 'TRANSACTIONAL',
  "provider" "EmailProvider",
  "from_email" TEXT,
  "from_name" TEXT,
  "reply_to" TEXT,
  
  -- Status
  "status" "EmailQueueStatus" NOT NULL DEFAULT 'PENDING',
  "attempts" INTEGER DEFAULT 0,
  "max_attempts" INTEGER DEFAULT 3,
  "last_error" TEXT,
  
  -- Tracking
  "message_id" TEXT, -- Provider message ID after sending
  "user_id" TEXT,
  "tenant_id" TEXT,
  
  -- Idempotency
  "idempotency_key" TEXT UNIQUE,
  
  -- Scheduling
  "scheduled_at" TIMESTAMP,
  "sent_at" TIMESTAMP,
  
  -- Metadata
  "metadata" JSONB,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_email_queue_status" ON "email_queue"("status");
CREATE INDEX "idx_email_queue_scheduled_at" ON "email_queue"("scheduled_at");
CREATE INDEX "idx_email_queue_user_id" ON "email_queue"("user_id");
CREATE INDEX "idx_email_queue_tenant_id" ON "email_queue"("tenant_id");
CREATE INDEX "idx_email_queue_idempotency_key" ON "email_queue"("idempotency_key");

-- ============================================
-- EMAIL METRICS (aggregated daily)
-- ============================================

CREATE TABLE "email_metrics" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  
  -- Time Period
  "date" DATE NOT NULL,
  "hour" INTEGER, -- 0-23 for hourly metrics
  
  -- Segmentation
  "tenant_id" TEXT,
  "email_type" "EmailType",
  "provider" "EmailProvider",
  "template_code" TEXT,
  
  -- Metrics
  "sent_count" INTEGER DEFAULT 0,
  "delivered_count" INTEGER DEFAULT 0,
  "bounce_count" INTEGER DEFAULT 0,
  "hard_bounce_count" INTEGER DEFAULT 0,
  "soft_bounce_count" INTEGER DEFAULT 0,
  "complaint_count" INTEGER DEFAULT 0,
  "open_count" INTEGER DEFAULT 0,
  "unique_open_count" INTEGER DEFAULT 0,
  "click_count" INTEGER DEFAULT 0,
  "unique_click_count" INTEGER DEFAULT 0,
  "unsubscribe_count" INTEGER DEFAULT 0,
  
  -- Calculated Rates
  "delivery_rate" DECIMAL(5,2), -- %
  "bounce_rate" DECIMAL(5,2), -- %
  "open_rate" DECIMAL(5,2), -- %
  "click_rate" DECIMAL(5,2), -- %
  
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX "idx_email_metrics_unique" 
  ON "email_metrics"("date", "hour", "tenant_id", "email_type", "provider", "template_code");

CREATE INDEX "idx_email_metrics_date" ON "email_metrics"("date");
CREATE INDEX "idx_email_metrics_tenant_id" ON "email_metrics"("tenant_id");

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_email_integrations_updated_at
  BEFORE UPDATE ON email_integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_queue_updated_at
  BEFORE UPDATE ON email_queue
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_metrics_updated_at
  BEFORE UPDATE ON email_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default email templates
INSERT INTO "email_templates" ("code", "name", "type", "subject_pt", "subject_en", "html_content_pt", "html_content_en", "variables") VALUES
('welcome', 'Boas-vindas', 'TRANSACTIONAL', 
  'Bem-vindo ao {{companyName}}!', 
  'Welcome to {{companyName}}!',
  '<p>Olá {{name}},</p><p>Bem-vindo à plataforma!</p>',
  '<p>Hello {{name}},</p><p>Welcome to the platform!</p>',
  '["name", "companyName"]'::jsonb),

('email-verify', 'Verificação de E-mail', 'TRANSACTIONAL',
  'Confirme seu e-mail',
  'Verify your email',
  '<p>Olá {{name}},</p><p>Clique no link para verificar: {{verificationUrl}}</p>',
  '<p>Hello {{name}},</p><p>Click to verify: {{verificationUrl}}</p>',
  '["name", "verificationUrl"]'::jsonb),

('password-reset', 'Reset de Senha', 'TRANSACTIONAL',
  'Redefinir sua senha',
  'Reset your password',
  '<p>Olá {{name}},</p><p>Clique aqui para redefinir: {{resetUrl}}</p>',
  '<p>Hello {{name}},</p><p>Click here to reset: {{resetUrl}}</p>',
  '["name", "resetUrl"]'::jsonb),

('invoice', 'Fatura', 'TRANSACTIONAL',
  'Fatura #{{invoiceNumber}} disponível',
  'Invoice #{{invoiceNumber}} available',
  '<p>Olá {{name}},</p><p>Sua fatura está disponível.</p>',
  '<p>Hello {{name}},</p><p>Your invoice is available.</p>',
  '["name", "invoiceNumber", "amount", "dueDate"]'::jsonb);

-- Insert default SMTP configuration (MailHog for dev)
INSERT INTO "email_integrations" (
  "provider", 
  "is_active", 
  "is_primary",
  "smtp_host",
  "smtp_port",
  "smtp_secure",
  "transactional_domain",
  "from_name",
  "from_email"
) VALUES (
  'SMTP',
  true,
  true,
  'localhost',
  1025,
  false,
  'localhost',
  'Kaven Platform',
  'noreply@localhost'
);

COMMENT ON TABLE "email_integrations" IS 'Multi-provider email configuration (Postmark, Resend, AWS SES, SMTP)';
COMMENT ON TABLE "email_events" IS 'Email events tracking (bounces, complaints, opens, clicks)';
COMMENT ON TABLE "email_templates" IS 'Email templates with i18n support';
COMMENT ON TABLE "email_queue" IS 'Async email queue with retry logic';
COMMENT ON TABLE "email_metrics" IS 'Aggregated email metrics for analytics';
