-- Setup Row Level Security (RLS) for Multi-Tenant Architecture - FIXED VERSION
-- This migration enables RLS on all tables and creates policies for tenant isolation

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- Create application schema for session variables
CREATE SCHEMA IF NOT EXISTS app;

-- Create function to get current tenant ID from session
CREATE OR REPLACE FUNCTION app.current_tenant_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN current_setting('app.current_tenant_id', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

-- Create function to get current user ID from session
CREATE OR REPLACE FUNCTION app.current_user_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN current_setting('app.current_user_id', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION app.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_record users%ROWTYPE;
BEGIN
  -- Get user record
  SELECT * INTO user_record 
  FROM users 
  WHERE id::text = app.current_user_id();
  
  -- Return admin status
  RETURN COALESCE(user_record.is_adm, false);
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;

-- =============================================================================
-- USERS TABLE POLICIES
-- =============================================================================

-- Policy: Users can only see users from their own tenant
CREATE POLICY users_tenant_isolation ON users
  FOR ALL
  TO PUBLIC
  USING (
    tenant_id::text = app.current_tenant_id()
    OR app.is_admin()
  );

-- =============================================================================
-- TENANTS TABLE POLICIES
-- =============================================================================

-- Policy: Users can only see their own tenant (admins can see all)
CREATE POLICY tenants_access ON tenants
  FOR SELECT
  TO PUBLIC
  USING (
    id::text = app.current_tenant_id()
    OR app.is_admin()
  );

-- Policy: Only admins can modify tenants
CREATE POLICY tenants_admin_only ON tenants
  FOR ALL
  TO PUBLIC
  USING (app.is_admin())
  WITH CHECK (app.is_admin());

-- =============================================================================
-- PLANS TABLE POLICIES
-- =============================================================================

-- Policy: Users can only see plans from their own tenant (admins can see all)
CREATE POLICY plans_tenant_isolation ON plans
  FOR ALL
  TO PUBLIC
  USING (
    tenant_id::text = app.current_tenant_id()
    OR app.is_admin()
  )
  WITH CHECK (
    tenant_id::text = app.current_tenant_id()
    OR app.is_admin()
  );

-- =============================================================================
-- METRICS TABLE POLICIES
-- =============================================================================

-- Policy: Users can only see metrics from their own tenant
CREATE POLICY metrics_tenant_isolation ON metrics
  FOR ALL
  TO PUBLIC
  USING (
    tenant_id::text = app.current_tenant_id()
    OR app.is_admin()
  )
  WITH CHECK (
    tenant_id::text = app.current_tenant_id()
    OR app.is_admin()
  );

-- =============================================================================
-- ADDITIONAL SECURITY MEASURES
-- =============================================================================

-- Create indexes for better performance with RLS
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_plans_tenant_id ON plans(tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_metrics_tenant_id ON metrics(tenant_id);

-- Create function to validate tenant ownership
CREATE OR REPLACE FUNCTION app.validate_tenant_ownership(resource_tenant_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- Allow if admin or if resource belongs to current tenant
  RETURN (
    app.is_admin() 
    OR resource_tenant_id::text = app.current_tenant_id()
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;

-- Create function to get tenant statistics (admin only)
CREATE OR REPLACE FUNCTION app.get_tenant_stats(tenant_uuid uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  stats jsonb;
BEGIN
  -- Only admins can access tenant statistics
  IF NOT app.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Get tenant statistics
  SELECT jsonb_build_object(
    'tenant_id', tenant_uuid,
    'user_count', (SELECT COUNT(*) FROM users WHERE tenant_id = tenant_uuid),
    'metric_count', (SELECT COUNT(*) FROM metrics WHERE tenant_id = tenant_uuid),
    'plan_count', (SELECT COUNT(*) FROM plans WHERE tenant_id = tenant_uuid),
    'last_activity', (SELECT MAX(timestamp) FROM metrics WHERE tenant_id = tenant_uuid)
  ) INTO stats;
  
  RETURN stats;
END;
$$;

-- Create function to cleanup old metrics (admin only)
CREATE OR REPLACE FUNCTION app.cleanup_old_metrics(older_than timestamp, tenant_uuid uuid DEFAULT NULL)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count integer;
BEGIN
  -- Only admins can cleanup metrics
  IF NOT app.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Delete old metrics
  IF tenant_uuid IS NULL THEN
    -- Delete from all tenants
    DELETE FROM metrics 
    WHERE timestamp < older_than;
  ELSE
    -- Delete from specific tenant
    DELETE FROM metrics 
    WHERE timestamp < older_than 
    AND tenant_id = tenant_uuid;
  END IF;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA app TO PUBLIC;
GRANT EXECUTE ON FUNCTION app.current_tenant_id() TO PUBLIC;
GRANT EXECUTE ON FUNCTION app.current_user_id() TO PUBLIC;
GRANT EXECUTE ON FUNCTION app.is_admin() TO PUBLIC;
GRANT EXECUTE ON FUNCTION app.validate_tenant_ownership(uuid) TO PUBLIC;
GRANT EXECUTE ON FUNCTION app.get_tenant_stats(uuid) TO PUBLIC;
GRANT EXECUTE ON FUNCTION app.cleanup_old_metrics(timestamp, uuid) TO PUBLIC;

-- Create indexes for better RLS performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_tenant_created ON users(tenant_id, created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_metrics_tenant_timestamp ON metrics(tenant_id, timestamp);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_plans_tenant_active ON plans(tenant_id, is_active);

-- Add comments for documentation
COMMENT ON FUNCTION app.current_tenant_id() IS 'Returns the current tenant ID from session variables for RLS';
COMMENT ON FUNCTION app.current_user_id() IS 'Returns the current user ID from session variables for RLS';
COMMENT ON FUNCTION app.is_admin() IS 'Checks if the current user has admin privileges';
COMMENT ON FUNCTION app.validate_tenant_ownership(uuid) IS 'Validates if a resource belongs to the current tenant or user is admin';
COMMENT ON FUNCTION app.get_tenant_stats(uuid) IS 'Gets tenant statistics (admin only)';
COMMENT ON FUNCTION app.cleanup_old_metrics(timestamp, uuid) IS 'Cleans up old metrics (admin only)';

-- Log successful RLS setup
INSERT INTO metrics (
  id,
  tenant_id,
  metric_name,
  value,
  labels,
  timestamp
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM tenants WHERE subdomain = 'default' LIMIT 1),
  'rls_setup_completed',
  1,
  jsonb_build_object(
    'setup_version', '1.0.0',
    'timestamp', now()
  ),
  now()
);
