---
description: Documentation Generator
---

# WORKFLOW: Documentation Generator

> **Versão:** 1.0.0  
> **Data:** 2025-01-06  
> **Autor:** Chris + Claude Sonnet 4.5  
> **Status:** Production Ready  
> **Propósito:** Gera documentação Nextra MDX automaticamente após implementação de features

---

## 1. Workflow Metadata

**ID:** `document`  
**Nome:** Documentation Generator  
**Categoria:** Post-Implementation  
**Executor:** Antigravity Agent (Autonomous)  
**Estimativa:** 5-10 minutos  

**Triggers:**
- Feature completamente implementada
- Código-fonte disponível no contexto do chat
- Usuário solicita geração de documentação

**Dependencies:**
- Código TypeScript implementado
- Estrutura Nextra configurada em `apps/docs/`
- `_meta.js` existente nas pastas design-system ou platform

---

## 2. Purpose & Scope

### Propósito
Automatizar 100% da criação de documentação técnica no formato Nextra MDX para features implementadas, eliminando trabalho manual e garantindo consistência.

### Escopo Incluído
- ✅ Análise automática de código-fonte TypeScript
- ✅ Extração de JSDoc/TSDoc para API reference
- ✅ Geração de exemplos baseados em código real
- ✅ Criação de arquivo `.mdx` completo
- ✅ Atualização estratégica de `_meta.js`
- ✅ Validação de sintaxe MDX
- ✅ Telemetria completa de execução
- ✅ Adaptação de estrutura por tipo de feature

### Escopo Excluído
- ❌ Documentação de conceitos (guides, tutorials)
- ❌ Documentação de arquitetura geral
- ❌ Changelog de projeto (use CHANGELOG.md)
- ❌ READMEs de repositório
- ❌ Documentação de API externa (fora do projeto)

---

## 3. Prerequisites

### Arquivos Necessários
```
apps/docs/content/
├── design-system/
│   └── _meta.js (para UI components)
└── platform/
    └── _meta.js (para features backend/completas)
```

### Contexto Requerido
- **Código-fonte implementado** disponível no chat
- **Nome da feature** definido pelo usuário
- **Tipo de feature** identificável (component, api, service, etc)

### Validações Pré-Execução
```typescript
// O workflow valida automaticamente:
- Contexto contém código TypeScript? ✓
- `apps/docs/content/` existe? ✓
- `_meta.js` existe na seção apropriada? ✓
```

---

## 4. Input Specification

### Input do Usuário
```typescript
interface DocumentationInput {
  feature_name: string;           // Ex: "Payment System", "Button Component"
  context?: string;               // Contexto adicional opcional
  force_type?: 'design-system' | 'platform'; // Override de tipo
}
```

### Exemplo de Invocação
```
Usuário: "Gera documentação para o Payment System com PIX"

Agent: [inicia workflow document.md automaticamente]
```

### Input Implícito (do Contexto)
- Arquivos TypeScript no chat history
- Estrutura de pastas do projeto
- Código de testes (se houver)
- Comentários JSDoc/TSDoc

---

## 5. Output Specification

### Arquivos Gerados

#### 1. Arquivo MDX Principal
```
apps/docs/content/{type}/{feature-slug}.mdx

Estrutura:
---
title: Feature Name
description: Auto-gerada do código
date: YYYY-MM-DD
author: Chris + Claude Sonnet 4.5
version: 1.0.0
tags: [auto, geradas]
---

# Feature Name

[8-12 seções baseadas no tipo]
```

#### 2. Meta File Atualizado
```javascript
// apps/docs/content/{type}/_meta.js
export default {
  // ... entradas existentes
  'feature-slug': 'Feature Name', // ← NOVA ENTRADA
};
```

### Relatório de Telemetria
```markdown
# 📊 Documentation Generation Report

## Feature: [nome]
- Tipo: [design-system/platform]
- Arquivo: apps/docs/content/[path]/[file].mdx

## Métricas
- Arquivos analisados: X
- Seções geradas: X
- Code blocks: X
- Tempo total: Xs

## Status: ✅ SUCCESS
```

---

## 6. Implementation Steps

### Phase 0: Telemetry Initialization

```typescript
// Inicializar tracking
const telemetry = {
  workflow_id: crypto.randomUUID(),
  workflow_name: 'document',
  start_time: new Date().toISOString(),
  feature_name: input.feature_name,
  phases: {}
};

// Salvar em .agent/telemetry/document_[timestamp].json
```

