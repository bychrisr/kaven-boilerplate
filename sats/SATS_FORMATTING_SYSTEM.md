# Sistema de Formatação de Sats

Este documento descreve o sistema unificado para formatação de valores em sats na aplicação.

## Componentes

### SatsIcon

O componente `SatsIcon` agora suporta variantes de cor automáticas:

```tsx
import SatsIcon from '@/components/SatsIcon';

// Uso básico
<SatsIcon size={20} />

// Com variante específica
<SatsIcon size={20} variant="positive" />  // Verde
<SatsIcon size={20} variant="negative" />  // Vermelho
<SatsIcon size={20} variant="neutral" />   // Cinza
<SatsIcon size={20} variant="default" />   // Herda cor do contexto
```

### useFormatSats Hook

Hook para formatação completa com ícone:

```tsx
import { useFormatSats } from '@/hooks/useFormatSats';

const { formatSats } = useFormatSats();

// Formatação automática (cor baseada no valor)
formatSats(1500, { size: 20, variant: 'auto' })

// Formatação específica
formatSats(1500, { size: 20, variant: 'positive' })
formatSats(-1500, { size: 20, variant: 'negative' })
formatSats(0, { size: 20, variant: 'neutral' })

// Sem ícone
formatSats(1500, { showIcon: false })
```

### useFormatSatsText Hook

Hook para formatação apenas de texto:

```tsx
import { useFormatSatsText } from '@/hooks/useFormatSats';

const formatSatsText = useFormatSatsText();

formatSatsText(1500) // "1,500 sats"
formatSatsText(1500000) // "1.5M sats"
```

## Variantes de Cor

- **`positive`**: Verde (`text-green-600 dark:text-green-400`)
- **`negative`**: Vermelho (`text-red-600 dark:text-red-400`)
- **`neutral`**: Cinza (`text-muted-foreground`)
- **`default`**: Herda cor do contexto (`text-current`)
- **`auto`**: Determina automaticamente baseado no valor (positivo/negativo/zero)

## Formatação de Números

- **< 1M**: Formatação completa com separadores (ex: `1,500`)
- **≥ 1M**: Arredondado para milhões (ex: `1.5M`)
- **Zero**: Mostra `0`

## Uso Recomendado

### Para Valores de PnL
```tsx
// Automático - cor baseada no valor
{formatSats(pnl, { size: 20, variant: 'auto' })}
```

### Para Valores Neutros (Margem, Saldo)
```tsx
// Cor padrão do contexto
{formatSats(margin, { size: 20, variant: 'default' })}
```

### Para Valores Indefinidos
```tsx
// Cor neutra
<SatsIcon size={20} variant="neutral" />
```

## Benefícios

1. **Consistência**: Cores padronizadas em toda a aplicação
2. **Manutenibilidade**: Mudanças centralizadas no SatsIcon
3. **Flexibilidade**: Suporte a diferentes contextos e necessidades
4. **Reutilização**: Hooks e componentes reutilizáveis
5. **Acessibilidade**: Cores com contraste adequado para dark/light mode

## Migração

Para migrar código existente:

1. Substitua `SatsIcon` com classes de cor por `variant`
2. Use `useFormatSats` para formatação completa
3. Use `useFormatSatsText` para formatação apenas de texto
4. Prefira `variant="auto"` para valores de PnL
