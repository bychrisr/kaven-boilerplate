#!/bin/bash

# Script para limpar cache e reiniciar o servidor Next.js

echo "🧹 Limpando cache do Next.js..."

# Navegar para o diretório do admin
cd "$(dirname "$0")" || exit 1

# Remover cache do Next.js
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo

echo "✅ Cache removido com sucesso!"

echo "🔄 Reiniciando servidor de desenvolvimento..."

# Matar processos Next.js antigos (se houver)
pkill -f "next dev" 2>/dev/null || true

# Aguardar um momento
sleep 2

echo "🚀 Iniciando servidor com cache limpo..."
echo ""
echo "Execute manualmente: pnpm dev"
echo ""
echo "Instruções para o navegador:"
echo "1. Abra o DevTools (F12)"
echo "2. Clique com botão direito no ícone de reload"
echo "3. Selecione 'Empty Cache and Hard Reload'"
echo ""
