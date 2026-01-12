# Pagination - Design System Minimals

## 🔢 Visão Geral

Componente para navegar entre páginas de dados.

## Uso Básico

```tsx
<Pagination page={currentPage} count={totalPages} onChange={handlePageChange} />
```

## Com Informações

```tsx
<Pagination page={1} count={10} showFirstButton showLastButton siblingCount={1} />
```

## Estilos

- **Radius**: md (8px)
- **Active**: Background primary
- **Hover**: Background grey.100

## Best Practices

### ✅ Fazer

- Mostrar página atual
- Fornecer navegação rápida (primeira/última)
- Indicar total de páginas

### ❌ Não Fazer

- Omitir informação de página atual
- Botões muito pequenos
- Muitos números de página visíveis
