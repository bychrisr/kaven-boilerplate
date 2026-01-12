# Alert - Design System Minimals

## ⚠️ Visão Geral

Componente para exibir mensagens de feedback ao usuário.

## Variantes

### Success

```tsx
<Alert severity="success">Operação realizada com sucesso!</Alert>
```

### Error

```tsx
<Alert severity="error">Ocorreu um erro ao processar a solicitação.</Alert>
```

### Warning

```tsx
<Alert severity="warning">Atenção: Esta ação não pode ser desfeita.</Alert>
```

### Info

```tsx
<Alert severity="info">Informação importante sobre o sistema.</Alert>
```

## Com Título

```tsx
<Alert severity="success" title="Sucesso">
  Seus dados foram salvos corretamente.
</Alert>
```

## Com Ação

```tsx
<Alert
  severity="error"
  action={
    <Button size="sm" variant="text">
      Tentar novamente
    </Button>
  }
>
  Falha ao carregar dados.
</Alert>
```

## Estilos

- **Radius**: md (8px)
- **Padding**: 16px
- **Icon**: Alinhado à esquerda

## Best Practices

### ✅ Fazer

- Usar severity apropriado
- Mensagens claras e concisas
- Fornecer ação quando aplicável

### ❌ Não Fazer

- Mensagens muito longas
- Múltiplos alerts na mesma área
- Usar para conteúdo permanente
