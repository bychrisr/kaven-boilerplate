#!/bin/bash

echo "🧹 Limpando processos de desenvolvimento..."

# Matar processos tsx watch
pkill -9 -f "tsx watch" 2>/dev/null || true

# Liberar portas
fuser -k -9 8000/tcp 2>/dev/null || true  # API
fuser -k -9 3000/tcp 2>/dev/null || true  # Admin
fuser -k -9 3001/tcp 2>/dev/null || true  # Tenant
fuser -k -9 3002/tcp 2>/dev/null || true  # Docs

# Remover PID files
rm -f /tmp/kaven-*.pid

echo "✅ Limpeza concluída!"
sleep 1
