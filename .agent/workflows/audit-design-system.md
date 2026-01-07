---
description: Audita design system completo, regenera documentação com live preview (padrão Bootstrap)
---

# WORKFLOW: Design System Documentation Audit

> **Versão:** 1.0.0  
> **Data:** 2025-01-06  
> **Autor:** Chris + Claude Sonnet 4.5  
> **Status:** Production Ready  
> **Propósito:** Audita design system completo, regenera documentação com live preview (padrão Bootstrap)

---

## 1. Workflow Metadata

**ID:** `audit-design-system`  
**Nome:** Design System Documentation Audit  
**Categoria:** Post-Implementation (Maintenance)  
**Executor:** Antigravity Agent (Autonomous)  
**Estimativa:** 30-60 minutos (depende de quantos componentes)

**Triggers:**
- Design system implementado com shadcn/ui
- Documentação desatualizada ou incompleta
- Componentes sem preview visual
- Usuário solicita auditoria completa

**Dependencies:**
- `apps/docs/` estrutura Nextra existente
- Workflow `document.md` funcional
- Componentes shadcn/ui em `packages/ui/` ou `src/components/ui/`

---

## 2. Purpose & Scope

### Propósito
Auditar **todos os componentes** do design system, comparar com documentação existente, e regenerar docs com **live preview visual** (estilo Bootstrap).

### Escopo Incluído
- ✅ Scan completo de componentes em `packages/ui/` ou `src/components/ui/`
- ✅ Análise de docs existentes em `apps/docs/content/design-system/`
- ✅ Comparação componente real vs documentação
- ✅ Regeneração usando workflow `document.md`
- ✅ Adição de live preview (import direto de componentes)
- ✅ Validação de props (TypeScript interfaces)
- ✅ Geração de relatório de completude
- ✅ Atualização de `_meta.js` estratégica

### Escopo Excluído
- ❌ Criação de novos componentes
- ❌ Refatoração de componentes existentes
- ❌ Mudanças em código TypeScript dos componentes
- ❌ Migração de design system (ex: Material UI → shadcn)

---

## 3. Prerequisites

### Arquivos Necessários
```
apps/docs/
├── content/
│   └── design-system/
│       ├── _meta.js
│       ├── foundation/
│       └── components/
├── components/
│   └── ComponentPreview.tsx (será criado se não existir)
└── theme.config.tsx

packages/ui/ ou src/components/ui/
├── button.tsx
├── badge.tsx
├── card.tsx
└── ... (componentes shadcn/ui)
```

### Validações Pré-Execução
```typescript
// O workflow valida automaticamente:
- apps/docs/ existe? ✓
- Nextra configurado? ✓
- Componentes UI existem? ✓
- Workflow document.md acessível? ✓
```

---

## 4. Input Specification

### Input do Usuário
```typescript
interface AuditInput {
  mode?: 'full' | 'missing' | 'outdated';  // Default: 'full'
  components?: string[];                    // Opcional: auditar apenas específicos
  regenerate_all?: boolean;                 // Default: false
}
```

### Exemplo de Invocação
```
Usuário: "Audita o design system completo e adiciona preview visual"

Agent: [inicia workflow audit-design-system.md automaticamente]
```

### Input Implícito (do Contexto)
- Componentes TypeScript em `packages/ui/` ou `src/components/ui/`
- Docs MDX existentes em `apps/docs/content/design-system/`
- Props interfaces (via TypeScript)

---

## 5. Output Specification

### Arquivos Gerados/Modificados

#### 1. Componente de Preview (se não existir)
```tsx
// apps/docs/components/ComponentPreview.tsx
import { type ReactNode } from 'react';

interface ComponentPreviewProps {
  children: ReactNode;
  className?: string;
}

export function ComponentPreview({ children, className = '' }: ComponentPreviewProps) {
  return (
    <div className={`not-prose my-6 ${className}`}>
      <div className="rounded-lg border bg-background p-8 flex items-center justify-center min-h-[120px]">
        {children}
      </div>
    </div>
  );
}
```

