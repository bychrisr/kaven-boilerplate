#!/bin/bash

# Garante que o diretório de log existe
mkdir -p .agent/telemetry
touch .agent/telemetry/commands_tracker.txt

# Função Wrapper
execute() {
    local cmd="$*"
    echo "🤖 Executing: $cmd"
    
    # 1. Registra no tracker para o relatório
    echo "$cmd" >> .agent/telemetry/commands_tracker.txt
    
    # 2. Executa o comando real
    eval "$cmd"
    
    # 3. Verifica erro
    local status=$?
    if [ $status -ne 0 ]; then
        echo "❌ Command failed with status $status"
        return $status
    fi
}
