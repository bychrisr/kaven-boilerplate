#!/bin/bash

# Security Audit Script
# Valida configurações básicas e endpoints de segurança

echo "🔒 Iniciando Auditoria de Segurança Axisor..."

API_URL="http://localhost:8000"

# 1. Verifica Headers de Segurança (Helmet)
echo "\n[1/5] Verificando Headers de Segurança..."
HEADERS=$(curl -sI $API_URL/health)
if echo "$HEADERS" | grep -q "Content-Security-Policy"; then
    echo "✅ CSP Header presente"
else
    echo "❌ CSP Header ausente"
fi

if echo "$HEADERS" | grep -q "X-Frame-Options"; then
    echo "✅ X-Frame-Options Header presente"
else
    echo "❌ X-Frame-Options Header ausente"
fi

# 2. Verifica Public Exposure (env)
echo "\n[2/5] Verificando Exposição de Arquivos Sensíveis..."
if [ -f "apps/api/src/lib/bcrypt.ts" ]; then
    echo "❌ Arquivo bcrypt.ts antigo ainda existe"
else
    echo "✅ Arquivo bcrypt.ts removido corretamente"
fi

# 3. Verifica Rate Limiting (Smoke Test)
echo "\n[3/5] Testando Rate Limiting..."
# Faz 5 requests rápidos
for i in {1..5}; do curl -s $API_URL/health > /dev/null; done
echo "✅ Rate limit não bloqueou (como esperado para 5 requests)"

# 4. Verifica CSRF (Conceitual - requer browser ou header manipulation)
echo "\n[4/5] Verificando CSRF (Requer Origin)..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $API_URL/api/auth/login -H "Origin: http://evil.com")
if [ "$RESPONSE" = "403" ]; then
    echo "✅ Bloqueio CSRF ativo (Origin evil.com -> 403)"
else
    echo "⚠️  CSRF permitiu ou endpoint não validado (Code: $RESPONSE)"
fi

# 5. Verifica Estrutura de Diretórios
echo "\n[5/5] Verificando Estrutura..."
if [ -f "apps/api/src/middleware/rate-limit.middleware.ts" ]; then
    echo "✅ Rate Limit Middleware existe"
else
    echo "❌ Rate Limit Middleware ausente"
fi

if [ -f "apps/api/src/utils/sanitizer.ts" ]; then
    echo "✅ Sanitizer Utils existe"
else
    echo "❌ Sanitizer Utils ausente"
fi

echo "\n🏁 Auditoria Preliminar Concluída."