**Output Phase 0:**
- ✅ `workflow_id` gerado
- ✅ Timestamp inicial registrado
- ✅ Feature name capturado

---

### Phase 1: Code Analysis & Context Gathering

**Objetivo:** Analisar código-fonte e extrair informações técnicas.

#### Step 1.1: Identificar Tipo de Feature
```typescript
// Analisar arquivos no contexto
const filePatterns = {
  component: /\.(tsx|jsx)$/ && /components?/i,
  api: /\.(ts)$/ && /(router|controller|api)/i,
  service: /\.(ts)$/ && /service/i,
  feature: /multiple files/
};

// Determinar classificação
const docType = isUIComponent ? 'design-system' : 'platform';
```

#### Step 1.2: Extrair Informações Técnicas
```typescript
// Parsear código TypeScript (mentalmente)
const extracted = {
  jsdoc_comments: [],      // /** ... */
  type_definitions: [],    // interface, type, enum
  exported_functions: [],  // export function/const
  dependencies: [],        // import statements
  usage_examples: [],      // Exemplos no próprio código
  test_cases: []          // Se houver testes
};
```

#### Step 1.3: Mapear Estrutura de Arquivos
```typescript
const fileStructure = {
  main_files: ['payment.service.ts', 'pix.controller.ts'],
  related_files: ['payment.types.ts', 'webhooks.ts'],
  config_files: ['.env.example'],
  test_files: ['payment.test.ts']
};
```

**Telemetry Phase 1:**
```json
{
  "phase_1": {
    "files_analyzed": 4,
    "types_extracted": 12,
    "examples_found": 6,
    "doc_type": "platform",
    "duration_seconds": 8
  }
}
```

**Checkpoint:** Análise completa, pronto para gerar estrutura

---

### Phase 2: Documentation Structure Planning

**Objetivo:** Decidir estrutura ideal baseada no tipo de feature.

#### Step 2.1: Estrutura Base

**Para Components (Design System):**
```markdown
# Component Name

> Descrição breve

## Overview
## Variants
## Props
## Usage Examples
## Accessibility
## API Reference
## Related Components
```

**Para Features (Platform):**
```markdown
# Feature Name

> Descrição breve

## Visão Geral
## Como Funciona
## Fluxo Técnico (Mermaid diagram se complexo)
## Exemplos de Uso
## API Reference
## Configuração
## Troubleshooting
## Relacionados
```

#### Step 2.2: Adaptações Necessárias
```typescript
// Decidir seções extras baseado em análise
const customSections = [];

if (hasWebhooks) customSections.push('Webhooks');
if (hasScheduledJobs) customSections.push('Background Jobs');
if (hasComplexFlow) customSections.push('Sequence Diagram');
```

**Telemetry Phase 2:**
```json
{
  "phase_2": {
    "base_structure": "platform_feature",
    "custom_sections": ["Webhooks"],
    "diagrams_needed": true,
    "total_sections": 9
  }
}
```

**Checkpoint:** Estrutura definida, pronto para gerar conteúdo

---

### Phase 3: Content Generation

**Objetivo:** Gerar todo o conteúdo MDX seção por seção.

#### Step 3.1: Gerar Frontmatter
```yaml
---
title: Payment System
description: Sistema completo de pagamentos PIX via PagueBit com webhooks e reconciliação automática
date: 2025-01-06
author: Chris + Claude Sonnet 4.5
version: 1.0.0
tags: [payments, pix, paguebit, webhooks, saas]
---
```

#### Step 3.2: Gerar Seções Sequencialmente

**Exemplo: Seção "Visão Geral"**
```markdown
## Visão Geral

O Payment System é uma integração completa com PagueBit para processar pagamentos PIX. 
Suporta criação de QR Codes dinâmicos, webhooks em tempo real e reconciliação automática 
de pagamentos.

**Principais Features:**
- ✅ Geração de QR Code PIX
- ✅ Webhooks de confirmação
- ✅ Retry automático em falhas
- ✅ Logs detalhados de transações
```

