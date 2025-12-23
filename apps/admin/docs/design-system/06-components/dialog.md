# Dialog - Design System Minimals

## 💬 Visão Geral

Modal para exibir conteúdo sobreposto à página principal.

## Uso Básico

```tsx
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Título</DialogTitle>
  <DialogContent>Conteúdo do modal</DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancelar</Button>
    <Button variant="contained">Confirmar</Button>
  </DialogActions>
</Dialog>
```

## Estilos

- **Radius**: xl (16px)
- **Shadow**: z24
- **Max-width**: 600px
- **Backdrop**: rgba(0,0,0,0.5)

## Tamanhos

```tsx
<Dialog size="sm">Pequeno (400px)</Dialog>
<Dialog size="md">Médio (600px)</Dialog>
<Dialog size="lg">Grande (800px)</Dialog>
```

## Best Practices

### ✅ Fazer

- Sempre fornecer onClose
- Usar DialogActions para botões
- Limitar altura do conteúdo

### ❌ Não Fazer

- Modais muito grandes
- Múltiplos modais empilhados
- Conteúdo sem scroll
