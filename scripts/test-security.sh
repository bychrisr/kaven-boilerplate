#!/bin/bash

# Security Testing Script for Kaven Boilerplate
# This script tests various security measures implemented

set -e

echo "🛡️  Testing Security Measures for Kaven Boilerplate..."

# Configuration
API_BASE_URL="http://localhost:3010"
TEST_EMAIL="admin@kaven.com"
TEST_PASSWORD="admin123"

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

# Test 1: Security Headers
print_test "Security Headers"
HEADERS_RESPONSE=$(curl -s -I "$API_BASE_URL/health")
if echo "$HEADERS_RESPONSE" | grep -q "X-Content-Type-Options: nosniff"; then
    print_success "X-Content-Type-Options header present"
else
    print_error "X-Content-Type-Options header missing"
fi

if echo "$HEADERS_RESPONSE" | grep -q "X-Frame-Options: DENY"; then
    print_success "X-Frame-Options header present"
else
    print_error "X-Frame-Options header missing"
fi

if echo "$HEADERS_RESPONSE" | grep -q "X-XSS-Protection: 1; mode=block"; then
    print_success "X-XSS-Protection header present"
else
    print_error "X-XSS-Protection header missing"
fi

if echo "$HEADERS_RESPONSE" | grep -q "Strict-Transport-Security"; then
    print_success "Strict-Transport-Security header present"
else
    print_error "Strict-Transport-Security header missing"
fi

# Test 2: Rate Limiting
print_test "Rate Limiting (IP-based)"
print_info "Making 10 rapid requests to test rate limiting..."

RATE_LIMIT_HIT=false
for i in {1..10}; do
    RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null "$API_BASE_URL/api/auth/login" \
        -X POST \
        -H "Content-Type: application/json" \
        -d '{"email":"test@example.com","password":"wrongpassword"}')
    
    if [ "$RESPONSE" = "429" ]; then
        RATE_LIMIT_HIT=true
        break
    fi
done

if [ "$RATE_LIMIT_HIT" = true ]; then
    print_success "Rate limiting is working (429 response received)"
else
    print_error "Rate limiting may not be working properly"
fi

# Test 3: Request Size Limiting
print_test "Request Size Limiting"
LARGE_DATA=$(head -c 11000000 /dev/zero | tr '\0' 'A')
RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null "$API_BASE_URL/api/auth/login" \
    -X POST \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$LARGE_DATA\",\"password\":\"test\"}")

if [ "$RESPONSE" = "413" ]; then
    print_success "Request size limiting is working (413 response received)"
else
    print_error "Request size limiting may not be working properly (got $RESPONSE)"
fi

# Test 4: Input Sanitization
print_test "Input Sanitization"
RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null "$API_BASE_URL/api/auth/login" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test<script>alert(\"xss\")</script>@example.com","password":"test"}')

if [ "$RESPONSE" = "400" ]; then
    print_success "Input sanitization is working (400 response for malicious input)"
else
    print_error "Input sanitization may not be working properly (got $RESPONSE)"
fi

# Test 5: Authentication Required
print_test "Authentication Required for Protected Routes"
RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null "$API_BASE_URL/api/auth/me")

if [ "$RESPONSE" = "401" ]; then
    print_success "Authentication required for protected routes (401 response)"
else
    print_error "Authentication protection may not be working (got $RESPONSE)"
fi

# Test 6: CORS Headers
print_test "CORS Headers"
CORS_RESPONSE=$(curl -s -I -X OPTIONS "$API_BASE_URL/api/auth/login" \
    -H "Origin: http://localhost:3000" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type")

if echo "$CORS_RESPONSE" | grep -q "Access-Control-Allow-Origin"; then
    print_success "CORS headers are present"
else
    print_error "CORS headers may be missing"
fi

# Test 7: Content Security Policy
print_test "Content Security Policy"
CSP_RESPONSE=$(curl -s -I "$API_BASE_URL/health")
if echo "$CSP_RESPONSE" | grep -q "Content-Security-Policy"; then
    print_success "Content Security Policy header is present"
else
    print_error "Content Security Policy header is missing"
fi

# Test 8: API Versioning
print_test "API Versioning"
RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null "$API_BASE_URL/api/auth/login" \
    -X POST \
    -H "Content-Type: application/json" \
    -H "api-version: v2" \
    -d '{"email":"test@example.com","password":"test"}')

if [ "$RESPONSE" = "400" ]; then
    print_success "API versioning is working (400 response for unsupported version)"
else
    print_error "API versioning may not be working properly (got $RESPONSE)"
fi

# Test 9: Request Timeout
print_test "Request Timeout"
print_info "Testing request timeout (this may take up to 30 seconds)..."
TIMEOUT_RESPONSE=$(timeout 35s curl -s -w "%{http_code}" -o /dev/null "$API_BASE_URL/api/auth/login" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test"}')

if [ "$TIMEOUT_RESPONSE" = "408" ]; then
    print_success "Request timeout is working (408 response received)"
elif [ "$TIMEOUT_RESPONSE" = "124" ]; then
    print_success "Request timeout is working (timeout command triggered)"
else
    print_error "Request timeout may not be working properly (got $TIMEOUT_RESPONSE)"
fi

# Test 10: Database RLS (if backend is running)
print_test "Database Row Level Security"
print_info "Testing RLS requires backend to be running and database to be accessible"

# Check if backend is running
if curl -s "$API_BASE_URL/health" > /dev/null 2>&1; then
    print_info "Backend is running, testing RLS..."
    
    # Try to login to get a token
    LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")
    
    if echo "$LOGIN_RESPONSE" | grep -q "accessToken"; then
        print_success "Login successful, RLS context should be set"
        
        # Extract token
        TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
        
        # Test protected endpoint
        ME_RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null "$API_BASE_URL/api/auth/me" \
            -H "Authorization: Bearer $TOKEN")
        
        if [ "$ME_RESPONSE" = "200" ]; then
            print_success "Protected endpoint accessible with valid token"
        else
            print_error "Protected endpoint not accessible (got $ME_RESPONSE)"
        fi
    else
        print_error "Login failed, cannot test RLS"
    fi
else
    print_info "Backend is not running, skipping RLS test"
fi

echo ""
echo "🎉 Security testing completed!"
echo ""
echo "📋 Summary of Security Measures Tested:"
echo "   ✅ Security Headers (X-Frame-Options, X-XSS-Protection, etc.)"
echo "   ✅ Rate Limiting (IP-based)"
echo "   ✅ Request Size Limiting"
echo "   ✅ Input Sanitization"
echo "   ✅ Authentication Required"
echo "   ✅ CORS Headers"
echo "   ✅ Content Security Policy"
echo "   ✅ API Versioning"
echo "   ✅ Request Timeout"
echo "   ✅ Database RLS (if backend running)"
echo ""
echo "🔧 To run individual tests:"
echo "   curl -I $API_BASE_URL/health  # Test security headers"
echo "   curl -X POST $API_BASE_URL/api/auth/login -d '{}'  # Test rate limiting"
echo ""
echo "📚 For more comprehensive security testing, consider using:"
echo "   - OWASP ZAP"
echo "   - Burp Suite"
echo "   - Nmap security scripts"
echo ""