**Exemplo: Seção "API Reference"**
```markdown
## API Reference

### `createPixPayment(params)`

Cria um novo pagamento PIX e retorna QR Code.

**Parâmetros:**
- `amount` (number) - Valor em centavos
- `description` (string) - Descrição do pagamento
- `customerId` (string) - ID do cliente

**Retorna:** `Promise<PixPaymentResponse>`

**Exemplo:**
\`\`\`typescript
const payment = await paymentService.createPixPayment({
  amount: 10000, // R$ 100,00
  description: 'Assinatura Premium',
  customerId: 'user_123'
});

console.log(payment.qrCode); // QR Code string
console.log(payment.expiresAt); // Data de expiração
\`\`\`

**Erros Possíveis:**
- `INVALID_AMOUNT` - Valor inválido (< R$ 0,01)
- `CUSTOMER_NOT_FOUND` - Cliente não existe
- `PAGUEBIT_ERROR` - Erro na API externa
```

#### Step 3.3: Gerar Code Blocks Automaticamente
```typescript
// Extrair exemplos REAIS do código analisado
const codeExamples = extractFromSource({
  type: 'usage_example',
  filter: 'realistic',
  language: 'typescript'
});

// Gerar block com syntax highlighting
const codeBlock = `
\`\`\`typescript
${codeExamples[0]}
\`\`\`
`;
```

#### Step 3.4: Adicionar Callouts Estratégicos
```markdown
> [!IMPORTANT]
> Configure a variável `PAGUEBIT_WEBHOOK_SECRET` antes de usar webhooks.

> [!TIP]
> Use `retryFailedPayments()` para reprocessar pagamentos que falharam.

> [!WARNING]
> Webhooks podem ser recebidos múltiplas vezes. Implemente idempotência.
```

**Telemetry Phase 3:**
```json
{
  "phase_3": {
    "sections_generated": 9,
    "code_blocks": 12,
    "api_methods_documented": 6,
    "callouts_added": 4,
    "duration_seconds": 35
  }
}
```

**Checkpoint:** Conteúdo completo gerado

---

### Phase 4: Meta File Update

**Objetivo:** Adicionar entrada no `_meta.js` apropriado.

#### Step 4.1: Determinar Localização
```typescript
const metaPath = docType === 'design-system' 
  ? 'apps/docs/content/design-system/_meta.js'
  : 'apps/docs/content/platform/_meta.js';
```

#### Step 4.2: Analisar Estrutura Existente
```javascript
// Ler _meta.js atual
const currentMeta = {
  '---core': {
    type: 'separator',
    title: '🔐 Core Features',
  },
  authentication: 'Authentication',
  authorization: 'Authorization',
};
```

#### Step 4.3: Determinar Posição Estratégica
```typescript
// Decidir onde inserir baseado em:
// 1. Categoria existente relacionada
// 2. Ordem alfabética dentro da categoria
// 3. Criar nova categoria se necessário

const newEntry = {
  '---payments': {  // Nova categoria
    type: 'separator',
    title: '💳 Payments',
  },
  'payment-system': 'Payment System'  // Nova entrada
};
```

#### Step 4.4: Gerar Código Atualizado
```javascript
// apps/docs/content/platform/_meta.js
export default {
  '---core': {
    type: 'separator',
    title: '🔐 Core Features',
  },
  authentication: 'Authentication',
  authorization: 'Authorization',
  
  '---payments': {
    type: 'separator',
    title: '💳 Payments',
  },
  'payment-system': 'Payment System',  // ← ADICIONADO
};
```

**Telemetry Phase 4:**
```json
{
  "phase_4": {
    "meta_file_path": "apps/docs/content/platform/_meta.js",
    "insertion_position": 7,
    "new_category_created": true,
    "category_name": "Payments"
  }
}
```

**Checkpoint:** Meta file atualizado

---

### Phase 5: File Creation & Validation

**Objetivo:** Criar arquivo `.mdx` e validar sintaxe.

#### Step 5.1: Criar Arquivo MDX
```typescript
const mdxContent = `
${frontmatter}

${section1}
${section2}
...
${sectionN}
`;

const filePath = `apps/docs/content/${docType}/${featureSlug}.mdx`;

// Criar arquivo
fs.writeFileSync(filePath, mdxContent);
```

#### Step 5.2: Validação Automática (Mental)
```typescript
// Simular validações sem executar bash
const validations = {
  frontmatter_valid: checkYAML(frontmatter),
  h1_unique: countH1(mdxContent) === 1,
  code_blocks_closed: checkCodeBlocks(mdxContent),
  links_valid: checkInternalLinks(mdxContent),
  mdx_syntax: parseMDX(mdxContent)
};

