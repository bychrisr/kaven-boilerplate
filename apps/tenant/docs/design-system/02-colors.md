# Cores - Design System Minimals

## 🎨 Visão Geral

Sistema de cores 5-tone inspirado no Minimals.cc, com paleta profissional e moderna.

## Paleta Semântica

### Primary (Blue)

Cor principal do sistema, usada para ações primárias e elementos de destaque.

**Valores**:

```typescript
primary: {
  lighter: '#D0ECFE',  // Backgrounds sutis
  light: '#73BAFB',    // Hover states
  main: '#1877F2',     // ← Cor principal
  dark: '#0C44AE',     // Active states
  darker: '#042174',   // Texto em backgrounds claros
}
```

**Uso**:

- Botões primários
- Links
- Active states
- Focus rings

**Exemplo**:

```tsx
<Button variant="contained" color="primary">
  Salvar
</Button>

<div className="bg-primary-main text-white p-4">
  Destaque
</div>
```

### Secondary (Purple)

Cor secundária para ações alternativas e variações.

**Valores**:

```typescript
secondary: {
  lighter: '#EFD6FF',
  light: '#C684FF',
  main: '#8E33FF',     // ← Cor principal
  dark: '#5119B7',
  darker: '#27097A',
}
```

**Uso**:

- Botões secundários
- Badges especiais
- Elementos decorativos

### Success (Green)

Feedback positivo, confirmações e estados de sucesso.

**Valores**:

```typescript
success: {
  lighter: '#D3FCD2',
  light: '#77ED8B',
  main: '#22C55E',     // ← Cor principal
  dark: '#118D57',
  darker: '#065E49',
}
```

**Uso**:

- Alertas de sucesso
- Status "ativo" ou "aprovado"
- Ícones de confirmação

### Warning (Orange)

Avisos e alertas que requerem atenção.

**Valores**:

```typescript
warning: {
  lighter: '#FFF5CC',
  light: '#FFD666',
  main: '#FFAB00',     // ← Cor principal
  dark: '#B76E00',
  darker: '#7A4100',
}
```

**Uso**:

- Alertas de atenção
- Status "pendente"
- Avisos não críticos

### Error (Red)

Erros, ações destrutivas e estados críticos.

**Valores**:

```typescript
error: {
  lighter: '#FFE9D5',
  light: '#FFAC82',
  main: '#FF5630',     // ← Cor principal
  dark: '#B71D18',
  darker: '#7A0916',
}
```

**Uso**:

- Alertas de erro
- Botões destrutivos (deletar)
- Mensagens de validação

### Info (Cyan)

Informações neutras e dicas.

**Valores**:

```typescript
info: {
  lighter: '#CAFDF5',
  light: '#61F3F3',
  main: '#00B8D9',     // ← Cor principal
  dark: '#006C9C',
  darker: '#003768',
}
```

**Uso**:

- Alertas informativos
- Tooltips
- Badges de informação

## Escala de Cinzas

10 níveis de cinza para backgrounds, borders e textos.

**Valores**:

```typescript
grey: {
  50: '#FCFDFD',   // Quase branco
  100: '#F9FAFB',  // Background padrão
  200: '#F4F6F8',  // Background neutro
  300: '#DFE3E8',  // Borders
  400: '#C4CDD5',  // Borders hover
  500: '#919EAB',  // Text disabled
  600: '#637381',  // Text secondary
  700: '#454F5B',  // Text primary light
  800: '#1C252E',  // Text primary
  900: '#141A21',  // Quase preto
}
```

**Uso por Nível**:

| Nível   | Uso Principal               |
| ------- | --------------------------- |
| 50-200  | Backgrounds                 |
| 300-400 | Borders                     |
| 500-600 | Texto secundário / disabled |
| 700-900 | Texto primário              |

**Exemplo**:

```tsx
// Background
<div className="bg-grey-100">
  Conteúdo
</div>

// Border
<div className="border border-grey-300">
  Card
</div>

// Texto
<p className="text-grey-800">
  Texto principal
</p>
<p className="text-grey-600">
  Texto secundário
</p>
```

## Custom Shadows

Shadows customizados por cor para elevação semântica.

**Valores**:

```typescript
customShadows: {
  primary: '0 8px 16px 0 rgb(24 119 242 / 0.24)',
  secondary: '0 8px 16px 0 rgb(142 51 255 / 0.24)',
  success: '0 8px 16px 0 rgb(34 197 94 / 0.24)',
  warning: '0 8px 16px 0 rgb(255 171 0 / 0.24)',
  error: '0 8px 16px 0 rgb(255 86 48 / 0.24)',
  info: '0 8px 16px 0 rgb(0 184 217 / 0.24)',
}
```

**Uso**:

```tsx
<Button className="shadow-[0_8px_16px_0_rgba(24,119,242,0.24)]">Botão com shadow primário</Button>
```

## Acessibilidade

### Contraste de Cores

Todas as combinações de cores atendem WCAG AA:

- **Texto normal**: Contraste mínimo 4.5:1
- **Texto grande**: Contraste mínimo 3:1
- **Elementos UI**: Contraste mínimo 3:1

### Combinações Recomendadas

```tsx
// ✅ Bom contraste
<div className="bg-primary-main text-white">
  Texto legível
</div>

// ✅ Bom contraste
<div className="bg-grey-100 text-grey-800">
  Texto legível
</div>

// ❌ Contraste insuficiente
<div className="bg-primary-lighter text-white">
  Texto ilegível
</div>
```

## Best Practices

### ✅ Fazer

- Usar cores semânticas (success, error, warning)
- Manter consistência nas variantes (lighter, light, main, dark, darker)
- Usar grey scale para neutralidade
- Testar contraste de cores

### ❌ Não Fazer

- Usar cores hardcoded (`#1877F2`)
- Misturar cores de paletas diferentes sem propósito
- Usar cores muito saturadas para grandes áreas
- Ignorar acessibilidade

## Referências

- [Minimals.cc Color System](https://minimals.cc)
- [WCAG Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