#### 2. Docs MDX Atualizadas (para cada componente)
```mdx
---
title: Badge
description: Badges são usados para destacar informações importantes
date: 2025-01-06
version: 1.0.0
---

import { Badge } from '@/components/ui/badge';
import { ComponentPreview } from '@/components/ComponentPreview';

# Badge

> Componente de badge para destacar status, contadores e labels

## Examples

### Default

<ComponentPreview>
  <Badge>Badge</Badge>
</ComponentPreview>

\`\`\`tsx
<Badge>Badge</Badge>
\`\`\`

### Variants

#### Primary

<ComponentPreview>
  <Badge variant="primary">Primary</Badge>
</ComponentPreview>

\`\`\`tsx
<Badge variant="primary">Primary</Badge>
\`\`\`

[... todas as variants com preview visual]

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'default' \| 'primary' \| ... | 'default' | Visual style |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Size of badge |

[... resto da documentação]
```

#### 3. Relatório de Auditoria
```markdown
# 📊 Design System Audit Report

## Summary
- **Total Components:** 24
- **Documented:** 18
- **Missing Docs:** 6
- **Outdated:** 3
- **With Preview:** 15 (após auditoria: 24)

## Components Status

### ✅ Complete (18)
1. Button - Documented + Preview
2. Badge - Documented + Preview
[...]

### ⚠️ Missing Docs (6)
1. Tooltip - No documentation
2. Popover - No documentation
[...]

### 🔄 Outdated (3)
1. Card - Props changed (added 'elevated' variant)
2. Table - Missing new 'sticky' prop
[...]

## Actions Taken
- Regenerated 9 component docs
- Added preview to 9 components
- Created ComponentPreview.tsx
- Updated 2 _meta.js files

## Next Steps
- [ ] Review regenerated docs
- [ ] Test preview rendering
- [ ] Build docs: `pnpm --filter docs build`
```

---

## 6. Implementation Steps

### Phase 0: Telemetry Initialization

```typescript
const telemetry = {
  workflow_id: crypto.randomUUID(),
  workflow_name: 'audit-design-system',
  start_time: new Date().toISOString(),
  mode: 'full',
  phases: {}
};

// Salvar em .agent/telemetry/audit-design-system_[timestamp].json
```

**Output Phase 0:**
- ✅ `workflow_id` gerado
- ✅ Timestamp inicial registrado

---

### Phase 1: Investigation & Discovery

**Objetivo:** Descobrir estrutura atual e mapear componentes.

#### Step 1.1: Scan Component Directories
```bash
# Procurar diretórios de componentes
COMPONENT_DIRS=(
  "packages/ui/src"
  "packages/ui/components"
  "src/components/ui"
  "components/ui"
)

# Encontrar o diretório correto
for dir in "${COMPONENT_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    COMPONENTS_DIR="$dir"
    break
  fi
done
```

#### Step 1.2: List All Components
```typescript
// Listar arquivos .tsx no diretório de componentes
const componentFiles = fs.readdirSync(COMPONENTS_DIR)
  .filter(file => file.endsWith('.tsx'))
  .map(file => ({
    name: file.replace('.tsx', ''),
    path: `${COMPONENTS_DIR}/${file}`,
    slug: file.replace('.tsx', '').toLowerCase()
  }));

// Exemplo de output:
// [
//   { name: 'Button', path: 'packages/ui/src/button.tsx', slug: 'button' },
//   { name: 'Badge', path: 'packages/ui/src/badge.tsx', slug: 'badge' },
//   ...
// ]
```

#### Step 1.3: Scan Existing Docs
```typescript
// Listar docs existentes
const existingDocs = fs.readdirSync('apps/docs/content/design-system/components')
  .filter(file => file.endsWith('.mdx'))
  .map(file => file.replace('.mdx', ''));

// Exemplo de output:
// ['button', 'badge', 'card', ...]
```

#### Step 1.4: Check for ComponentPreview
```typescript
const previewExists = fs.existsSync('apps/docs/components/ComponentPreview.tsx');

if (!previewExists) {
  // Será criado na Phase 2
}
```

**Telemetry Phase 1:**
```json
{
  "phase_1": {
    "components_dir": "packages/ui/src",
    "total_components": 24,
    "existing_docs": 18,
    "missing_docs": 6,
    "preview_component_exists": false,
    "duration_seconds": 5
  }
}
```

**Checkpoint:** Componentes mapeados, docs existentes identificadas

---

### Phase 2: Component Analysis & Comparison

**Objetivo:** Analisar cada componente e comparar com documentação.

