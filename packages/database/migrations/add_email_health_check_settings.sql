-- Add email health check configuration to platform settings
-- These settings will be stored in a JSON column or separate table

-- Option 1: Add to existing settings table (if exists)
-- ALTER TABLE platform_settings ADD COLUMN email_health_check_config JSONB DEFAULT '{"enabled": false, "frequency": "1h"}'::jsonb;

-- Option 2: Create dedicated table for email health check settings
CREATE TABLE IF NOT EXISTS email_health_check_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enabled BOOLEAN DEFAULT false,
  frequency VARCHAR(20) DEFAULT '1h', -- '15m', '30m', '1h', '6h', '12h', '24h'
  last_run TIMESTAMP,
  next_run TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default configuration
INSERT INTO email_health_check_settings (enabled, frequency)
VALUES (false, '1h')
ON CONFLICT DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_email_health_check_settings_enabled ON email_health_check_settings(enabled);

-- Add comments
COMMENT ON TABLE email_health_check_settings IS 'Configuration for automatic email integration health checks';
COMMENT ON COLUMN email_health_check_settings.enabled IS 'Enable/disable automatic health checks';
COMMENT ON COLUMN email_health_check_settings.frequency IS 'Frequency of health checks: 15m, 30m, 1h, 6h, 12h, 24h';
COMMENT ON COLUMN email_health_check_settings.last_run IS 'Timestamp of last health check execution';
COMMENT ON COLUMN email_health_check_settings.next_run IS 'Timestamp of next scheduled health check';
