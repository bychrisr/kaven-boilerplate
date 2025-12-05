# 📊 SISTEMA DE TELEMETRIA ANTIGRAVITY - GUIA COMPLETO

> **Versão:** 1.0.0  
> **Data:** 2025-12-04  
> **Autor:** Chris + Claude Sonnet 4.5  
> **Objetivo:** Sistema automático de coleta de métricas de execução de workflows

---

## 🎯 VISÃO GERAL

O Sistema de Telemetria coleta **automaticamente** métricas de CADA execução de workflow no Antigravity, salvando em arquivos JSON que podem ser:

1. ✅ **Versionados no Git** (histórico completo)
2. ✅ **Analisados localmente** (via scripts)
3. ✅ **Importados no brainOS** (dashboard de métricas)
4. ✅ **Compartilhados** (comparar produtividade)

**Nenhuma intervenção manual é necessária** - o sistema funciona de forma transparente.

---

## 📂 ESTRUTURA DE ARQUIVOS

```
seu-projeto/
├── .agent/
│   ├── workflows/
│   │   ├── create_component.md      # Workflow exemplo
│   │   ├── generate_tests.md        # Outro workflow
│   │   └── telemetry.md             # 🔍 Workflow de telemetria (NÃO CHAMAR MANUALMENTE)
│   │
│   └── telemetry/
│       ├── metrics.json              # 📊 ARQUIVO PRINCIPAL - todas as métricas
│       ├── current_execution.json   # ⏱️ Temporário (criado/deletado por execução)
│       └── archive/                 # 📦 Arquivos antigos (opcional)
│           ├── 2025-11.json
│           └── 2025-12.json
│
└── .gitignore
```

**Adicionar ao .gitignore:**
```
.agent/telemetry/current_execution.json
```

**Manter versionado:**
```
.agent/telemetry/metrics.json
```

---

## 🔧 SETUP INICIAL

### Passo 1: Criar Estrutura

```bash
# Na raiz do projeto
mkdir -p .agent/telemetry
mkdir -p .agent/telemetry/archive
```

### Passo 2: Criar Arquivo Inicial de Métricas

```bash
cat > .agent/telemetry/metrics.json << 'EOF'
{
  "version": "1.0.0",
  "project": {
    "name": "kaven-boilerplate",
    "path": "/home/user/projects/kaven-boilerplate",
    "created_at": "2025-12-04T00:00:00Z"
  },
  "executions": [],
  "summary": {
    "total_executions": 0,
    "total_duration_seconds": 0,
    "total_files_created": 0,
    "total_lines_of_code": 0,
    "avg_duration_seconds": 0,
    "success_rate": 0
  }
}
EOF
```

### Passo 3: Copiar Workflow de Telemetria

Copiar o arquivo `telemetry_workflow.md` para `.agent/workflows/telemetry.md`

### Passo 4: Atualizar .gitignore

```bash
echo ".agent/telemetry/current_execution.json" >> .gitignore
```

---

## 📝 COMO INSTRUMENTAR UM WORKFLOW

Para que um workflow colete métricas automaticamente, siga este padrão:

### Template de Workflow Instrumentado

