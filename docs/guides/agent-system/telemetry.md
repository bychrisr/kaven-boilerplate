# 📊 Telemetria v2.1

O sistema de telemetria do Kaven foi projetado para garantir observabilidade total sobre as ações do agente e da infraestrutura.

## 🏗️ Arquitetura

O fluxo de dados segue este pipeline:

1.  **Captura (`init_telemetry.sh`):** Inicia uma sessão de rastreamento.
2.  **Tracking (`utils.sh`):** O wrapper `execute()` intercepta comandos e registra sucesso/falha.
3.  **Consolidação (`finalize_telemetry.sh`):** Compila dados de arquivos criados, duração e logs.
4.  **Report (`consolidate_workflow_report.sh`):** Gera um documento Markdown rico para consumo humano.

## 📁 Persistência de Dados

O sistema garante histórico sem sobrescrita através de duas estratégias:

### 1. Dados Brutos (`.agent/telemetry/archive/`)

Cada execução gera um arquivo JSON imutável com timestamp:
`exec_1766102345.json`

### 2. Histórico Agregado (`.agent/telemetry/metrics.json`)

Um arquivo JSON único que acumula todas as execuções em um array, permitindo análise estatística futura (ex: tempo médio de build).

### 3. Relatórios (`.agent/reports/`)

Documentos Markdown gerados por execução: `WORKFLOW_REPORT_<nome>_<data>.md`.

## 📑 Recursos do Relatório

Os relatórios gerados (v2.1) incluem:

- **Diagramas Mermaid:** Visualização gráfica do status dos containers.
- **Auto-Diagnostics:** Se um container falhar, os logs de erro são injetados automaticamente no relatório.
- **Links Inteligentes:** Links **relativos** para os arquivos (`../../path`), garantindo que funcionem em qualquer máquina que clonar o projeto.
- **AI Validation:** Se um arquivo `.agent/telemetry/walkthrough.md` existir, seu conteúdo é injetado automaticamente como uma seção de insights no relatório final.
- **KPIs:** Duração, Files Created, LOC (Lines of Code).

> **Nota:** Por padrão, os relatórios em `.agent/reports/` são adicionados ao `.gitignore` para não poluir o repositório, mas podem ser compartilhados se necessário.

## 🛠️ Comandos Úteis

### Gerar relatório manualmente

Se você rodou um workflow mas quer regenerar o relatório:

```bash
.agent/scripts/consolidate_workflow_report.sh "nome-do-workflow"
```

### Resetar telemetria (Cuidado)

Para limpar todo o histórico local:

```bash
rm -rf .agent/telemetry/*
rm -rf .agent/reports/*
```
