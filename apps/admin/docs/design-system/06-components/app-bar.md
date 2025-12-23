# AppBar - Design System Minimals

## 🎯 Visão Geral

Barra de navegação superior fixa com logo, navegação e ações.

## Uso Básico

```tsx
<AppBar>
  <Logo />
  <Navigation />
  <UserMenu />
</AppBar>
```

## Estilos

- **Height**: 72px
- **Shadow**: z8
- **Background**: Branco
- **Position**: Fixed top

## Com Busca

```tsx
<AppBar>
  <Logo />
  <SearchBar />
  <Notifications />
  <UserMenu />
</AppBar>
```

## Best Practices

### ✅ Fazer

- Manter altura fixa (72px)
- Logo à esquerda
- Ações à direita
- Usar shadow z8

### ❌ Não Fazer

- AppBar muito alto (\u003e80px)
- Muitos elementos
- Sem contraste com conteúdo