```markdown
---
description: Create a new React component with telemetry
---

# STEP 0: INITIALIZE TELEMETRY (SEMPRE PRIMEIRO)

// turbo
echo '{
  "timestamp_start": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
  "workflow_name": "create_component",
  "task_description": "USER_INPUT_PLACEHOLDER",
  "files_created": [],
  "files_modified": [],
  "commands_executed": [],
  "success": true,
  "agent_mode": "fast"
}' > .agent/telemetry/current_execution.json

# STEP 1: Ask user for component name

Ask the user: "What is the component name?"
Store the answer as COMPONENT_NAME.

# STEP 2: Update telemetry with task description

// turbo
jq '.task_description = "Create '${COMPONENT_NAME}' component"' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json
mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

# STEP 3: Create component files

// turbo
mkdir -p src/components/${COMPONENT_NAME}

# Track command
jq '.commands_executed += ["mkdir -p src/components/'${COMPONENT_NAME}'"]' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json
mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

# Create files
cat > src/components/${COMPONENT_NAME}/${COMPONENT_NAME}.tsx << 'COMPONENT_EOF'
import React from 'react';
import styles from './${COMPONENT_NAME}.module.css';

export const ${COMPONENT_NAME}: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>${COMPONENT_NAME}</h1>
    </div>
  );
};
COMPONENT_EOF

# Track file created
jq '.files_created += ["src/components/'${COMPONENT_NAME}'/'${COMPONENT_NAME}'.tsx"]' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json
mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

# STEP 4: Create CSS file

cat > src/components/${COMPONENT_NAME}/${COMPONENT_NAME}.module.css << 'CSS_EOF'
.container {
  padding: 1rem;
}
CSS_EOF

jq '.files_created += ["src/components/'${COMPONENT_NAME}'/'${COMPONENT_NAME}'.module.css"]' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json
mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

# STEP 5: Export component

echo "export { ${COMPONENT_NAME} } from './${COMPONENT_NAME}/${COMPONENT_NAME}';" >> src/components/index.ts

jq '.files_modified += ["src/components/index.ts"]' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json
mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

# STEP 6: FINALIZE TELEMETRY (SEMPRE ÚLTIMO)

// turbo
node .agent/scripts/finalize_telemetry.js

# Ou se não tiver Node.js, use bash inline
// turbo
bash .agent/scripts/finalize_telemetry.sh
```

---

## 🔍 SCRIPTS DE FINALIZAÇÃO

### finalize_telemetry.js (Node.js - Recomendado)

```javascript
// .agent/scripts/finalize_telemetry.js
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

function calculateLinesOfCode(files) {
  let total = 0;
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      total += content.split('\n').length;
    } catch (e) {
      console.error(`Error reading ${file}:`, e.message);
    }
  }
  return total;
}

function estimateTokens(files) {
  let totalChars = 0;
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      totalChars += content.length;
    } catch (e) {
      console.error(`Error reading ${file}:`, e.message);
    }
  }
  return Math.ceil(totalChars / 4); // ~4 chars per token
}

try {
  // Read context
  const context = JSON.parse(fs.readFileSync('.agent/telemetry/current_execution.json', 'utf8'));
  
  // Read existing metrics
  const telemetry = JSON.parse(fs.readFileSync('.agent/telemetry/metrics.json', 'utf8'));
  
  // Calculate final metrics
  const allFiles = [...context.files_created, ...context.files_modified];
  const linesOfCode = calculateLinesOfCode(allFiles);
  const tokensEstimated = estimateTokens(allFiles);
  
  const now = new Date();
  const duration = (now - new Date(context.timestamp_start)) / 1000;
  
  const execution = {
    execution_id: uuidv4(),
    timestamp_start: context.timestamp_start,
    timestamp_end: now.toISOString(),
    duration_seconds: Math.round(duration * 100) / 100,
    workflow_name: context.workflow_name,
    task_description: context.task_description,
    files_created: context.files_created,
    files_modified: context.files_modified,
    commands_executed: context.commands_executed,
    lines_of_code: linesOfCode,
    tokens_used_estimated: tokensEstimated,
    success: context.success !== false,
    error_message: context.error_message || null,
    user_feedback: null,
    metadata: {
      model: 'gemini-3-pro',
      agent_mode: context.agent_mode || 'fast',
      project_name: telemetry.project.name,
      git_branch: process.env.GIT_BRANCH || null
    }
  };
  
  // Append execution
  telemetry.executions.push(execution);
  
  // Recalculate summary
  const totalExecs = telemetry.executions.length;
  const successfulExecs = telemetry.executions.filter(e => e.success).length;
  
  telemetry.summary = {
    total_executions: totalExecs,
    total_duration_seconds: telemetry.executions.reduce((sum, e) => sum + e.duration_seconds, 0),
    total_files_created: telemetry.executions.reduce((sum, e) => sum + e.files_created.length, 0),
    total_lines_of_code: telemetry.executions.reduce((sum, e) => sum + e.lines_of_code, 0),
    avg_duration_seconds: Math.round((telemetry.executions.reduce((sum, e) => sum + e.duration_seconds, 0) / totalExecs) * 100) / 100,
    success_rate: Math.round((successfulExecs / totalExecs) * 100) / 100
  };
  
  // Save metrics
  fs.writeFileSync('.agent/telemetry/metrics.json', JSON.stringify(telemetry, null, 2));
  
  // Delete temp file
  fs.unlinkSync('.agent/telemetry/current_execution.json');
  
  // Report
  console.log(`✅ Task completed in ${execution.duration_seconds}s`);
  console.log(`   Files created: ${execution.files_created.length}`);
  console.log(`   Lines of code: ${execution.lines_of_code}`);
  console.log(`   Total executions: ${totalExecs}`);
  
} catch (error) {
  console.error('❌ Telemetry error:', error.message);
  process.exit(1);
}
```

