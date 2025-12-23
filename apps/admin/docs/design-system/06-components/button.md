# Button - Design System Minimals

## 🔘 Visão Geral

Componente de botão com múltiplas variantes e cores semânticas.

## Variantes

### Contained (Preenchido)

Botão sólido com background colorido.

```tsx
<Button variant="contained" color="primary">
  Salvar
</Button>
```

**Estilos**:

- Background: Cor principal
- Texto: Branco
- Shadow: z8
- Radius: md (8px)
- Padding: 12px 24px

### Outlined (Contornado)

Botão com borda e fundo transparente.

```tsx
<Button variant="outlined" color="primary">
  Cancelar
</Button>
```

**Estilos**:

- Background: Transparente
- Border: 1px solid
- Texto: Cor principal
- Radius: md (8px)

### Text (Texto)

Botão sem borda nem background.

```tsx
<Button variant="text" color="primary">
  Ver mais
</Button>
```

## Cores

```tsx
<Button color="primary">Primary</Button>
<Button color="secondary">Secondary</Button>
<Button color="success">Success</Button>
<Button color="error">Error</Button>
<Button color="warning">Warning</Button>
<Button color="info">Info</Button>
```

## Tamanhos

```tsx
<Button size="sm">Pequeno</Button>
<Button size="md">Médio</Button>
<Button size="lg">Grande</Button>
```

## Estados

### Disabled

```tsx
<Button disabled>Desabilitado</Button>
```

### Loading

```tsx
<Button loading>Carregando...</Button>
```

## Best Practices

### ✅ Fazer

- Usar `contained` para ações primárias
- Usar `outlined` para ações secundárias
- Usar `text` para ações terciárias
- Limitar a 1-2 botões primários por tela

### ❌ Não Fazer

- Múltiplos botões `contained` na mesma área
- Botões muito pequenos (\u003c40px altura)
- Texto muito longo em botões
