# 📝 Workflows

Workflows são o coração da automação no Kaven. Eles são arquivos Markdown que descrevem, passo a passo, como realizar uma tarefa complexa. O agente lê esses arquivos e executa os comandos neles contidos.

## 📂 Localização

Todos os workflows devem residir em `.agent/workflows/`.

## 🏗️ Estrutura do Arquivo

Um workflow válido deve ter:

1.  **Frontmatter YAML:** Metadados sobre o workflow.
2.  **Steps:** Passos numerados ou seções claras.
3.  **Blocos de Código:** Comandos bash para execução.

### Exemplo Base

```markdown
---
description: Configuração inicial do ambiente
---

# Passo 1: Instalar deps

\`\`\`bash
source .agent/scripts/utils.sh
execute "pnpm install"
\`\`\`

# Passo 2: Validar

\`\`\`bash
execute "pnpm test"
\`\`\`
```

## 🪝 Hooks e Utilitários

Sempre inicie seus scripts importando os utilitários:
`source .agent/scripts/utils.sh`

Isso libera o comando `execute "comando"`, que é vital para a telemetria.

- **Sem `execute`:** O comando roda, mas não é registrado no relatório final.
- **Com `execute`:** O comando é logado, cronometrado e aparece no report.

## 💡 Melhores Práticas

1.  **Idempotência:** Escreva scripts que podem rodar múltiplas vezes sem quebrar o ambiente.
    - Ruim: `mkdir pasta` (falha se já existir)
    - Bom: `mkdir -p pasta`
2.  **Limpeza:** Se criar arquivos temporários, remova-os ao final.
3.  **Auto-Docs:** Use comentários no shell script, eles ajudam quem lê o workflow manualmente.
4.  **Doctor:** Sempre inclua uma chamada ao `docker_doctor.py` se seu workflow subir containers.
