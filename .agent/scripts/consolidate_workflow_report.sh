#!/bin/bash
SNAPSHOT=".agent/telemetry/last_execution.json"
NAME="${1:-workflow}"
REPORT=".agent/reports/REPORT_${NAME}_$(date +%Y%m%d_%H%M%S).md"

if [ ! -f "$SNAPSHOT" ]; then echo "❌ Sem dados"; exit 1; fi

DUR=$(jq -r '.duration_seconds' "$SNAPSHOT")
FILES=$(jq -r '.files_created | length' "$SNAPSHOT")
STATUS=$(jq -r '.success' "$SNAPSHOT")

echo "# 📊 Report: $NAME" > "$REPORT"
echo "- Status: $STATUS" >> "$REPORT"
echo "- Duração: ${DUR}s" >> "$REPORT"
echo "- Arquivos Criados: $FILES" >> "$REPORT"
echo "" >> "$REPORT"
echo "## Comandos" >> "$REPORT"
echo "\`\`\`" >> "$REPORT"
jq -r '.commands_executed[]' "$SNAPSHOT" >> "$REPORT"
echo "\`\`\`" >> "$REPORT"
echo "✅ Report: $REPORT"
