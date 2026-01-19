#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔄 Iniciando API Server...${NC}"

# 1. Matar TODOS os processos tsx watch relacionados à API
echo -e "${YELLOW}🧹 Limpando processos antigos...${NC}"
pkill -9 -f "tsx watch src/server.ts" 2>/dev/null || true
pkill -9 -f "tsx.*api.*server" 2>/dev/null || true

# 2. Liberar porta 8000
echo -e "${YELLOW}🔓 Liberando porta 8000...${NC}"
fuser -k -9 8000/tcp 2>/dev/null || true

# 3. Aguardar um momento para garantir que processos foram mortos
sleep 1

# 4. Verificar se porta está realmente livre
if lsof -ti:8000 > /dev/null 2>&1; then
  echo -e "${RED}❌ ERRO: Porta 8000 ainda está em uso!${NC}"
  echo -e "${YELLOW}Processos na porta 8000:${NC}"
  lsof -ti:8000 | xargs ps -p
  exit 1
fi

# 5. Criar PID file para evitar múltiplas instâncias
PID_FILE="/tmp/kaven-api.pid"
if [ -f "$PID_FILE" ]; then
  OLD_PID=$(cat "$PID_FILE")
  if ps -p "$OLD_PID" > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Matando processo antigo (PID: $OLD_PID)...${NC}"
    kill -9 "$OLD_PID" 2>/dev/null || true
  fi
  rm -f "$PID_FILE"
fi

# 6. Iniciar servidor e salvar PID
echo -e "${GREEN}✅ Iniciando servidor limpo...${NC}"
tsx watch src/server.ts &
echo $! > "$PID_FILE"

echo -e "${GREEN}🚀 API Server iniciado! PID: $(cat $PID_FILE)${NC}"

# 7. Aguardar o processo (para manter o script rodando)
wait
