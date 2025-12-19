# 🤖 Kaven Agent System

O Kaven Boilerplate inclui um poderoso ecossistema de automação localizado na pasta `.agent`. Este sistema é responsável por padronizar processos, garantir a saúde da infraestrutura e gerar relatórios detalhados de execução.

## 📂 Estrutura do Sistema

```
.agent/
├── workflows/         # 📝 Guias de execução passo-a-passo (.md)
├── scripts/           # ⚙️ Automação (Shell/Python/Node)
├── telemetry/         # 📊 Dados de execução e monitoramento
└── reports/           # 📑 Relatórios legíveis para humanos
```

## 🚀 Componentes Principais

### 1. Workflows (`/workflows`)

Processos documentados e automatizáveis. O agente lê esses arquivos para saber exatamente como executar tarefas complexas (setup, deploy, migrations).

- [Guia de Workflows](./workflows.md)

### 2. Telemetria v2.1 (`/telemetry` & `/reports`)

Sistema avançado de rastreamento que registra cada comando executado, arquivo criado e o tempo de execução. Gera relatórios visuais com diagramas e insights.

- [Documentação da Telemetria](./telemetry.md)

### 3. Smart Docker Doctor v3.0 (`/scripts/docker_doctor.py`)

Um "médico" autônomo que monitora seus containers. Ele não apenas reinicia serviços falhos, mas analisa logs para entender o erro e aplicar a correção cirúrgica correta.

- [Entenda o Smart Doctor](./docker-doctor.md)

## ⚡ Quick Start

Para rodar um workflow e ver o sistema em ação:

```bash
# Exemplo: Rodar o setup do projeto
antigravity run .agent/workflows/01-project-setup.md
```

Ao final, você receberá um link para o relatório de execução:
`✅ Report generated successfully at .agent/reports/WORKFLOW_REPORT_...md`