#### Step 2.1: Extract Component Props
```typescript
// Para cada componente, extrair interface de Props
const analyzeComponent = (componentPath: string) => {
  const content = fs.readFileSync(componentPath, 'utf-8');
  
  // Regex para encontrar interface Props
  const propsInterfaceRegex = /interface\s+\w+Props\s*{([^}]+)}/;
  const match = content.match(propsInterfaceRegex);
  
  if (match) {
    // Parsear props (simplificado)
    const propsText = match[1];
    const props = propsText.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [name, type] = line.split(':').map(s => s.trim());
        return { name, type };
      });
    
    return props;
  }
  
  return [];
};

// Exemplo de output para Button:
// [
//   { name: 'variant', type: "'default' | 'primary' | 'secondary'" },
//   { name: 'size', type: "'sm' | 'md' | 'lg'" },
//   { name: 'disabled', type: 'boolean' }
// ]
```

#### Step 2.2: Extract Component Variants
```typescript
// Detectar variants do componente
const extractVariants = (componentPath: string) => {
  const content = fs.readFileSync(componentPath, 'utf-8');
  
  // Procurar por cva() ou variantes no código
  const variantsRegex = /variants:\s*{([^}]+)}/;
  const match = content.match(variantsRegex);
  
  if (match) {
    // Parsear variants (simplificado)
    // Retorna: ['default', 'primary', 'secondary', 'destructive']
  }
  
  return [];
};
```

#### Step 2.3: Compare with Existing Docs
```typescript
const compareWithDocs = (component: Component, docPath: string) => {
  if (!fs.existsSync(docPath)) {
    return { status: 'missing', issues: ['No documentation exists'] };
  }
  
  const docContent = fs.readFileSync(docPath, 'utf-8');
  
  const issues = [];
  
  // Check 1: Tem preview visual?
  if (!docContent.includes('ComponentPreview')) {
    issues.push('Missing visual preview');
  }
  
  // Check 2: Props documentadas?
  const componentProps = extractProps(component.path);
  const documentedProps = extractDocumentedProps(docContent);
  
  const missingProps = componentProps.filter(
    prop => !documentedProps.includes(prop.name)
  );
  
  if (missingProps.length > 0) {
    issues.push(`Missing props: ${missingProps.map(p => p.name).join(', ')}`);
  }
  
  // Check 3: Variants documentadas?
  const componentVariants = extractVariants(component.path);
  const documentedVariants = extractDocumentedVariants(docContent);
  
  const missingVariants = componentVariants.filter(
    v => !documentedVariants.includes(v)
  );
  
  if (missingVariants.length > 0) {
    issues.push(`Missing variants: ${missingVariants.join(', ')}`);
  }
  
  return {
    status: issues.length === 0 ? 'complete' : 'outdated',
    issues
  };
};
```

**Telemetry Phase 2:**
```json
{
  "phase_2": {
    "components_analyzed": 24,
    "complete": 15,
    "outdated": 3,
    "missing": 6,
    "common_issues": [
      "Missing visual preview: 9 components",
      "Missing props documentation: 3 components",
      "Missing variants: 2 components"
    ],
    "duration_seconds": 12
  }
}
```

**Checkpoint:** Análise completa, issues identificados

---

### Phase 3: Create ComponentPreview (if needed)

**Objetivo:** Criar componente de preview se não existir.

#### Step 3.1: Check if Exists
```typescript
const previewPath = 'apps/docs/components/ComponentPreview.tsx';

if (fs.existsSync(previewPath)) {
  console.log('✅ ComponentPreview.tsx already exists');
  return;
}
```

#### Step 3.2: Create ComponentPreview.tsx
```tsx
// apps/docs/components/ComponentPreview.tsx
import { type ReactNode } from 'react';

interface ComponentPreviewProps {
  children: ReactNode;
  className?: string;
}

/**
 * ComponentPreview - Wrapper para renderizar componentes com fundo e padding
 * Usado para exibir componentes visualmente na documentação (estilo Bootstrap)
 */
export function ComponentPreview({ 
  children, 
  className = '' 
}: ComponentPreviewProps) {
  return (
    <div className={`not-prose my-6 ${className}`}>
      <div className="rounded-lg border bg-background p-8 flex items-center justify-center min-h-[120px]">
        {children}
      </div>
    </div>
  );
}
```

#### Step 3.3: Create Index Export
```tsx
// apps/docs/components/index.ts
export { ComponentPreview } from './ComponentPreview';
```

**Telemetry Phase 3:**
```json
{
  "phase_3": {
    "preview_component_created": true,
    "files_created": [
      "apps/docs/components/ComponentPreview.tsx",
      "apps/docs/components/index.ts"
    ],
    "duration_seconds": 3
  }
}
```