const allPassed = Object.values(validations).every(v => v === true);
```

#### Step 5.3: Gerar Checklist de Qualidade
```markdown
## Checklist de Qualidade

- ✅ Frontmatter completo (title, description, date, author, version)
- ✅ Título H1 único
- ✅ Seções organizadas (H2, H3 hierárquico)
- ✅ 12 code blocks com syntax highlighting
- ✅ Exemplos extraídos de código real
- ✅ API reference com 6 métodos documentados
- ✅ Links internos válidos (2 relacionados)
- ✅ 4 callouts estratégicos
- ✅ Seção "Relacionados" presente
- ✅ Entrada adicionada ao _meta.js
- ✅ Sintaxe MDX válida

## Warnings
- ⚠️ Nenhum
```

**Telemetry Phase 5:**
```json
{
  "phase_5": {
    "mdx_file_path": "apps/docs/content/platform/payment-system.mdx",
    "file_size_bytes": 8456,
    "validation_passed": true,
    "warnings": [],
    "checklist_items": 11,
    "checklist_passed": 11,
    "duration_seconds": 5
  }
}
```

**Checkpoint:** Arquivos criados e validados

---

### Phase 6: Telemetry Consolidation & Report

**Objetivo:** Consolidar todas as métricas e gerar relatório final.

#### Step 6.1: Consolidar Métricas
```typescript
const totalMetrics = {
  total_files_analyzed: telemetry.phase_1.files_analyzed,
  total_sections_generated: telemetry.phase_3.sections_generated,
  total_code_blocks: telemetry.phase_3.code_blocks,
  total_duration_seconds: calculateTotalDuration(telemetry),
  validation_passed: telemetry.phase_5.validation_passed,
  warnings: telemetry.phase_5.warnings
};
```

#### Step 6.2: Gerar Relatório Final
```markdown
# 📊 Documentation Generation Report

## Feature Documentada
- **Nome:** Payment System
- **Tipo:** platform
- **Arquivo:** `apps/docs/content/platform/payment-system.mdx`
- **Status:** ✅ SUCCESS

## Métricas de Execução
- **Arquivos analisados:** 4
- **Seções geradas:** 9
- **Code blocks:** 12
- **API methods:** 6
- **Tempo total:** 53s

## Arquivos Criados/Modificados
1. ✅ `apps/docs/content/platform/payment-system.mdx` (8.5KB)
2. ✅ `apps/docs/content/platform/_meta.js` (atualizado)

## Validação Automática
- ✅ Frontmatter válido
- ✅ Estrutura MDX correta
- ✅ Links internos válidos
- ✅ Code blocks fechados
- ✅ Hierarquia de headers correta
- ⚠️ 0 warnings

## Próximos Passos
1. [ ] Revisar conteúdo gerado
2. [ ] Testar localmente: `pnpm --filter docs dev`
3. [ ] Build final: `pnpm --filter docs build`
4. [ ] Commit: `git commit -m "docs: add payment-system documentation"`

## Melhorias Sugeridas
- Considere adicionar diagramas Mermaid para fluxo de webhooks
- Documente error codes em tabela para referência rápida
- Adicione exemplo de retry logic para falhas de pagamento

---

**Workflow:** document.md v1.0.0  
**Execution ID:** ${workflow_id}  
**Timestamp:** ${new Date().toISOString()}
```

#### Step 6.3: Salvar Telemetria
```bash
# Salvar em arquivo
.agent/telemetry/document_20250106_153045.json

# Estrutura:
{
  "workflow_id": "uuid",
  "workflow_name": "document",
  "feature_name": "Payment System",
  "doc_type": "platform",
  "start_time": "2025-01-06T15:30:45Z",
  "end_time": "2025-01-06T15:31:38Z",
  "total_duration_seconds": 53,
  "success": true,
  "phases": { ... }
}
```

**Telemetry Phase 6:**
```json
{
  "phase_6": {
    "total_duration_seconds": 53,
    "success": true,
    "report_generated": true,
    "telemetry_saved": true
  }
}
```

**Final Output:** Relatório completo apresentado ao usuário

---

## 7. Validation Rules

### Regras de Validação Automática

#### 1. Frontmatter Validation
```yaml
# Obrigatórios:
- title: string (não vazio)
- description: string (10-200 chars)
- date: YYYY-MM-DD (data válida)
- author: string
- version: X.Y.Z (semver)

