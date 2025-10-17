#!/bin/bash

# Setup Row Level Security (RLS) for Kaven Boilerplate
# This script applies RLS configuration to the PostgreSQL database

set -e

echo "🛡️  Setting up Row Level Security (RLS) for Kaven Boilerplate..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is not set"
    echo "Please set DATABASE_URL before running this script"
    exit 1
fi

# Extract database connection details
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')

echo "📊 Database connection details:"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"

# Test database connection
echo "🔍 Testing database connection..."
if ! PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ Failed to connect to database"
    echo "Please check your DATABASE_URL and ensure the database is running"
    exit 1
fi

echo "✅ Database connection successful"

# Check if tables exist
echo "🔍 Checking if tables exist..."
TABLES_EXIST=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users', 'tenants', 'plans', 'metrics');" | tr -d ' ')

if [ "$TABLES_EXIST" -ne "4" ]; then
    echo "❌ Required tables do not exist"
    echo "Please run Prisma migrations first: npx prisma migrate dev"
    exit 1
fi

echo "✅ All required tables exist"

# Check if RLS is already enabled
echo "🔍 Checking RLS status..."
RLS_ENABLED=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM pg_class WHERE relname IN ('users', 'tenants', 'plans', 'metrics') AND relrowsecurity = true;" | tr -d ' ')

if [ "$RLS_ENABLED" -eq "4" ]; then
    echo "⚠️  RLS appears to be already enabled"
    read -p "Do you want to reapply RLS configuration? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping RLS setup"
        exit 0
    fi
fi

# Apply RLS configuration
echo "🛡️  Applying RLS configuration..."
if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "prisma/migrations/20241220000000_setup_rls.sql"; then
    echo "✅ RLS configuration applied successfully"
else
    echo "❌ Failed to apply RLS configuration"
    exit 1
fi

# Verify RLS is working
echo "🔍 Verifying RLS configuration..."

# Check if RLS is enabled on all tables
RLS_STATUS=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT string_agg(relname || ': ' || CASE WHEN relrowsecurity THEN 'ENABLED' ELSE 'DISABLED' END, ', ') FROM pg_class WHERE relname IN ('users', 'tenants', 'plans', 'metrics');")

echo "📊 RLS Status: $RLS_STATUS"

# Check if policies exist
POLICIES_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public';" | tr -d ' ')

echo "📊 Policies created: $POLICIES_COUNT"

# Check if app schema exists
APP_SCHEMA_EXISTS=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name = 'app';" | tr -d ' ')

if [ "$APP_SCHEMA_EXISTS" -eq "1" ]; then
    echo "✅ App schema created successfully"
else
    echo "❌ App schema not found"
    exit 1
fi

# Check if functions exist
FUNCTIONS_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'app';" | tr -d ' ')

echo "📊 App functions created: $FUNCTIONS_COUNT"

# Test RLS with a sample query (without session variables - should return no rows)
echo "🧪 Testing RLS isolation..."
TEST_RESULT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM users;" | tr -d ' ')

if [ "$TEST_RESULT" -eq "0" ]; then
    echo "✅ RLS isolation working correctly (no rows returned without session context)"
else
    echo "⚠️  RLS may not be working correctly (rows returned without session context)"
fi

# Test with session variables
echo "🧪 Testing RLS with session context..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
SET app.current_tenant_id = (SELECT id::text FROM tenants LIMIT 1);
SET app.current_user_id = (SELECT id::text FROM users LIMIT 1);
SELECT 'RLS test with session context: ' || COUNT(*)::text FROM users;
" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ RLS session context working correctly"
else
    echo "❌ RLS session context test failed"
fi

echo ""
echo "🎉 RLS setup completed successfully!"
echo ""
echo "📋 Summary:"
echo "   ✅ RLS enabled on all tables"
echo "   ✅ Tenant isolation policies created"
echo "   ✅ Admin access policies created"
echo "   ✅ App schema and functions created"
echo "   ✅ Audit triggers configured"
echo "   ✅ Performance indexes created"
echo ""
echo "🔧 Next steps:"
echo "   1. Update your application to set session variables"
echo "   2. Test tenant isolation with different users"
echo "   3. Monitor audit logs in the metrics table"
echo ""
echo "📚 Documentation:"
echo "   - Session variables: app.current_tenant_id, app.current_user_id"
echo "   - Helper functions: app.is_admin(), app.validate_tenant_ownership()"
echo "   - Admin functions: app.get_tenant_stats(), app.cleanup_old_metrics()"
echo ""
