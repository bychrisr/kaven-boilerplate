# Tipografia - Design System Minimals

## 📝 Visão Geral

Sistema tipográfico com 2 famílias de fontes complementares:

- **DM Sans**: Fonte principal para UI e conteúdo
- **Barlow**: Fonte display para títulos e destaques

## Famílias de Fontes

### DM Sans (Principal)

Fonte sans-serif moderna e legível, usada para a maioria do conteúdo.

**Pesos disponíveis**:

- Regular (400)
- Medium (500)
- Semi Bold (600)
- Bold (700)

**Uso**:

- Corpo de texto
- Botões
- Formulários
- Navegação

**Exemplo**:

```tsx
<p className="font-sans text-base">Texto em DM Sans</p>
```

### Barlow (Display)

Fonte geométrica para títulos e elementos de destaque.

**Pesos disponíveis**:

- Medium (500)
- Semi Bold (600)
- Bold (700)

**Uso**:

- Títulos principais (h1, h2)
- Logotipos
- Call-to-actions importantes

**Exemplo**:

```tsx
<h1 className="font-display text-4xl font-bold">Título em Barlow</h1>
```

## Escala Tipográfica

### Tamanhos de Texto

| Classe      | Tamanho | Line Height | Uso                        |
| ----------- | ------- | ----------- | -------------------------- |
| `text-xs`   | 12px    | 18px        | Labels pequenos, badges    |
| `text-sm`   | 14px    | 20px        | Texto secundário, captions |
| `text-base` | 16px    | 24px        | Corpo de texto padrão      |
| `text-lg`   | 18px    | 28px        | Texto destacado            |
| `text-xl`   | 20px    | 28px        | Subtítulos                 |
| `text-2xl`  | 24px    | 32px        | Títulos de seção           |
| `text-3xl`  | 30px    | 36px        | Títulos de página          |
| `text-4xl`  | 36px    | 40px        | Títulos principais         |
| `text-5xl`  | 48px    | 1           | Hero titles                |

### Hierarquia de Títulos

```tsx
// h1 - Título principal da página
<h1 className="font-display text-4xl font-bold text-grey-900">
  Título Principal
</h1>

// h2 - Seções principais
<h2 className="font-display text-3xl font-semibold text-grey-800">
  Seção Principal
</h2>

// h3 - Subseções
<h3 className="font-sans text-2xl font-semibold text-grey-800">
  Subseção
</h3>

// h4 - Títulos de cards/componentes
<h4 className="font-sans text-xl font-medium text-grey-700">
  Título de Card
</h4>

// h5 - Subtítulos menores
<h5 className="font-sans text-lg font-medium text-grey-700">
  Subtítulo
</h5>

// h6 - Labels e categorias
<h6 className="font-sans text-sm font-semibold text-grey-600 uppercase tracking-wider">
  Categoria
</h6>
```

## Pesos de Fonte

| Classe          | Peso | Uso             |
| --------------- | ---- | --------------- |
| `font-normal`   | 400  | Corpo de texto  |
| `font-medium`   | 500  | Texto destacado |
| `font-semibold` | 600  | Subtítulos      |
| `font-bold`     | 700  | Títulos, botões |

## Espaçamento de Letras

```tsx
// Tracking normal (padrão)
<p className="tracking-normal">
  Texto normal
</p>

// Tracking wide (para uppercase)
<p className="uppercase tracking-wider text-xs">
  Label Uppercase
</p>

// Tracking tight (para títulos grandes)
<h1 className="text-5xl tracking-tight">
  Título Grande
</h1>
```

## Cores de Texto

### Hierarquia de Cores

```tsx
// Texto primário (mais escuro)
<p className="text-grey-900">
  Texto principal
</p>

// Texto secundário
<p className="text-grey-600">
  Texto secundário
</p>

// Texto disabled
<p className="text-grey-500">
  Texto desabilitado
</p>

// Texto em backgrounds escuros
<div className="bg-grey-900">
  <p className="text-white">
    Texto em fundo escuro
  </p>
</div>
```

## Line Height

### Regras Gerais

- **Corpo de texto**: 1.5x o tamanho da fonte
- **Títulos**: 1.2x o tamanho da fonte
- **Botões/UI**: 1x o tamanho da fonte

```tsx
// Corpo de texto
<p className="text-base leading-6">
  Texto com line-height 1.5
</p>

// Título
<h2 className="text-3xl leading-tight">
  Título com line-height 1.2
</h2>

// Botão
<button className="text-sm leading-none">
  Botão
</button>
```

## Exemplos de Uso

### Card com Título e Descrição

```tsx
<Card>
  <h3 className="font-sans text-xl font-semibold text-grey-800 mb-2">
    Título do Card
  </h3>
  <p className="text-base text-grey-600 leading-relaxed">
    Descrição do card com texto secundário e line-height confortável para
    leitura.
  </p>
</Card>
```

### Formulário

```tsx
<div>
  <label className="block text-sm font-medium text-grey-700 mb-1">
    Nome Completo
  </label>
  <input
    type="text"
    className="text-base text-grey-900 placeholder:text-grey-500"
    placeholder="Digite seu nome"
  />
  <p className="text-xs text-grey-500 mt-1">
    Seu nome será usado para identificação
  </p>
</div>
```

### Lista de Navegação

```tsx
<nav>
  <h6 className="text-xs font-semibold text-grey-500 uppercase tracking-wider mb-2">
    Menu
  </h6>
  <ul>
    <li>
      <a className="text-sm font-medium text-grey-700 hover:text-primary-main">
        Dashboard
      </a>
    </li>
    <li>
      <a className="text-sm font-medium text-grey-700 hover:text-primary-main">
        Usuários
      </a>
    </li>
  </ul>
</nav>
```

## Acessibilidade

### Tamanho Mínimo

- **Texto normal**: Mínimo 16px (text-base)
- **Texto pequeno**: Mínimo 14px (text-sm), usar com moderação
- **Labels**: Mínimo 12px (text-xs), apenas para metadados

### Contraste

- Texto normal em grey-900 sobre branco: 16.1:1 ✅
- Texto secundário em grey-600 sobre branco: 5.7:1 ✅
- Texto disabled em grey-500 sobre branco: 4.6:1 ✅

## Best Practices

### ✅ Fazer

- Usar DM Sans para corpo de texto
- Usar Barlow para títulos principais
- Manter hierarquia clara (h1 > h2 > h3)
- Usar line-height adequado para legibilidade
- Limitar a 2-3 tamanhos de fonte por página

### ❌ Não Fazer

- Misturar muitas fontes diferentes
- Usar tamanhos muito pequenos (\u003c12px)
- Ignorar hierarquia de títulos
- Usar ALL CAPS em textos longos
- Usar line-height muito apertado

## Referências

- [DM Sans - Google Fonts](https://fonts.google.com/specimen/DM+Sans)
- [Barlow - Google Fonts](https://fonts.google.com/specimen/Barlow)
- [Typography Best Practices](https://material.io/design/typography)
