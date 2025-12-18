#!/bin/bash
# setup_agent.sh
# Cria TODA a infraestrutura do Agente (Scripts, Telemetria, Utils) de uma vez.

set -e

echo "🛠️  Configurando ambiente do Kaven Agent..."

# 1. Criar diretórios
mkdir -p .agent/scripts
mkdir -p .agent/telemetry/archive
mkdir -p .agent/reports
mkdir -p .agent/workflows

# 2. Criar utils.sh (A função execute persistente)
cat > .agent/scripts/utils.sh << 'SCRIPT'
#!/bin/bash
mkdir -p .agent/telemetry
touch .agent/telemetry/commands_tracker.txt

execute() {
    local cmd="$*"
    echo "🤖 Executing: $cmd"
    echo "$cmd" >> .agent/telemetry/commands_tracker.txt
    eval "$cmd"
    local status=$?
    if [ $status -ne 0 ]; then
        echo "❌ Falha no comando: $cmd"
        return $status
    fi
}
SCRIPT

# 3. Criar init_telemetry.sh
cat > .agent/scripts/init_telemetry.sh << 'SCRIPT'
#!/bin/bash
TELEMETRY_DIR=".agent/telemetry"
CURRENT_FILE="$TELEMETRY_DIR/current_execution.json"
WORKFLOW_NAME="${1:-unnamed}"
DESC="${2:-setup}"
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

mkdir -p "$TELEMETRY_DIR"
cat > "$CURRENT_FILE" << JSON
{
  "timestamp_start": "$TIMESTAMP_START",
  "workflow_name": "$WORKFLOW_NAME",
  "task_description": "$DESC",
  "files_created": [],
  "commands_executed": [],
  "success": true
}
JSON
: > "$TELEMETRY_DIR/files_tracker.txt"
: > "$TELEMETRY_DIR/commands_tracker.txt"
echo "true" > "$TELEMETRY_DIR/success.txt"
echo "✅ Telemetria iniciada: $WORKFLOW_NAME"
SCRIPT

# 4. Criar finalize_telemetry.sh (Com correção de Snapshot e Tempo)
cat > .agent/scripts/finalize_telemetry.sh << 'SCRIPT'
#!/bin/bash
TELEMETRY_DIR=".agent/telemetry"
CURRENT_FILE="$TELEMETRY_DIR/current_execution.json"
LAST_EXECUTION_FILE="$TELEMETRY_DIR/last_execution.json"
FILES_TRACKER="$TELEMETRY_DIR/files_tracker.txt"
COMMANDS_TRACKER="$TELEMETRY_DIR/commands_tracker.txt"
METRICS_FILE="$TELEMETRY_DIR/metrics.json"

if [ -f "$FILES_TRACKER" ]; then FILES=$(jq -R . "$FILES_TRACKER" | jq -s .); else FILES='[]'; fi
if [ -f "$COMMANDS_TRACKER" ]; then CMDS=$(jq -R . "$COMMANDS_TRACKER" | jq -s .); else CMDS='[]'; fi

# Calculo de tempo (Python fallback)
START=$(jq -r '.timestamp_start' "$CURRENT_FILE")
END=$(date -u +%Y-%m-%dT%H:%M:%SZ)
DUR=0
if command -v python3 &>/dev/null; then
    DUR=$(python3 -c "from datetime import datetime; s=datetime.strptime('$START', '%Y-%m-%dT%H:%M:%SZ'); e=datetime.strptime('$END', '%Y-%m-%dT%H:%M:%SZ'); print(int((e-s).total_seconds()))" 2>/dev/null || echo 0)
fi

# Atualizar Current
jq --argjson f "$FILES" --argjson c "$CMDS" --arg e "$END" --argjson d "$DUR" \
   '.files_created=$f | .commands_executed=$c | .timestamp_end=$e | .duration_seconds=$d' \
   "$CURRENT_FILE" > "$CURRENT_FILE.tmp" && mv "$CURRENT_FILE.tmp" "$CURRENT_FILE"

# Snapshot Crítico
cp "$CURRENT_FILE" "$LAST_EXECUTION_FILE"
cp "$CURRENT_FILE" "$TELEMETRY_DIR/archive/exec_$(date +%s).json"

# Metrics Histórico
if [ ! -f "$METRICS_FILE" ]; then echo '{"executions":[]}' > "$METRICS_FILE"; fi
jq -s '.[0].executions += [.[1]] | .[0]' "$METRICS_FILE" "$CURRENT_FILE" > "$METRICS_FILE.tmp" && mv "$METRICS_FILE.tmp" "$METRICS_FILE"

rm -f "$FILES_TRACKER" "$COMMANDS_TRACKER" "$TELEMETRY_DIR/success.txt"
echo "{}" > "$CURRENT_FILE"
echo "✅ Telemetria finalizada."
SCRIPT

# 5. Criar consolidate_workflow_report.sh
cat > .agent/scripts/consolidate_workflow_report.sh << 'SCRIPT'
#!/bin/bash
SNAPSHOT=".agent/telemetry/last_execution.json"
NAME="${1:-workflow}"
REPORT=".agent/reports/REPORT_${NAME}_$(date +%Y%m%d_%H%M%S).md"

if [ ! -f "$SNAPSHOT" ]; then echo "❌ Sem dados para report"; exit 1; fi

DUR=$(jq -r '.duration_seconds' "$SNAPSHOT")
FILES=$(jq -r '.files_created | length' "$SNAPSHOT")
STATUS=$(jq -r '.success' "$SNAPSHOT")

echo "# 📊 Report: $NAME" > "$REPORT"
echo "- Status: $STATUS" >> "$REPORT"
echo "- Duração: ${DUR}s" >> "$REPORT"
echo "- Arquivos: $FILES" >> "$REPORT"
echo "" >> "$REPORT"
echo "## Comandos Executados" >> "$REPORT"
echo "\`\`\`" >> "$REPORT"
jq -r '.commands_executed[]' "$SNAPSHOT" >> "$REPORT"
echo "\`\`\`" >> "$REPORT"
echo "✅ Report gerado: $REPORT"
SCRIPT

# 6. Permissões finais
chmod +x .agent/scripts/*.sh
echo "🎉 Ambiente configurado! Agora você pode rodar o Workflow 01."
