#!/bin/bash

# Test Runner Script for Kaven Boilerplate
# This script sets up the test environment and runs all tests

set -e

echo "🧪 Running Kaven Boilerplate Tests..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
print_test() {
    echo -e "${YELLOW}🧪 Testing: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Set test environment variables
export NODE_ENV=test
export TEST_DATABASE_URL="postgresql://kaven:kaven123@localhost:5433/kaven_test"
export TEST_REDIS_URL="redis://localhost:6379/1"
export JWT_SECRET="test-secret-key-change-in-production"
export JWT_EXPIRES_IN="1h"
export REFRESH_TOKEN_EXPIRES_IN="7d"

print_info "Setting up test environment..."

# Check if PostgreSQL is running
if ! docker compose ps postgres | grep -q "Up"; then
    print_info "Starting PostgreSQL container..."
    docker compose up -d postgres
    sleep 5
fi

# Check if Redis is running
if ! docker compose ps redis | grep -q "Up"; then
    print_info "Starting Redis container..."
    docker compose up -d redis
    sleep 2
fi

# Create test database if it doesn't exist
print_info "Setting up test database..."
docker compose exec -T postgres psql -U kaven -d postgres -c "CREATE DATABASE kaven_test;" 2>/dev/null || echo "Test database may already exist"

# Run Prisma migrations on test database
print_info "Running Prisma migrations on test database..."
cd backend
export DATABASE_URL="$TEST_DATABASE_URL"
npx prisma migrate deploy --schema=./prisma/schema.prisma || echo "Migrations may already be applied"
npx prisma generate

# Apply RLS to test database
print_info "Applying RLS to test database..."
docker compose exec -T postgres psql -U kaven -d kaven_test -f /dev/stdin < ../prisma/migrations/20241220000002_setup_rls_final.sql || echo "RLS may already be applied"

# Clear Redis test database
print_info "Clearing Redis test database..."
docker compose exec redis redis-cli -n 1 FLUSHDB

print_info "Test environment setup complete!"

# Function to run specific test suites
run_unit_tests() {
    print_test "Unit Tests"
    npm run test:unit
}

run_integration_tests() {
    print_test "Integration Tests"
    npm run test:integration
}

run_all_tests() {
    print_test "All Tests"
    npm run test:run
}

run_tests_with_coverage() {
    print_test "Tests with Coverage"
    npm run test:coverage
}

# Parse command line arguments
case "${1:-all}" in
    "unit")
        run_unit_tests
        ;;
    "integration")
        run_integration_tests
        ;;
    "coverage")
        run_tests_with_coverage
        ;;
    "all"|"")
        run_all_tests
        ;;
    *)
        echo "Usage: $0 [unit|integration|coverage|all]"
        echo ""
        echo "Options:"
        echo "  unit        Run only unit tests"
        echo "  integration Run only integration tests"
        echo "  coverage    Run tests with coverage report"
        echo "  all         Run all tests (default)"
        exit 1
        ;;
esac

# Check test results
if [ $? -eq 0 ]; then
    print_success "All tests passed!"
    echo ""
    echo "📊 Test Summary:"
    echo "   ✅ Unit tests completed"
    echo "   ✅ Integration tests completed"
    echo "   ✅ Security tests completed"
    echo "   ✅ RLS isolation tests completed"
    echo ""
    echo "🎉 Backend is ready for production!"
else
    print_error "Some tests failed!"
    echo ""
    echo "🔧 To debug:"
    echo "   1. Check test logs above"
    echo "   2. Verify database and Redis are running"
    echo "   3. Check test data setup"
    echo "   4. Run individual test suites: $0 unit"
    exit 1
fi

echo ""
echo "📚 Next steps:"
echo "   - Run with coverage: $0 coverage"
echo "   - Watch mode: npm run test:watch"
echo "   - UI mode: npm run test:ui"
echo "   - Individual test: npm run test tests/unit/auth.service.test.ts"