# Opcionais:
- tags: array de strings
```

#### 2. Content Structure Validation
```typescript
const rules = {
  h1_count: exactly 1,
  h2_minimum: at least 3,
  hierarchy: no H1 → H3 skip,
  code_blocks: all properly closed,
  links: no broken internal links,
  callouts: valid GitHub-style syntax
};
```

#### 3. Code Examples Validation
```typescript
// Todos os code blocks devem:
- Ter language identifier (```typescript, não ```)
- Estar fechados corretamente
- Conter código válido (sem syntax errors óbvios)
- Ser extraídos de código real quando possível
```

#### 4. API Reference Validation
```markdown
# Para cada método documentado:
- Nome do método ✓
- Parâmetros com tipos ✓
- Tipo de retorno ✓
- Exemplo de uso ✓
- Erros possíveis (se aplicável) ✓
```

#### 5. Meta File Validation
```javascript
// _meta.js deve:
- Ter sintaxe JavaScript válida
- Export default de objeto
- Não ter chaves duplicadas
- Manter ordem lógica de categorias
```

---

## 8. Error Handling

### Errors Esperados

#### 1. Código-fonte Insuficiente
```
Error: Insufficient code context
Solution: Forneça mais contexto ou arquivos TypeScript no chat
```

#### 2. Tipo Ambíguo
```
Error: Cannot determine doc type (design-system vs platform)
Solution: Use force_type parameter no input
```

#### 3. Meta File Corrompido
```
Error: Cannot parse _meta.js
Solution: Corrigir manualmente o arquivo antes de rodar workflow
```

#### 4. Validação MDX Falhou
```
Error: Invalid MDX syntax detected
Solution: Workflow reporta warnings mas continua (usuário corrige depois)
```

### Recovery Strategies

```typescript
// Em caso de erro:
1. Log completo no telemetry
2. Salvar partial output se possível
3. Gerar relatório com erro detalhado
4. Sugerir ação corretiva ao usuário
```

---

## 9. Examples

### Exemplo 1: Component (Design System)

**Input:**
```
Usuário: "Documenta o Button component"
Contexto: Button.tsx, Button.test.tsx, Button.stories.tsx
```

**Output:**
```markdown
# Button

> Componente de botão versátil com múltiplas variantes e estados

## Overview
Botão reutilizável que suporta diferentes tamanhos, variantes e estados...

## Variants
- **Primary:** Ação principal da página
- **Secondary:** Ações secundárias
- **Outline:** Ações terciárias
...

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' \| 'outline' | 'primary' | Estilo visual |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Tamanho do botão |
...

## Usage Examples
\`\`\`tsx
import { Button } from '@/components/ui/button';

export default function Example() {
  return (
    <Button variant="primary" size="lg">
      Click me
    </Button>
  );
}
\`\`\`

## API Reference
### Button Props
...

## Accessibility
- Suporta navegação por teclado (Enter, Space)
- Roles ARIA corretos
...

## Related Components
- [IconButton](/design-system/components/icon-button)
- [LinkButton](/design-system/components/link-button)
```

**Files:**
- Created: `apps/docs/content/design-system/components/button.mdx`
- Updated: `apps/docs/content/design-system/components/_meta.js`

---

### Exemplo 2: API Feature (Platform)

**Input:**
```
Usuário: "Documenta o sistema de notificações push"
Contexto: notification.service.ts, fcm.provider.ts, notification.types.ts
```

