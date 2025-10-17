-- Setup Row Level Security (RLS) for Multi-Tenant Architecture
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
  WHERE id = app.current_user_id();
  
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
    tenant_id = app.current_tenant_id()::uuid
    OR app.is_admin()
  );

-- Policy: Users can only update users from their own tenant
CREATE POLICY users_update_tenant_isolation ON users
  FOR UPDATE
  TO PUBLIC
  USING (
    tenant_id = app.current_tenant_id()::uuid
    OR app.is_admin()
  )
  WITH CHECK (
    tenant_id = app.current_tenant_id()::uuid
    OR app.is_admin()
  );

-- Policy: Users can only insert users into their own tenant
CREATE POLICY users_insert_tenant_isolation ON users
  FOR INSERT
  TO PUBLIC
  WITH CHECK (
    tenant_id = app.current_tenant_id()::uuid
    OR app.is_admin()
  );

-- Policy: Users can only delete users from their own tenant
CREATE POLICY users_delete_tenant_isolation ON users
  FOR DELETE
  TO PUBLIC
  USING (
    tenant_id = app.current_tenant_id()::uuid
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
    id = app.current_tenant_id()::uuid
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
    tenant_id = app.current_tenant_id()::uuid
    OR app.is_admin()
  )
  WITH CHECK (
    tenant_id = app.current_tenant_id()::uuid
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
    tenant_id = app.current_tenant_id()::uuid
    OR app.is_admin()
  )
  WITH CHECK (
    tenant_id = app.current_tenant_id()::uuid
    OR app.is_admin()
  );

-- =============================================================================
-- ADDITIONAL SECURITY MEASURES
-- =============================================================================

-- Create indexes for better performance with RLS
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_plans_tenant_id ON plans(tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_metrics_tenant_id ON metrics(tenant_id);

-- Create function to audit tenant access
CREATE OR REPLACE FUNCTION app.audit_tenant_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log tenant access attempts
  INSERT INTO metrics (
    tenant_id,
    metric_name,
    value,
    labels,
    timestamp
  ) VALUES (
    app.current_tenant_id()::uuid,
    'tenant_access_audit',
    1,
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'user_id', app.current_user_id(),
      'timestamp', now()
    ),
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
EXCEPTION
  WHEN OTHERS THEN
    -- Don't fail the operation if audit fails
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create audit triggers for sensitive operations
CREATE TRIGGER audit_users_access
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW
  EXECUTE FUNCTION app.audit_tenant_access();

CREATE TRIGGER audit_tenants_access
  AFTER INSERT OR UPDATE OR DELETE ON tenants
  FOR EACH ROW
  EXECUTE FUNCTION app.audit_tenant_access();

CREATE TRIGGER audit_metrics_access
  AFTER INSERT OR UPDATE OR DELETE ON metrics
  FOR EACH ROW
  EXECUTE FUNCTION app.audit_tenant_access();

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
    OR resource_tenant_id = app.current_tenant_id()::uuid
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

-- Create view for tenant dashboard (with RLS)
CREATE VIEW tenant_dashboard AS
SELECT 
  t.id as tenant_id,
  t.name as tenant_name,
  t.subdomain,
  t.is_active,
  t.created_at,
  COUNT(DISTINCT u.id) as user_count,
  COUNT(DISTINCT m.id) as metric_count,
  COUNT(DISTINCT p.id) as plan_count,
  MAX(m.timestamp) as last_activity
FROM tenants t
LEFT JOIN users u ON t.id = u.tenant_id
LEFT JOIN metrics m ON t.id = m.tenant_id
LEFT JOIN plans p ON t.id = p.tenant_id
GROUP BY t.id, t.name, t.subdomain, t.is_active, t.created_at;

-- Apply RLS to the view
ALTER VIEW tenant_dashboard SET (security_invoker = true);

-- Create policy for tenant dashboard
CREATE POLICY tenant_dashboard_access ON tenant_dashboard
  FOR SELECT
  TO PUBLIC
  USING (
    tenant_id = app.current_tenant_id()::uuid
    OR app.is_admin()
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA app TO PUBLIC;
GRANT EXECUTE ON FUNCTION app.current_tenant_id() TO PUBLIC;
GRANT EXECUTE ON FUNCTION app.current_user_id() TO PUBLIC;
GRANT EXECUTE ON FUNCTION app.is_admin() TO PUBLIC;
GRANT EXECUTE ON FUNCTION app.validate_tenant_ownership(uuid) TO PUBLIC;
GRANT EXECUTE ON FUNCTION app.get_tenant_stats(uuid) TO PUBLIC;
GRANT EXECUTE ON FUNCTION app.cleanup_old_metrics(timestamp, uuid) TO PUBLIC;

-- Grant select on tenant dashboard
GRANT SELECT ON tenant_dashboard TO PUBLIC;

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
COMMENT ON VIEW tenant_dashboard IS 'Dashboard view with tenant statistics and RLS protection';

-- Log successful RLS setup
INSERT INTO metrics (
  tenant_id,
  metric_name,
  value,
  labels,
  timestamp
) VALUES (
  (SELECT id FROM tenants WHERE subdomain = 'default' LIMIT 1),
  'rls_setup_completed',
  1,
  jsonb_build_object(
    'setup_version', '1.0.0',
    'timestamp', now()
  ),
  now()
);
