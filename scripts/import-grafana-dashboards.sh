#!/bin/bash

# Define Grafana URL and credentials (defaults)
GRAFANA_URL="${GRAFANA_URL:-http://localhost:3001}"
GRAFANA_USER="${GRAFANA_USER:-admin}"
GRAFANA_PASS="${GRAFANA_PASS:-admin}"

echo "🚀 Importando dashboards para Grafana..."

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DASHBOARD_DIR="$PROJECT_ROOT/monitoring/grafana/dashboards"

if [ ! -d "$DASHBOARD_DIR" ]; then
  echo "❌ Diretório de dashboards não encontrado: $DASHBOARD_DIR"
  exit 1
fi

for dashboard in "$DASHBOARD_DIR"/*.json; do
  if [ -f "$dashboard" ]; then
    echo "📊 Importando $(basename "$dashboard")..."
    
    # Wrap dashboard JSON in the expected API structure
    # jq is required for safe JSON manipulation, but we can try simple wrapping if jq isn't available
    # Assuming the file starts with {
    
    # Create a temporary file with the wrapped structure
    echo "{\"dashboard\": $(cat "$dashboard"), \"overwrite\": true}" > /tmp/dashboard_import.json
    
    # Import via API
    RESPONSE=$(curl -s -X POST \
      -H "Content-Type: application/json" \
      -u "$GRAFANA_USER:$GRAFANA_PASS" \
      -d @/tmp/dashboard_import.json \
      "$GRAFANA_URL/api/dashboards/db")
    
    if [[ $RESPONSE == *"success"* ]]; then
        echo "✅ $(basename "$dashboard") importado!"
    else
        echo "⚠️ Erro ao importar $(basename "$dashboard"): $RESPONSE"
    fi
    
    rm /tmp/dashboard_import.json
  fi
done

echo "🎉 Processo de importação finalizado!"