**Output:**
```markdown
# Push Notifications

> Sistema completo de notificações push via Firebase Cloud Messaging

## Visão Geral
Sistema de notificações que envia mensagens push para dispositivos iOS e Android...

## Como Funciona
1. Cliente registra FCM token
2. Backend armazena token no banco
3. Evento dispara notificação
4. FCM entrega para dispositivo
5. Webhook confirma entrega

## Fluxo Técnico
\`\`\`mermaid
sequenceDiagram
    participant Client
    participant API
    participant FCM
    participant Device
    
    Client->>API: POST /notifications/register
    API->>Database: Save FCM token
    
    API->>FCM: Send notification
    FCM->>Device: Deliver push
    Device->>FCM: Acknowledge
    FCM->>API: Webhook callback
\`\`\`

## Exemplos de Uso

### Enviar Notificação Simples
\`\`\`typescript
await notificationService.send({
  userId: 'user_123',
  title: 'Nova mensagem',
  body: 'Você tem 1 mensagem não lida',
  data: { messageId: 'msg_456' }
});
\`\`\`

### Enviar para Múltiplos Usuários
\`\`\`typescript
await notificationService.sendBulk({
  userIds: ['user_1', 'user_2', 'user_3'],
  title: 'Atualização importante',
  body: 'Nova feature disponível!'
});
\`\`\`

## API Reference

### `send(params)`
Envia notificação para um usuário.

**Parâmetros:**
- `userId` (string) - ID do usuário destino
- `title` (string) - Título da notificação
- `body` (string) - Corpo da mensagem
- `data` (object, opcional) - Dados customizados

**Retorna:** `Promise<NotificationResult>`

### `sendBulk(params)`
...

## Configuração

### Variáveis de Ambiente
\`\`\`env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
\`\`\`

### Setup Inicial
\`\`\`bash
# 1. Criar projeto no Firebase Console
# 2. Baixar service account key
# 3. Configurar env vars
# 4. Testar conexão
pnpm test:notifications
\`\`\`

## Troubleshooting

### Erro: "Invalid FCM token"
**Problema:** Token expirado ou inválido

**Solução:**
\`\`\`typescript
// Re-registrar token no cliente
const newToken = await messaging.getToken();
await api.post('/notifications/register', { token: newToken });
\`\`\`

### Erro: "FCM service unavailable"
**Problema:** Firebase temporariamente indisponível

**Solução:**
Sistema tem retry automático (3 tentativas). Mensagens ficam na fila.

## Relacionados
- [Email Notifications](/platform/email-notifications)
- [SMS Notifications](/platform/sms-notifications)
- [Notification Templates](/platform/notification-templates)
```

**Files:**
- Created: `apps/docs/content/platform/push-notifications.mdx`
- Updated: `apps/docs/content/platform/_meta.js`

---

## 10. Performance Expectations

### Métricas Alvo

| Métrica | Target | Aceitável | Crítico |
|---------|--------|-----------|---------|
| Tempo total | 30-60s | < 90s | > 120s |
| Files analisados | 3-8 | < 15 | > 20 |
| Seções geradas | 6-10 | < 15 | > 20 |
| Code blocks | 5-15 | < 25 | > 30 |
| Tamanho .mdx | 5-15KB | < 30KB | > 50KB |

### Otimizações

```typescript
// 1. Análise paralela de múltiplos arquivos
// 2. Cache de type definitions extraídos
// 3. Templates pré-compilados para estruturas base
// 4. Validação incremental durante geração
```

---

## 11. Quality Gates

### Gate Q1: Code Analysis Quality
**Requisitos:**
- ✅ Pelo menos 1 arquivo TypeScript analisado
- ✅ Pelo menos 1 type definition extraído
- ✅ Doc type determinado (design-system ou platform)

**Critério de Falha:**
- ❌ Nenhum código TypeScript encontrado no contexto
- ❌ Impossível determinar tipo de feature

---

### Gate Q2: Content Completeness
**Requisitos:**
- ✅ Frontmatter completo e válido
- ✅ Mínimo de 6 seções geradas
- ✅ Pelo menos 3 code blocks
- ✅ API reference presente (se aplicável)

**Critério de Falha:**
- ❌ Frontmatter inválido
- ❌ Menos de 4 seções
- ❌ Nenhum code block

---

### Gate Q3: Validation Passed
**Requisitos:**
- ✅ Sintaxe MDX válida
- ✅ Hierarquia de headers correta (H1 único)
- ✅ Code blocks fechados
- ✅ Links internos válidos

**Critério de Falha:**
- ❌ Syntax errors no MDX
- ❌ Múltiplos H1
- ❌ Code blocks não fechados

---

## 12. Dependencies

### Dependências de Projetos
```json
{
  "nextra": "^3.0.0",
  "nextra-theme-docs": "^3.0.0",
  "next": "^14.0.0"
}
```

### Dependências de Workflows
```
Nenhuma - Este workflow é independente
```

### Dependências de Arquivos
```
apps/docs/content/
├── design-system/_meta.js (requerido)
└── platform/_meta.js (requerido)
```

---

## 13. Integration Points

### Integração com Outros Workflows

#### Após `/implement`
```bash
# Fluxo típico:
1. /kickoff → kickoff.json
2. /pdr → PDR.md
3. /backend → schema.prisma
4. /contracts → tRPC + Zod
5. /tasks → implementation_plan.json
6. /implement → código funcional
7. /document → documentação MDX ← ESTE WORKFLOW
```