### finalize_telemetry.sh (Bash - Alternativa)

```bash
#!/bin/bash
# .agent/scripts/finalize_telemetry.sh

set -e

# Read context
CONTEXT_FILE=".agent/telemetry/current_execution.json"
METRICS_FILE=".agent/telemetry/metrics.json"

if [ ! -f "$CONTEXT_FILE" ]; then
  echo "❌ No current execution context found"
  exit 1
fi

# Calculate lines of code
calculate_loc() {
  local files=$1
  local total=0
  
  echo "$files" | jq -r '.[]' | while read -r file; do
    if [ -f "$file" ]; then
      lines=$(wc -l < "$file")
      total=$((total + lines))
    fi
  done
  
  echo $total
}

# Generate UUID (simple version)
generate_uuid() {
  cat /proc/sys/kernel/random/uuid 2>/dev/null || uuidgen 2>/dev/null || echo "$(date +%s)-$RANDOM"
}

# Get timestamp
TIMESTAMP_END=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Read context
TIMESTAMP_START=$(jq -r '.timestamp_start' "$CONTEXT_FILE")
WORKFLOW_NAME=$(jq -r '.workflow_name' "$CONTEXT_FILE")
TASK_DESC=$(jq -r '.task_description' "$CONTEXT_FILE")
FILES_CREATED=$(jq -c '.files_created' "$CONTEXT_FILE")
FILES_MODIFIED=$(jq -c '.files_modified' "$CONTEXT_FILE")
COMMANDS=$(jq -c '.commands_executed' "$CONTEXT_FILE")

# Calculate duration (simplified - requires date command with +%s support)
START_EPOCH=$(date -d "$TIMESTAMP_START" +%s 2>/dev/null || echo 0)
END_EPOCH=$(date -d "$TIMESTAMP_END" +%s 2>/dev/null || echo 0)
DURATION=$((END_EPOCH - START_EPOCH))

# Calculate LOC (simplified)
LOC=$(echo "$FILES_CREATED" | jq -r '.[]' | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo 0)

# Generate execution object
EXECUTION_ID=$(generate_uuid)

NEW_EXECUTION=$(jq -n \
  --arg id "$EXECUTION_ID" \
  --arg ts_start "$TIMESTAMP_START" \
  --arg ts_end "$TIMESTAMP_END" \
  --arg duration "$DURATION" \
  --arg workflow "$WORKFLOW_NAME" \
  --arg task "$TASK_DESC" \
  --argjson files_created "$FILES_CREATED" \
  --argjson files_modified "$FILES_MODIFIED" \
  --argjson commands "$COMMANDS" \
  --arg loc "$LOC" \
  '{
    execution_id: $id,
    timestamp_start: $ts_start,
    timestamp_end: $ts_end,
    duration_seconds: ($duration | tonumber),
    workflow_name: $workflow,
    task_description: $task,
    files_created: $files_created,
    files_modified: $files_modified,
    commands_executed: $commands,
    lines_of_code: ($loc | tonumber),
    tokens_used_estimated: (($loc | tonumber) * 25),
    success: true,
    error_message: null,
    user_feedback: null,
    metadata: {
      model: "gemini-3-pro",
      agent_mode: "fast",
      project_name: "kaven-boilerplate"
    }
  }')

# Append to metrics
jq ".executions += [$NEW_EXECUTION]" "$METRICS_FILE" > "$METRICS_FILE.tmp"
mv "$METRICS_FILE.tmp" "$METRICS_FILE"

# Recalculate summary
jq '.summary = {
  total_executions: (.executions | length),
  total_duration_seconds: ([.executions[].duration_seconds] | add),
  total_files_created: ([.executions[].files_created | length] | add),
  total_lines_of_code: ([.executions[].lines_of_code] | add),
  avg_duration_seconds: (([.executions[].duration_seconds] | add) / (.executions | length)),
  success_rate: (([.executions[] | select(.success) | 1] | add) / (.executions | length))
}' "$METRICS_FILE" > "$METRICS_FILE.tmp"
mv "$METRICS_FILE.tmp" "$METRICS_FILE"

# Cleanup
rm "$CONTEXT_FILE"

# Report
echo "✅ Task completed in ${DURATION}s"
echo "   Files created: $(echo "$FILES_CREATED" | jq 'length')"
echo "   Lines of code: $LOC"
```

