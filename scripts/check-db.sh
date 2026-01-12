#!/bin/bash

# 🔍 Kaven Database Health Check
# Verifica se o banco de dados está pronto antes de iniciar a aplicação

set -e

echo "🔍 Verificando estado do banco de dados..."

# Verificar se container PostgreSQL está rodando
if ! docker ps | grep -q kaven-postgres; then
  echo "❌ Container PostgreSQL não está rodando"
  echo "💡 Execute: pnpm docker:up"
  exit 1
fi

echo "✅ Container PostgreSQL está rodando"

# Aguardar PostgreSQL estar pronto
echo "⏳ Aguardando PostgreSQL estar pronto..."
timeout 30 bash -c 'until docker exec kaven-postgres pg_isready -U kaven -d kaven_dev > /dev/null 2>&1; do sleep 1; done' || {
  echo "❌ PostgreSQL não respondeu em 30 segundos"
  exit 1
}

echo "✅ PostgreSQL está pronto"

# Verificar se há migrações pendentes
cd packages/database
echo "🔍 Verificando status das migrações..."

if npx prisma migrate status 2>&1 | grep -q "have not yet been applied"; then
  echo "⚠️  Migrações pendentes detectadas!"
  echo ""
  npx prisma migrate status
  echo ""
  echo "💡 Execute: cd packages/database && npx prisma migrate deploy"
  exit 1
fi

echo "✅ Todas as migrações estão aplicadas"

# Verificar se PlatformConfig existe
echo "🔍 Verificando dados essenciais..."
COUNT=$(docker exec kaven-postgres psql -U kaven -d kaven_dev -t -c "SELECT COUNT(*) FROM \"PlatformConfig\";" 2>/dev/null | tr -d ' ')

if [ "$COUNT" -eq "0" ]; then
  echo "⚠️  Tabela PlatformConfig está vazia!"
  echo "💡 Execute: cd packages/database && pnpm db:seed"
  exit 1
fi

echo "✅ Dados essenciais estão presentes"

echo ""
echo "✅ ✅ ✅ Banco de dados está pronto! ✅ ✅ ✅"
echo ""
