# Prompt 2: Development & Showcase (Kaven V2)

**Objetivo:** Criar e documentar um componente no ecossistema `apps/admin` (Kaven), garantindo conformidade com arquitetura shadcn/ui, Tailwind v4 e Glassmorphism V2.

## 📋 Contexto Técnico (Kaven V2)

- **Base Dir**: `apps/admin/components/ui` (shadcn) ou `apps/admin/components/foundation` (custom).
- **Showcase**: `apps/admin/app/[locale]/styleguide/components/[name]/page.tsx`.
- **Styling**: Tailwind v4 (`@theme inline`), OKLCH (Light), Hex (Dark).
- **Icons**: Lucide React.
- **Preview**: Componente `<ComponentPreview>` (obrigatório para documentação).

## Workflow

### 1. 🔍 Verificação & Instalação (shadcn)

Verifique se o componente já existe no registry shadcn.

1.  **Instalar via CLI** (dentro de `apps/admin`):
    ```bash
    # Exemplo
    npx shadcn@latest add [nome-componente]
    ```
2.  **Análise de Código**:
    - Verifique se ele usa variáveis CSS corretas (`bg-primary`, `text-primary-foreground`).
    - Se precisar de ajustes de Glassmorphism, adicione a classe utilitária `.glass-panel` ou variantes `.glass`.

### 2. 🛠 Customização & Extensão (Kaven Pattern)

Se precisar estender o componente base (ex: adicionar variante "glass" ou "glow"):

**NÃO modifique diretamente** `components/ui/[nome].tsx` se possível.
Crie um wrapper ou variante em `components/ui/[nome].tsx` (apenas se for feature core) ou `components/extra/[nome]-custom.tsx`.

**Exemplo de Variante Glassmorphism:**

```tsx
// Exemplo: Adicionando variante 'glass' ao Button ou Card
const buttonVariants = cva('inline-flex items-center...', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      // Nova variante Glass
      glass: 'glass-panel hover:bg-white/10 text-foreground border-white/20',
    },
  },
});
```

### 3. 📄 Criação da Página de Showcase (Styleguide)

Crie **obrigatoriamente** uma página de demonstração:
Arquivo: `apps/admin/app/[locale]/styleguide/components/[nome]/page.tsx`

**Estrutura Obrigatória:**

```tsx
import { ComponentPreview } from '@/components/ComponentPreview'; // Wrapper Kaven
import { [NomeComponente] } from '@/components/ui/[nome-arquivo]';

export default function [NomeComponente]Page() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="font-display text-3xl font-bold">[Nome Componente]</h1>
        <p className="text-muted-foreground font-sans text-lg">
          [Descrição breve do componente e uso]
        </p>
      </div>

      {/* Demo Principal */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold">Preview</h2>
        <ComponentPreview>
          <[NomeComponente]>Exemplo Base</[NomeComponente]>
        </ComponentPreview>
      </section>

      {/* Variantes */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold">Variantes</h2>
        <ComponentPreview>
          <div className="flex gap-4 flex-wrap">
             {/* Exiba todas as variantes aqui */}
             <[NomeComponente] variant="secondary">Secondary</[NomeComponente]>
             <[NomeComponente] variant="outline">Outline</[NomeComponente]>
             <[NomeComponente] variant="ghost">Ghost</[NomeComponente]>
             {/* Se aplicável */}
             <[NomeComponente] className="glass-panel">Glass Effect</[NomeComponente]>
          </div>
        </ComponentPreview>
      </section>
    </div>
  );
}
```

### 4. 🧭 Atualizar Navegação

Adicione o link no arquivo `apps/admin/app/[locale]/styleguide/navigation.ts`:

```ts
// ... dentro de navigation
{
  title: 'Componentes',
  items: [
    // ... anteriores
    { name: '[Nome Componente]', href: '/styleguide/components/[nome-kebab-case]' },
  ],
}
```

---

## ✅ Definição de Concluído (DoD)

1.  Componente instalado em `apps/admin/components/ui/`.
2.  Funciona em Light Mode (OKLCH) e Dark Mode (Hex/Minimals).
3.  Página de teste criada em `/styleguide/components/[nome]`.
4.  Link adicionado na sidebar de navegação.
5.  Uso de `<ComponentPreview>` validado.