**Checkpoint:** ComponentPreview criado e pronto para uso

---

### Phase 4: Regenerate Documentation (using document.md)

**Objetivo:** Para cada componente com issues, chamar workflow `document.md`.

#### Step 4.1: Determine Components to Regenerate
```typescript
const componentsToRegenerate = analysisResults.filter(
  result => result.status === 'missing' || result.status === 'outdated'
);

// Exemplo:
// [
//   { name: 'Tooltip', status: 'missing', issues: [...] },
//   { name: 'Card', status: 'outdated', issues: [...] },
//   ...
// ]
```

#### Step 4.2: Call document.md Workflow
```typescript
// Para cada componente, chamar workflow document.md
for (const component of componentsToRegenerate) {
  // Preparar contexto para document.md
  const context = {
    feature_name: component.name,
    doc_type: 'design-system',
    component_path: component.path,
    force_regenerate: true
  };
  
  // Chamar workflow document.md
  // (Antigravity vai executar o workflow completo)
  await executeWorkflow('document.md', context);
  
  // document.md vai gerar:
  // - apps/docs/content/design-system/components/{slug}.mdx
  // - Atualizar apps/docs/content/design-system/components/_meta.js
}
```

**IMPORTANTE:** Workflow `document.md` já faz:
- ✅ Extração de props
- ✅ Geração de API reference
- ✅ Frontmatter versionado
- ✅ Estrutura completa

**O que ESTE workflow adiciona:**
- ✅ Live preview (import de componentes)
- ✅ Seções de variants com preview visual

**Telemetry Phase 4:**
```json
{
  "phase_4": {
    "components_regenerated": 9,
    "workflow_calls": 9,
    "successful": 9,
    "failed": 0,
    "duration_seconds": 240
  }
}
```

**Checkpoint:** Docs base regeneradas via document.md

---

### Phase 5: Enhance with Live Preview

**Objetivo:** Adicionar preview visual em todas as docs.

#### Step 5.1: Add Preview Imports
```typescript
// Para cada .mdx gerado, adicionar imports no topo
const addPreviewImports = (mdxPath: string, componentName: string) => {
  const content = fs.readFileSync(mdxPath, 'utf-8');
  
  // Encontrar final do frontmatter
  const frontmatterEnd = content.indexOf('---', 3) + 3;
  
  // Inserir imports após frontmatter
  const imports = `
import { ${componentName} } from '@/components/ui/${componentName.toLowerCase()}';
import { ComponentPreview } from '@/components/ComponentPreview';
`;
  
  const updatedContent = 
    content.slice(0, frontmatterEnd) + 
    '\n' + imports + 
    content.slice(frontmatterEnd);
  
  fs.writeFileSync(mdxPath, updatedContent);
};
```

