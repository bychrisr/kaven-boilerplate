# Telemetry System Quick Start

## View Metrics

```bash
# Summary
cat metrics.json | jq '.summary'

# Last execution
cat metrics.json | jq '.executions[-1]'

# Analysis
python ../scripts/analyze_metrics.py
```

## How It Works

1. Workflow starts → creates current_execution.json
2. Workflow tracks files/commands → updates current_execution.json
3. Workflow ends → finalize_telemetry.js consolidates metrics.json

## Files

- `metrics.json` - Main file (commit to git)
- `current_execution.json` - Temporary (ignored by git)
- `archive/` - Old metrics (optional)

See `/docs/TELEMETRY.md` for full documentation.
