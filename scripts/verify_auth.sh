#!/bin/bash

# Configuration
API_URL="http://localhost:8000/api"
EMAIL="debug_auth_$(date +%s)@example.com"
PASSWORD="Password123!"
NAME="Debug User"

echo "----------------------------------------"
echo "1. Registering new user..."
REGISTER_RES=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\", \"name\": \"$NAME\"}")

echo "Response: $REGISTER_RES"

echo "----------------------------------------"
echo "2. Logging in..."
LOGIN_RES=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

# Extract Token using grep/sed (simpler than jq dependency)
ACCESS_TOKEN=$(echo $LOGIN_RES | grep -o '"accessToken":"[^"]*' | cut -d'"' -f3)

if [ -z "$ACCESS_TOKEN" ]; then
    echo "❌ Login Failed! No token found."
    echo "Full Response: $LOGIN_RES"
    exit 1
fi

echo "✅ Token received: ${ACCESS_TOKEN:0:20}..."

echo "----------------------------------------"
echo "3. Testing /api/users (GET)..."
USERS_RES=$(curl -s -v -X GET "$API_URL/users?page=1&limit=5" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Response: $USERS_RES"

# Check for 401
if echo "$USERS_RES" | grep -q "Unauthorized"; then
    echo "❌ /api/users Failed with 401 Unauthorized"
    exit 1
else
    echo "✅ /api/users Success!"
fi
