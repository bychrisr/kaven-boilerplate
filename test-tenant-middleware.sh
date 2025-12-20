#!/bin/bash

# Script de teste do Middleware Camaleão
# Testa detecção de tenant via header, path e subdomain

echo "🧪 Testando Middleware Camaleão..."
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://localhost:8000"

# Primeiro, criar um tenant de teste
echo -e "${BLUE}📦 Criando tenant de teste...${NC}"
TENANT_RESPONSE=$(curl -s -X POST "$API_URL/api/tenants" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Empresa Teste",
    "slug": "empresa-teste",
    "domain": "empresa-teste.localhost"
  }')

TENANT_ID=$(echo $TENANT_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TENANT_ID" ]; then
  echo -e "${RED}❌ Falha ao criar tenant${NC}"
  echo "Response: $TENANT_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ Tenant criado: $TENANT_ID${NC}"
echo ""

# Teste 1: Detecção via Header X-Tenant-ID
echo -e "${BLUE}1️⃣  Teste: Detecção via Header X-Tenant-ID${NC}"
RESPONSE=$(curl -s -X GET "$API_URL/api/users" \
  -H "X-Tenant-ID: $TENANT_ID" \
  -H "Content-Type: application/json")

echo "Response: $RESPONSE"
echo ""

# Teste 2: Detecção via Path /tenants/:slug
echo -e "${BLUE}2️⃣  Teste: Detecção via Path /tenants/:slug${NC}"
RESPONSE=$(curl -s -X GET "$API_URL/tenants/empresa-teste/api/users" \
  -H "Content-Type: application/json")

echo "Response: $RESPONSE"
echo ""

# Teste 3: Sem tenant (deve retornar erro ou funcionar em single mode)
echo -e "${BLUE}3️⃣  Teste: Sem tenant (modo multi-tenant)${NC}"
RESPONSE=$(curl -s -X GET "$API_URL/api/users" \
  -H "Content-Type: application/json")

echo "Response: $RESPONSE"
echo ""

# Teste 4: Tenant inválido
echo -e "${BLUE}4️⃣  Teste: Tenant ID inválido${NC}"
RESPONSE=$(curl -s -X GET "$API_URL/api/users" \
  -H "X-Tenant-ID: invalid-uuid-123" \
  -H "Content-Type: application/json")

echo "Response: $RESPONSE"
echo ""

echo -e "${GREEN}✅ Testes concluídos!${NC}"
echo ""
echo "💡 Dicas:"
echo "  - Para testar subdomain, adicione ao /etc/hosts:"
echo "    127.0.0.1 empresa-teste.localhost"
echo "  - Depois teste: curl http://empresa-teste.localhost:8000/api/users"