---

## 📊 ANÁLISE DE MÉTRICAS

### Comandos Úteis (jq)

**Ver todas execuções:**
```bash
cat .agent/telemetry/metrics.json | jq '.executions'
```

**Ver summary:**
```bash
cat .agent/telemetry/metrics.json | jq '.summary'
```

**Últimas 10 execuções:**
```bash
cat .agent/telemetry/metrics.json | jq '.executions | .[-10:]'
```

**Execuções por workflow:**
```bash
cat .agent/telemetry/metrics.json | jq '
  .executions 
  | group_by(.workflow_name) 
  | map({
      workflow: .[0].workflow_name, 
      count: length,
      avg_duration: ([.[].duration_seconds] | add / length),
      total_files: ([.[].files_created | length] | add)
    })
'
```

**Workflows mais lentos:**
```bash
cat .agent/telemetry/metrics.json | jq '
  .executions 
  | sort_by(.duration_seconds) 
  | reverse 
  | .[:5] 
  | .[] 
  | {workflow: .workflow_name, duration: .duration_seconds, task: .task_description}
'
```

**Taxa de sucesso por workflow:**
```bash
cat .agent/telemetry/metrics.json | jq '
  .executions 
  | group_by(.workflow_name) 
  | map({
      workflow: .[0].workflow_name,
      success_rate: ([.[] | select(.success) | 1] | add) / length
    })
'
```

### Script Python para Análise Avançada

```python
# .agent/scripts/analyze_metrics.py
import json
from datetime import datetime
from collections import defaultdict

with open('.agent/telemetry/metrics.json', 'r') as f:
    data = json.load(f)

executions = data['executions']

# Group by workflow
by_workflow = defaultdict(list)
for exec in executions:
    by_workflow[exec['workflow_name']].append(exec)

print("📊 WORKFLOW STATISTICS\n")
print(f"{'Workflow':<30} {'Count':<8} {'Avg Time':<12} {'Total LOC':<12} {'Success Rate'}")
print("-" * 90)

for workflow, execs in sorted(by_workflow.items(), key=lambda x: len(x[1]), reverse=True):
    count = len(execs)
    avg_time = sum(e['duration_seconds'] for e in execs) / count
    total_loc = sum(e['lines_of_code'] for e in execs)
    success_rate = sum(1 for e in execs if e['success']) / count
    
    print(f"{workflow:<30} {count:<8} {avg_time:<12.1f}s {total_loc:<12} {success_rate:.1%}")

print(f"\n\n📈 OVERALL SUMMARY")
print(f"Total executions: {data['summary']['total_executions']}")
print(f"Total duration: {data['summary']['total_duration_seconds']:.1f}s ({data['summary']['total_duration_seconds']/3600:.1f}h)")
print(f"Total files created: {data['summary']['total_files_created']}")
print(f"Total lines of code: {data['summary']['total_lines_of_code']:,}")
print(f"Average duration: {data['summary']['avg_duration_seconds']:.1f}s")
print(f"Success rate: {data['summary']['success_rate']:.1%}")
```

**Executar:**
```bash
python .agent/scripts/analyze_metrics.py
```

---

## 🔄 ARQUIVAMENTO MENSAL (Opcional)

