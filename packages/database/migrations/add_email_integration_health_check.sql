-- Add health check fields to email_integrations table
ALTER TABLE email_integrations
ADD COLUMN IF NOT EXISTS health_status VARCHAR(20),
ADD COLUMN IF NOT EXISTS health_message TEXT,
ADD COLUMN IF NOT EXISTS health_details JSONB,
ADD COLUMN IF NOT EXISTS last_health_check TIMESTAMP;

-- Create index for health_status for faster queries
CREATE INDEX IF NOT EXISTS idx_email_integrations_health_status ON email_integrations(health_status);

-- Add comment
COMMENT ON COLUMN email_integrations.health_status IS 'Health check status: healthy, unhealthy, unconfigured';
COMMENT ON COLUMN email_integrations.health_message IS 'Human-readable health check message';
COMMENT ON COLUMN email_integrations.health_details IS 'Detailed health check information (JSON)';
COMMENT ON COLUMN email_integrations.last_health_check IS 'Timestamp of last health check execution';