#### Step 5.2: Transform Examples to Include Preview
```typescript
// Transformar seções de exemplo para incluir preview
const enhanceExamples = (mdxPath: string, variants: string[]) => {
  let content = fs.readFileSync(mdxPath, 'utf-8');
  
  // Para cada variant, adicionar preview visual
  for (const variant of variants) {
    // Encontrar seção do variant (ex: "### Primary")
    const variantRegex = new RegExp(`### ${variant}\\n\\n\`\`\`tsx`, 'i');
    
    // Adicionar preview ANTES do code block
    const previewCode = `
### ${variant}

<ComponentPreview>
  <${componentName} variant="${variant.toLowerCase()}">${variant}</${componentName}>
</ComponentPreview>

\`\`\`tsx
<${componentName} variant="${variant.toLowerCase()}">${variant}</${componentName}>
\`\`\`
`;
    
    content = content.replace(variantRegex, previewCode);
  }
  
  fs.writeFileSync(mdxPath, content);
};
```

#### Step 5.3: Add Default Example with Preview
```typescript
// Garantir que exemplo padrão tem preview
const ensureDefaultPreview = (mdxPath: string, componentName: string) => {
  let content = fs.readFileSync(mdxPath, 'utf-8');
  
  // Procurar seção ## Examples
  const examplesIndex = content.indexOf('## Examples');
  
  if (examplesIndex === -1) return; // Já adicionado por document.md
  
  // Adicionar preview no primeiro exemplo
  const defaultExample = `
## Examples

### Default

<ComponentPreview>
  <${componentName}>${componentName}</${componentName}>
</ComponentPreview>

\`\`\`tsx
<${componentName}>${componentName}</${componentName}>
\`\`\`
`;
  
  // Substituir seção ## Examples
  content = content.replace(/## Examples[\s\S]*?(?=##|$)/, defaultExample);
  
  fs.writeFileSync(mdxPath, content);
};
```

**Telemetry Phase 5:**
```json
{
  "phase_5": {
    "docs_enhanced": 9,
    "previews_added": 45,
    "imports_added": 9,
    "duration_seconds": 18
  }
}
```

**Checkpoint:** Todas as docs têm preview visual

---

### Phase 6: Validation & Testing

**Objetivo:** Validar que docs renderizam corretamente.

#### Step 6.1: Validate MDX Syntax
```typescript
// Simular validação MDX (mental - não executar bash)
const validateMDX = (mdxPath: string) => {
  const content = fs.readFileSync(mdxPath, 'utf-8');
  
  const checks = {
    frontmatter_valid: /^---\n[\s\S]+?\n---/.test(content),
    imports_present: content.includes('import {'),
    preview_present: content.includes('<ComponentPreview>'),
    code_blocks_closed: (content.match(/```/g) || []).length % 2 === 0,
    h1_unique: (content.match(/^# /gm) || []).length === 1
  };
  
  return Object.values(checks).every(v => v === true);
};
```

#### Step 6.2: Validate Component Imports
```typescript
// Verificar que componentes podem ser importados
const validateImports = (componentName: string) => {
  const importPath = `@/components/ui/${componentName.toLowerCase()}`;
  
  // Simular import (verificar que arquivo existe)
  const componentPath = `packages/ui/src/${componentName.toLowerCase()}.tsx`;
  
  return fs.existsSync(componentPath);
};
```

#### Step 6.3: Generate Validation Report
```typescript
const validationReport = {
  total_docs: 24,
  valid: 23,
  invalid: 1,
  issues: [
    {
      file: 'apps/docs/content/design-system/components/tooltip.mdx',
      error: 'Import path incorrect'
    }
  ]
};
```

**Telemetry Phase 6:**
```json
{
  "phase_6": {
    "validation_passed": true,
    "docs_validated": 24,
    "valid": 23,
    "invalid": 1,
    "warnings": [
      "Tooltip.mdx: Import path needs adjustment"
    ],
    "duration_seconds": 8
  }
}
```

**Checkpoint:** Validação completa

---

### Phase 7: Telemetry Consolidation & Report

**Objetivo:** Gerar relatório final de auditoria.

#### Step 7.1: Consolidate Metrics
```typescript
const auditMetrics = {
  total_components: telemetry.phase_1.total_components,
  documented_before: telemetry.phase_1.existing_docs,
  documented_after: telemetry.phase_4.components_regenerated + telemetry.phase_1.existing_docs,
  previews_added: telemetry.phase_5.previews_added,
  total_duration: calculateTotalDuration(telemetry)
};
```

#### Step 7.2: Generate Audit Report
```markdown
# 📊 Design System Audit Report

**Workflow:** audit-design-system.md v1.0.0  
**Execution ID:** ${workflow_id}  
**Date:** ${new Date().toISOString()}  
**Duration:** ${total_duration}s

---

## Summary

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| **Total Components** | 24 | 24 | - |
| **Documented** | 18 | 24 | +6 ✅ |
| **With Preview** | 0 | 24 | +24 ✅ |
| **Outdated** | 3 | 0 | -3 ✅ |

---

## Components Status

### ✅ Complete & Up-to-date (24)

1. **Button** - ✅ Documented + Preview
   - Variants: default, primary, secondary, destructive, outline, ghost
   - Props: 8 documented
   - File: `apps/docs/content/design-system/components/button.mdx`

2. **Badge** - ✅ Documented + Preview
   - Variants: default, primary, secondary, destructive
   - Props: 4 documented
   - File: `apps/docs/content/design-system/components/badge.mdx`

[... lista completa]

---

## Actions Taken

### Phase 1: Investigation
- ✅ Scanned 1 component directory
- ✅ Found 24 components
- ✅ Identified 18 existing docs
- ✅ Identified 6 missing docs

### Phase 2: Analysis
- ✅ Analyzed 24 components
- ✅ Extracted props from TypeScript
- ✅ Compared with existing docs
- ✅ Identified 3 outdated docs

### Phase 3: ComponentPreview
- ✅ Created ComponentPreview.tsx
- ✅ Created index.ts export

### Phase 4: Documentation
- ✅ Called document.md workflow 9 times
- ✅ Generated 9 new docs
- ✅ Updated _meta.js

### Phase 5: Preview Enhancement
- ✅ Added imports to 24 docs
- ✅ Added 45 visual previews
- ✅ Enhanced examples with ComponentPreview

### Phase 6: Validation
- ✅ Validated 24 MDX files
- ⚠️ 1 warning (Tooltip import path)
- ✅ All syntax checks passed

---

## Files Created/Modified

### Created
1. `apps/docs/components/ComponentPreview.tsx`
2. `apps/docs/components/index.ts`
3. `apps/docs/content/design-system/components/tooltip.mdx`
4. `apps/docs/content/design-system/components/popover.mdx`
5. `apps/docs/content/design-system/components/dropdown.mdx`
[... 6 novos arquivos]

### Modified
1. `apps/docs/content/design-system/components/button.mdx`
2. `apps/docs/content/design-system/components/badge.mdx`
3. `apps/docs/content/design-system/components/card.mdx`
[... 18 arquivos modificados]

4. `apps/docs/content/design-system/components/_meta.js`

---

## Validation Results

### ✅ Passed (23/24)
- Frontmatter valid: 24/24
- Imports present: 24/24
- Preview present: 24/24
- Code blocks closed: 24/24
- H1 unique: 24/24

### ⚠️ Warnings (1)
- **Tooltip.mdx:** Import path `@/components/ui/tooltip` should be `@/components/ui/Tooltip`

---

## Next Steps

1. **Review Generated Docs**
   - [ ] Check visual preview rendering
   - [ ] Verify variant examples
   - [ ] Validate props tables

2. **Test Locally**
   ```bash
   cd apps/docs
   pnpm dev
   # Navigate to http://localhost:3002
   ```

3. **Build Validation**
   ```bash
   pnpm --filter docs build
   ```

4. **Fix Warnings**
   - [ ] Correct Tooltip import path

5. **Commit Changes**
   ```bash
   git add apps/docs/
   git commit -m "docs(design-system): audit complete - 24 components documented with preview

   - Added ComponentPreview component
   - Regenerated 9 component docs
   - Added visual preview to all 24 components
   - Enhanced examples with live rendering
   - Updated _meta.js

   Audit Report:
   - Total components: 24
   - Documented: 18 → 24 (+6)
   - With preview: 0 → 24 (+24)
   - Outdated: 3 → 0 (-3)

   Generated by: workflow audit-design-system.md v1.0.0"
   ```

---

## Recommendations

### Short-term
- 🎨 Customize ComponentPreview styling (border colors, shadows)
- 📝 Add "Copy Code" button to code blocks
- 🎯 Add interactive props playground (optional)

### Long-term
- 🔄 Automate audit on component changes (git hooks)
- 📊 Add visual regression tests (Chromatic)
- 🌐 Generate design tokens documentation
- 📱 Add responsive preview (mobile/tablet/desktop)

---

**Audit Status:** ✅ COMPLETE  
**Quality Score:** 95/100  
**Ready for Production:** YES
```

**Telemetry Phase 7:**
```json
{
  "phase_7": {
    "total_duration_seconds": 286,
    "success": true,
    "report_generated": true,
    "quality_score": 95
  }
}
```

**Final Output:** Relatório completo apresentado ao usuário

---

## 7. Validation Rules

### Regras de Validação Automática

#### 1. Component Discovery Validation
```typescript
const rules = {
  components_found: minimum 1,
  components_dir_exists: true,
  components_are_tsx: true
};
```

#### 2. Documentation Validation
```typescript
const rules = {
  mdx_syntax_valid: true,
  frontmatter_complete: true,
  imports_correct: true,
  preview_component_used: true,
  h1_unique: exactly 1,
  code_blocks_closed: all properly closed
};
```

#### 3. Preview Validation
```typescript
const rules = {
  ComponentPreview_exists: true,
  all_variants_have_preview: true,
  imports_resolve: true
};
```

#### 4. Completeness Validation
```typescript
const rules = {
  all_components_documented: true,
  all_props_documented: true,
  all_variants_documented: true
};
```

---

## 8. Error Handling

### Errors Esperados

#### 1. Component Directory Not Found
```
Error: Cannot find component directory
Solution: Check if components are in packages/ui/ or src/components/ui/
```

#### 2. Workflow document.md Not Accessible
```
Error: Cannot call document.md workflow
Solution: Ensure document.md is in .agent/workflows/
```

#### 3. Invalid Component Structure
```
Error: Component does not export Props interface
Solution: Add TypeScript interface for component props
```

#### 4. Build Validation Failed
```
Error: Nextra build failed
Solution: Check MDX syntax errors in generated files
```

### Recovery Strategies

```typescript
// Em caso de erro:
1. Log completo no telemetry
2. Salvar partial output (componentes processados com sucesso)
3. Gerar relatório com erro detalhado
4. Sugerir ação corretiva ao usuário
5. Não reverter mudanças já feitas (commits incrementais)
```

---

## 9. Examples

### Exemplo 1: Auditoria Completa

**Input:**
```
Usuário: "Audita design system completo e adiciona preview visual"
```

**Processamento:**
```
Phase 1: Descobriu 24 componentes
Phase 2: Analisou todos, identificou 6 sem docs, 3 outdated
Phase 3: Criou ComponentPreview.tsx
Phase 4: Chamou document.md 9 vezes
Phase 5: Adicionou preview em 24 docs
Phase 6: Validou tudo, 1 warning
Phase 7: Gerou relatório completo
```

**Output:**
```
✅ Auditoria completa!

📊 Resumo:
   - 24 componentes documentados (antes: 18)
   - 24 com preview visual (antes: 0)
   - 0 outdated (antes: 3)
   - Tempo total: 4m46s

📄 Arquivos criados:
   - ComponentPreview.tsx
   - 6 novos .mdx

📝 Arquivos modificados:
   - 18 .mdx atualizados
   - _meta.js atualizado

⚠️ Warnings:
   - Tooltip.mdx: ajustar import path

✨ Pronto para build!
```

---

### Exemplo 2: Auditoria Apenas Missing

**Input:**
```typescript
{
  mode: 'missing',
  regenerate_all: false
}
```

**Output:**
```
✅ Auditoria (modo: missing)

📊 Resultado:
   - 6 componentes sem docs identificados
   - 6 docs geradas
   - Preview adicionado nos 6

📄 Componentes documentados:
   1. Tooltip
   2. Popover
   3. Dropdown
   4. Sheet
   5. Drawer
   6. Skeleton

✨ Demais componentes não foram tocados
```

---

## 10. Performance Expectations

### Métricas Alvo

| Métrica | Target | Aceitável | Crítico |
|---------|--------|-----------|---------|
| Tempo total | 3-5min | < 10min | > 15min |
| Components/min | 5-8 | 3-5 | < 3 |
| Workflow calls | 5-10 | < 20 | > 30 |
| Validation time | < 30s | < 60s | > 90s |

### Otimizações

```typescript
// 1. Processar componentes em paralelo (se possível)
// 2. Cache de props extraídos
// 3. Reutilizar análise de componentes não modificados
// 4. Skip validation se já passou antes
```

---

## 11. Quality Gates

### Gate Q1: Discovery Complete
**Requisitos:**
- ✅ Pelo menos 1 componente encontrado
- ✅ Diretório de docs existe
- ✅ ComponentPreview existe ou foi criado

**Critério de Falha:**
- ❌ Nenhum componente encontrado
- ❌ apps/docs/ não existe

---

### Gate Q2: Documentation Generated
**Requisitos:**
- ✅ Todos componentes sem docs agora têm docs
- ✅ Workflow document.md executou sem erros
- ✅ _meta.js atualizado

**Critério de Falha:**
- ❌ document.md falhou
- ❌ Docs geradas inválidas

---

### Gate Q3: Preview Enhancement Complete
**Requisitos:**
- ✅ Todas as docs têm imports corretos
- ✅ Todas as docs têm ComponentPreview
- ✅ Sintaxe MDX válida

**Critério de Falha:**
- ❌ Imports quebrados
- ❌ Syntax errors no MDX

---

## 12. Dependencies

### Dependências de Projetos
```json
{
  "nextra": "^3.0.0",
  "nextra-theme-docs": "^3.0.0",
  "next": "^15.0.0",
  "@radix-ui/react-*": "^1.0.0",
  "class-variance-authority": "^0.7.0",
  "tailwindcss": "^3.0.0"
}
```

### Dependências de Workflows
```
document.md - Usado para gerar documentação base
```

### Dependências de Arquivos
```
apps/docs/ - Estrutura Nextra existente
packages/ui/ ou src/components/ui/ - Componentes shadcn/ui
.agent/workflows/document.md - Workflow de documentação
```

---

## 13. Integration Points

### Integração com Workflow document.md

```typescript
// Este workflow CHAMA document.md para cada componente
// document.md gera:
// - Frontmatter versionado
// - Estrutura base (Overview, Props, API Reference)
// - Validação de sintaxe

// Este workflow ADICIONA:
// - Import de componentes
// - ComponentPreview wrapper
// - Seções de variants com preview visual
```

### Integração com Git

```bash
# Commit incremental após cada fase crítica
git add apps/docs/components/ComponentPreview.tsx
git commit -m "feat(docs): add ComponentPreview component"

git add apps/docs/content/design-system/components/*.mdx
git commit -m "docs(design-system): regenerate 9 component docs with preview"

git add apps/docs/content/design-system/components/_meta.js
git commit -m "docs(design-system): update _meta.js with new components"
```

---

## 14. Rollback Strategy

### Cenários de Rollback

#### 1. Preview Component Quebrado
```bash
# Remover ComponentPreview
rm apps/docs/components/ComponentPreview.tsx

# Reverter imports nas docs
git checkout -- apps/docs/content/design-system/components/*.mdx
```

#### 2. Docs Geradas Incorretamente
```bash
# Restaurar docs do último commit
git checkout HEAD -- apps/docs/content/design-system/components/

# Re-executar workflow com ajustes
```

#### 3. Build Quebrado
```bash
# Identificar arquivo problemático
pnpm --filter docs build

# Corrigir manualmente ou regenerar específico
```

### Prevenção
```typescript
// Workflow sempre valida antes de finalizar
// Commits incrementais permitem rollback parcial
// Telemetria registra tudo para debug
```

---

## 15. Monitoring & Telemetry

### Métricas Coletadas

```typescript
interface AuditTelemetry {
  workflow_id: string;
  execution_time_seconds: number;
  success: boolean;
  
  phase_1: {
    components_dir: string;
    total_components: number;
    existing_docs: number;
    missing_docs: number;
  };
  
  phase_2: {
    components_analyzed: number;
    complete: number;
    outdated: number;
    missing: number;
  };
  
  phase_3: {
    preview_component_created: boolean;
  };
  
  phase_4: {
    components_regenerated: number;
    workflow_calls: number;
    successful: number;
    failed: number;
  };
  
  phase_5: {
    docs_enhanced: number;
    previews_added: number;
  };
  
  phase_6: {
    validation_passed: boolean;
    valid: number;
    invalid: number;
    warnings: string[];
  };
  
  phase_7: {
    quality_score: number;
    report_generated: boolean;
  };
}
```

---

## 16. Future Enhancements

### v1.1.0 (Planejado)
- [ ] Interactive props playground (react-live)
- [ ] Dark/light mode toggle in preview
- [ ] Responsive preview (mobile/tablet/desktop)
- [ ] Copy code button

### v1.2.0 (Futuro)
- [ ] Visual regression tests (Chromatic)
- [ ] Auto-audit on git hooks
- [ ] Design tokens documentation
- [ ] Storybook integration

### v2.0.0 (Visão)
- [ ] AI-powered component suggestions
- [ ] Auto-generate variants from design
- [ ] Figma → Component → Docs pipeline

---

## 17. Metadata

**Versão:** 1.0.0  
**Data de Criação:** 2025-01-06  
**Última Atualização:** 2025-01-06  
**Autor:** Chris + Claude Sonnet 4.5  
**Status:** Production Ready  
**Compatibilidade:** Kaven v2.0.0+

**Tags:** `design-system`, `audit`, `documentation`, `shadcn-ui`, `nextra`, `preview`

**Changelog:**

### v1.0.0 (2025-01-06)
- ✅ Criação inicial do workflow
- ✅ Discovery automático de componentes
- ✅ Análise e comparação com docs
- ✅ Criação de ComponentPreview
- ✅ Integração com document.md
- ✅ Adição de live preview
- ✅ Validação completa
- ✅ Relatório consolidado de auditoria
- ✅ Quality gates automáticos
- ✅ Telemetria detalhada
- ✅ Padrão Bootstrap-style

---

**Fim do Workflow `audit-design-system.md`**
