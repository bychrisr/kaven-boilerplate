# Prompt 1: Design System Setup (Kaven V2 Compliant)

**Objetivo:** Analisar um screenshot de design e implementar um Design System robusto no `apps/admin`, seguindo estritamente os padrões **Kaven UI v2** (Glassmorphism Adaptativo, Dual-Theme Strategy e Otimização para Next.js 14+).

## 📋 Contexto Técnico Obrigatório (Kaven V2)

- **Architecture**: Monorepo (`apps/admin`).
- **Styling**: Tailwind CSS v4 (`@theme inline` + CSS Variables).
- **Core Philosophy**: **Dark Glassmorphism** (Deep Tech) & **Light Frosted Ice**.
- **Colors**:
  - **Light Mode**: **OKLCH** (High Fidelity).
  - **Dark Mode**: **HEX** (Legacy Minimals Theme compatibility).
- **Typography**:
  - Display: **Barlow** (`--font-display`).
  - Body: **DM Sans** (`--font-body` / `font-sans`).
  - Mono: **Source Code Pro**.
- **Icons**: Lucide React (com cores semânticas adaptativas).

---

## 📥 Input

[INSERIR SCREENSHOT AQUI]

---

## 🛠 Workflow Detalhado

### 1. 🔍 Análise e Extração (Kaven Spec)

Extraia os tokens respeitando as categorias do systema:

#### A. Paleta de Cores (Dual System)

- **Brand/Primary**: Extraia a cor principal.
  - _Light Mode_: Converta para **OKLCH**.
  - _Dark Mode_: Converta para **HEX** (ou use a cor "Verde Minimals" `#00A76F` se for um redesign compatível).
- **Semantic Colors**: Defina variantes `main`, `light`, `dark` para:
  - `success` (Verde), `warning` (Amarelo), `error` (Vermelho), `info` (Azul).
- **Charts**: Gere 5 cores distintas para gráficos (`--chart-1` a `--chart-5`).

#### B. DNA Visual (Glassmorphism & Radius)

- **Glassmorphism**: Identifique se o design pede bordas mais fortes ("Deep Tech") ou mais suaves ("Frosted").
- **Radius**: O Kaven usa `0.625rem` (10px) como base padrão. Ajuste apenas se o design exigir.

---

### 2. 🎨 Refatoração do `globals.css` (The Master Template)

Atualize `apps/admin/app/globals.css` usando **exatamente** este template estrutural, preenchendo as variáveis extraídas.

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import '../styles/theme.css'; /* Kaven Legacy Tokens */
@import 'simplebar-react/dist/simplebar.min.css';

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground antialiased;
  }
}

/* === TEMA TAILWIND V4 (MAPEAMENTO) === */
@theme inline {
  /* Colors */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* Sidebar Specifics */
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  /* Fonts */
  --font-display: var(--font-display);
  --font-sans: var(--font-body); /* Mapeia DM Sans para font-sans padrão */
  --font-mono: var(--font-mono);

  /* Charts */
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  /* Radius (Calculado) */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
}

/* === LIGHT MODE (OKLCH - "Frosted Ice") === */
:root {
  /* Base */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);

  /* Brand */
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);

  /* UI Elements */
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);

  /* Sidebar (Light) */
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);

  /* Typography Reference */
  --font-display: 'Barlow', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'Source Code Pro', monospace;

  /* Radius Base */
  --radius: 0.625rem;

  /* Glassmorphism (Frosted Ice) */
  --glass-gradient-start: rgba(255, 255, 255, 0.8);
  --glass-gradient-end: rgba(255, 255, 255, 0.6);
  --color-glass-border: rgba(255, 255, 255, 0.5);
  --color-glass-highlight: rgba(255, 255, 255, 0.9);
  --glass-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
  --spotlight-color: rgba(255, 255, 255, 0.5);

  /* Charts (OKLCH) */
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
}

