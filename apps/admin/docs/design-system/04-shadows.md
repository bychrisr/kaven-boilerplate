# Shadows & Elevation - Design System Minimals

## 🌑 Visão Geral

Sistema de elevação com 25 níveis (z0-z24) + custom shadows por cor semântica.

## Níveis de Elevação

### z0 - z8 (Baixa Elevação)

Elementos próximos à superfície base.

| Nível | Shadow                          | Uso              |
| ----- | ------------------------------- | ---------------- |
| z0    | none                            | Elementos planos |
| z1    | `0 1px 2px 0 rgba(0,0,0,0.05)`  | Hover sutil      |
| z4    | `0 4px 8px 0 rgba(0,0,0,0.1)`   | Cards, inputs    |
| z8    | `0 8px 16px 0 rgba(0,0,0,0.15)` | Botões, app bar  |

**Exemplo**:

```tsx
// Card com elevação z4
<Card className="shadow-z4">
  Conteúdo
</Card>

// Botão com elevação z8
<Button className="shadow-z8">
  Ação
</Button>
```

### z12 - z16 (Média Elevação)

Elementos flutuantes e modais.

| Nível | Shadow                              | Uso                 |
| ----- | ----------------------------------- | ------------------- |
| z12   | `0 12px 24px -4px rgba(0,0,0,0.12)` | Dropdowns, popovers |
| z16   | `0 16px 32px -4px rgba(0,0,0,0.16)` | Modais pequenos     |

**Exemplo**:

```tsx
// Dropdown
<div className="shadow-z12">
  Menu
</div>

// Modal
<Dialog className="shadow-z16">
  Conteúdo do modal
</Dialog>
```

### z20 - z24 (Alta Elevação)

Elementos críticos e overlays.

| Nível | Shadow                             | Uso               |
| ----- | ---------------------------------- | ----------------- |
| z20   | `0 20px 40px -4px rgba(0,0,0,0.2)` | Modais grandes    |
| z24   | `0 24px 48px 0 rgba(0,0,0,0.24)`   | Drawers, sidebars |

**Exemplo**:

```tsx
// Modal grande
<Dialog className="shadow-z20">
  Formulário extenso
</Dialog>

// Drawer
<Drawer className="shadow-z24">
  Navegação lateral
</Drawer>
```

## Custom Shadows por Cor

Shadows coloridos para feedback semântico.

### Valores

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

### Uso

```tsx
// Botão primário com shadow colorido
<Button
  variant="contained"
  color="primary"
  className="shadow-[0_8px_16px_0_rgba(24,119,242,0.24)]"
>
  Salvar
</Button>

// Card de sucesso
<Card className="bg-success-lighter shadow-[0_8px_16px_0_rgba(34,197,94,0.24)]">
  Operação concluída!
</Card>
```

## Hierarquia de Elevação

### Regras Gerais

1. **Base (z0)**: Backgrounds, superfícies planas
2. **Baixa (z1-z8)**: Cards, botões, inputs
3. **Média (z12-z16)**: Dropdowns, tooltips, modais pequenos
4. **Alta (z20-z24)**: Modais grandes, drawers, overlays

### Stacking Context

```tsx
// Estrutura de camadas
<div className="relative">
  {/* Base - z0 */}
  <div className="bg-white">Conteúdo base</div>

  {/* Card - z4 */}
  <Card className="shadow-z4">Card flutuante</Card>

  {/* Dropdown - z12 */}
  <Menu className="shadow-z12">Menu dropdown</Menu>

  {/* Modal - z20 */}
  <Dialog className="shadow-z20">Modal principal</Dialog>
</div>
```

## Animações de Elevação

### Hover States

```tsx
// Elevação ao hover
<Card className="shadow-z4 hover:shadow-z8 transition-shadow duration-300">
  Card interativo
</Card>

// Botão com elevação
<Button className="shadow-z8 hover:shadow-z12 transition-shadow">
  Hover me
</Button>
```

### Active States

```tsx
// Redução de elevação ao clicar
<Button className="shadow-z8 active:shadow-z4 transition-shadow">Click me</Button>
```

## Best Practices

### ✅ Fazer

- Usar elevação consistente para elementos similares
- Aumentar elevação ao hover
- Reduzir elevação ao active/pressed
- Usar custom shadows para feedback semântico
- Animar transições de shadow (300ms)

### ❌ Não Fazer

- Usar muitos níveis de elevação na mesma tela
- Pular níveis (z4 → z20)
- Usar shadows muito pesados (opacidade \u003e 0.3)
- Ignorar hierarquia visual

## Acessibilidade

### Contraste

Shadows devem criar contraste suficiente sem depender apenas da cor:

```tsx
// ✅ Bom - Shadow visível
<Card className="bg-white shadow-z8">
  Conteúdo
</Card>

// ❌ Ruim - Shadow muito sutil
<Card className="bg-white shadow-z1">
  Difícil de distinguir
</Card>
```

### Motion

Respeitar preferências de movimento reduzido:

```tsx
<Card className="shadow-z4 hover:shadow-z8 transition-shadow motion-reduce:transition-none">
  Conteúdo
</Card>
```

## Referências

- [Material Design Elevation](https://material.io/design/environment/elevation.html)
- [Minimals.cc Shadows](https://minimals.cc)
