# Design System - Minimals.cc

## 📚 Índice da Documentação

Bem-vindo à documentação completa do Design System baseado no Minimals.cc.

### Fundamentos

1. [Introdução](./01-introduction.md) - Visão geral e filosofia
2. [Cores](./02-colors.md) - Paleta 5-tone e escala de cinzas
3. [Tipografia](./03-typography.md) - Fontes, tamanhos e hierarquia
4. [Shadows](./04-shadows.md) - Sistema de elevação z0-z24
5. [Spacing](./05-spacing.md) - Grid, espaçamento e layout

### Componentes

6. [Button](./06-components/button.md) - Botões e variantes
7. [Card](./06-components/card.md) - Cards e containers
8. [TextField](./06-components/text-field.md) - Inputs e formulários
9. [Dialog](./06-components/dialog.md) - Modais e diálogos
10. [Alert](./06-components/alert.md) - Alertas e notificações
11. [Tabs](./06-components/tabs.md) - Navegação por abas
12. [Table](./06-components/table.md) - Tabelas de dados
13. [Pagination](./06-components/pagination.md) - Paginação
14. [AppBar](./06-components/app-bar.md) - Barra de navegação
15. [Drawer](./06-components/drawer.md) - Sidebar e navegação lateral

### Avançado

16. [Utilities](./07-utilities.md) - Format, Mock, Config
17. [Architecture](./08-architecture.md) - Sections pattern
18. [Best Practices](./09-best-practices.md) - Guidelines e padrões

---

## 🎯 Objetivo

Este design system fornece uma base sólida e consistente para construir interfaces modernas, acessíveis e performáticas.

## 🚀 Quick Start

```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function MyComponent() {
  return (
    <Card>
      <Button variant="contained" color="primary">
        Começar
      </Button>
    </Card>
  );
}
```

## 📊 Estatísticas

- **Componentes**: 10+ componentes base
- **Cores**: 6 paletas semânticas + 10 tons de cinza
- **Shadows**: 25 níveis de elevação
- **Tipografia**: 2 famílias (DM Sans + Barlow)
- **Redução de código**: ~92% nas páginas