#### Antes de Deploy
```bash
# Validar documentação antes de deploy
pnpm --filter docs build
pnpm --filter docs start

# Se passar, fazer deploy da docs
```

### Integração com Git
```bash
# Commit automático sugerido pelo workflow:
git add apps/docs/
git commit -m "docs: add [feature-name] documentation

- Generated MDX documentation for [feature]
- Updated _meta.js in [section]
- [X] sections, [Y] code examples
- Validated: syntax, links, hierarchy

Generated by: workflow document.md v1.0.0"
```

---

## 14. Rollback Strategy

### Cenários de Rollback

#### 1. Documentação Incorreta Gerada
```bash
# Desfazer mudanças
git checkout -- apps/docs/content/[type]/[file].mdx
git checkout -- apps/docs/content/[type]/_meta.js

# Re-executar workflow com ajustes
```

#### 2. Meta File Corrompido
```bash
# Restaurar _meta.js do último commit
git checkout HEAD -- apps/docs/content/[type]/_meta.js

# Corrigir manualmente se necessário
```

#### 3. Build Quebrado
```bash
# Identificar arquivo problemático
pnpm --filter docs build

# Remover arquivo temporariamente
rm apps/docs/content/[type]/[file].mdx

# Corrigir e re-gerar
```

### Prevenção
```typescript
// Workflow sempre valida antes de commitar
// Se validação falhar:
// 1. Não cria arquivos
// 2. Reporta erro detalhado
// 3. Sugere correção
```

---

## 15. Monitoring & Telemetry

### Métricas Coletadas

#### Por Execução
```typescript
interface WorkflowMetrics {
  workflow_id: string;
  execution_time_seconds: number;
  success: boolean;
  feature_name: string;
  doc_type: 'design-system' | 'platform';
  
  analysis: {
    files_analyzed: number;
    types_extracted: number;
    examples_found: number;
  };
  
  generation: {
    sections_generated: number;
    code_blocks: number;
    api_methods: number;
    file_size_bytes: number;
  };
  
  validation: {
    passed: boolean;
    warnings: string[];
    errors: string[];
  };
}
```

#### Agregadas (Dashboard Futuro)
```typescript
// Métricas úteis para análise:
- Average execution time
- Success rate
- Most documented feature types
- Average sections per doc
- Common validation warnings
```

### Logs
```bash
# Estrutura de logs
.agent/telemetry/
├── document_20250106_153045.json
├── document_20250106_164520.json
└── document_20250106_175830.json

# Cada arquivo contém execução completa
```

---

## 16. Future Enhancements

### v1.1.0 (Planejado)
- [ ] Suporte para diagramas Mermaid automáticos
- [ ] Extração de screenshots de testes E2E
- [ ] Geração de tabelas comparativas automáticas
- [ ] Suporte para i18n (pt-BR, en-US)

### v1.2.0 (Futuro)
- [ ] Integração com AI para melhorar descrições
- [ ] Auto-geração de GIFs demonstrativos
- [ ] Suporte para OpenAPI spec → docs
- [ ] Versionamento automático de docs (v1, v2, etc)

### v2.0.0 (Visão)
- [ ] Docs interativos com code playground
- [ ] AI-powered Q&A sobre a feature documentada
- [ ] Auto-update quando código mudar
- [ ] Integração com CI/CD (docs em PRs)

---

## 17. Metadata

**Versão:** 1.0.0  
**Data de Criação:** 2025-01-06  
**Última Atualização:** 2025-01-06  
**Autor:** Chris + Claude Sonnet 4.5  
**Status:** Production Ready  
**Compatibilidade:** Kaven v1.4.0+  

**Tags:** `documentation`, `nextra`, `mdx`, `automation`, `post-implementation`

**Changelog:**

### v1.0.0 (2025-01-06)
- ✅ Criação inicial do workflow
- ✅ Análise automática de código TypeScript
- ✅ Geração de MDX com estrutura adaptativa
- ✅ Atualização estratégica de _meta.js
- ✅ Validação automática completa
- ✅ Telemetria detalhada por fase
- ✅ Suporte para design-system e platform
- ✅ Extração de JSDoc/TSDoc para API reference
- ✅ Exemplos de código baseados em código real
- ✅ Quality gates automáticos
- ✅ Relatório consolidado de execução

---

**Fim do Workflow `document.md`**