/* === DARK MODE (HEX - "Deep Tech") === */
.dark {
  /* Base - Minimals Theme Match */
  --background: #161c24;
  --foreground: #ffffff;
  --card: #212b36;
  --card-foreground: #ffffff;
  --popover: #212b36;
  --popover-foreground: #ffffff;

  /* Brand */
  --primary: #00a76f;
  --primary-foreground: #ffffff;
  --secondary: #8e33ff;
  --secondary-foreground: #ffffff;

  /* UI Elements */
  --muted: rgba(145, 158, 171, 0.12);
  --muted-foreground: #919eab;
  --accent: rgba(145, 158, 171, 0.12);
  --accent-foreground: #ffffff;
  --destructive: #ff5630;
  --destructive-foreground: #ffffff;
  --border: rgba(145, 158, 171, 0.24);
  --input: rgba(145, 158, 171, 0.24);
  --ring: rgba(0, 167, 111, 0.3);

  /* Sidebar (Dark) */
  --sidebar: #161c24;
  --sidebar-foreground: #ffffff;
  --sidebar-primary: #00a76f;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: rgba(145, 158, 171, 0.08);
  --sidebar-accent-foreground: #ffffff;
  --sidebar-border: rgba(145, 158, 171, 0.12);
  --sidebar-ring: rgba(0, 167, 111, 0.3);

  /* Glassmorphism (Deep Tech) */
  --glass-gradient-start: rgba(17, 25, 40, 0.75);
  --glass-gradient-end: rgba(17, 25, 40, 0.5);
  --color-glass-border: rgba(255, 255, 255, 0.08);
  --color-glass-highlight: rgba(255, 255, 255, 0.05);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  --spotlight-color: rgba(255, 255, 255, 0.03);

  /* Charts (Hex) */
  --chart-1: #00a76f;
  --chart-2: #ffab00;
  --chart-3: #ff5630;
  --chart-4: #00b8d9;
  --chart-5: #8e33ff;
}

/* === UTILITIES === */
@layer utilities {
  .glass-panel {
    background: linear-gradient(
      135deg,
      var(--glass-gradient-start),
      var(--glass-gradient-end)
    );
    backdrop-filter: blur(10px) saturate(180%);
    -webkit-backdrop-filter: blur(10px) saturate(180%);
    border: 1px solid var(--color-glass-border);
    box-shadow: var(--glass-shadow);
  }
}
```

---

### 3. 📦 Componentes Essenciais

Instale os componentes fundamentais para o ecossistema Kaven:

```bash
cd apps/admin
# Instalar components base
npx shadcn@latest add button card badge alert input label switch checkbox radio-group separator tooltip scroll-area sheet
```

---

### 4. 🧭 Infraestrutura Styleguide (i18n + Sidebar)

#### `apps/admin/app/[locale]/styleguide/layout.tsx`

Use o padrão de sidebar persistente.

```tsx
'use client';

import { Link } from '@/components/navigation'; // Kaven i18n wrapper
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
// ... importar navigation config ...

// (Use a implementação padrão de layout com Sidebar de 64/250px)
```

#### `apps/admin/app/[locale]/styleguide/page.tsx`

Crie um **Live Preview Dashboard**.

- Use classes utilitárias semânticas: `bg-success-main`, `text-error-dark`.
- Teste o **StatCard** pattern (Glassmorphism).
- Inclua uma seção de **Typography** mostrando `Barlow` (Display) vs `DM Sans` (Body).

---

## ✅ Definição de Concluído (DoD)

1.  `globals.css` refatorado seguindo o template exato acima.
2.  Variáveis de Glassmorphism (`--glass-gradient-start`, etc.) implementadas e funcionais.
3.  Modo Dark usa Hex Codes compatíveis com Minimals; Modo Light usa OKLCH.
4.  Componentes base instalados.
5.  Rota `/styleguide` acessível e demonstrando a troca de temas.