Para manter o arquivo `metrics.json` leve, você pode arquivar mensalmente:

```bash
# .agent/scripts/archive_metrics.sh
#!/bin/bash

METRICS_FILE=".agent/telemetry/metrics.json"
ARCHIVE_DIR=".agent/telemetry/archive"
CURRENT_MONTH=$(date +%Y-%m)

# Backup completo
cp "$METRICS_FILE" "$ARCHIVE_DIR/$CURRENT_MONTH.json"

# Resetar metrics.json mantendo só últimos 30 dias
jq --arg cutoff "$(date -d '30 days ago' -u +%Y-%m-%dT%H:%M:%SZ)" '
  .executions = [.executions[] | select(.timestamp_start > $cutoff)]
  | .summary = {
      total_executions: (.executions | length),
      total_duration_seconds: ([.executions[].duration_seconds] | add // 0),
      total_files_created: ([.executions[].files_created | length] | add // 0),
      total_lines_of_code: ([.executions[].lines_of_code] | add // 0),
      avg_duration_seconds: (([.executions[].duration_seconds] | add // 0) / (.executions | length)),
      success_rate: (([.executions[] | select(.success) | 1] | add // 0) / (.executions | length))
    }
' "$METRICS_FILE" > "$METRICS_FILE.tmp"
mv "$METRICS_FILE.tmp" "$METRICS_FILE"

echo "✅ Metrics archived to $ARCHIVE_DIR/$CURRENT_MONTH.json"
echo "   Keeping last 30 days in metrics.json"
```

**Agendar (cron):**
```bash
# Executar no dia 1 de cada mês
0 0 1 * * cd /path/to/project && bash .agent/scripts/archive_metrics.sh
```

---

## 🚀 INTEGRAÇÃO COM brainOS

No futuro, você pode importar os JSONs no brainOS:

**API Endpoint (exemplo):**
```typescript
POST /api/projects/metrics/import
Body: {
  project_id: "uuid",
  metrics_file: <file upload>
}

// Ou via URL
POST /api/projects/metrics/import-url
Body: {
  project_id: "uuid",
  metrics_url: "https://raw.githubusercontent.com/user/repo/main/.agent/telemetry/metrics.json"
}
```

**Dashboard brainOS:**
- Comparar projetos (qual teve mais linhas geradas?)
- Timeline de produtividade
- Workflows mais usados
- Taxa de sucesso por projeto
- Tempo médio por tipo de task

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Criar estrutura `.agent/telemetry/`
- [ ] Criar arquivo inicial `metrics.json`
- [ ] Copiar workflow `telemetry.md` para `.agent/workflows/`
- [ ] Criar scripts `finalize_telemetry.js` ou `.sh`
- [ ] Atualizar `.gitignore`
- [ ] Instrumentar workflows existentes
- [ ] Testar execução completa
- [ ] Verificar `metrics.json` atualizado
- [ ] (Opcional) Setup arquivamento mensal
- [ ] (Opcional) Criar scripts de análise

---

## 🎓 EXEMPLOS PRÁTICOS

Ver arquivo `telemetry_example_workflow.md` para exemplo completo de workflow instrumentado.

---

## 🐛 TROUBLESHOOTING

**Problema:** `current_execution.json` não é criado

**Solução:** Verificar se o Step 0 está executando com `// turbo`

---

**Problema:** `metrics.json` não atualiza

**Solução:** 
1. Verificar se `finalize_telemetry.js` está no lugar certo
2. Executar manualmente: `node .agent/scripts/finalize_telemetry.js`
3. Verificar erros no console

---

**Problema:** LOC sempre 0

**Solução:** Verificar se arquivos criados existem e paths estão corretos no `current_execution.json`

---

## 📚 REFERÊNCIAS

- [Antigravity Workflows Guide](https://antigravity.codes/blog/workflows)
- [jq Manual](https://stedolan.github.io/jq/manual/)
- [UUID v4 Spec](https://datatracker.ietf.org/doc/html/rfc4122)

---

**Sistema criado por:** Chris + Claude Sonnet 4.5  
**Data:** 2025-12-04  
**Versão:** 1.0.0
