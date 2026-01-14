# Sistema de Conversão de Moedas via API

## Objetivo

Implementar sistema de conversão de preços entre moedas fiat e criptomoedas usando APIs públicas de cotação em tempo real.

## API Recomendada: CoinGecko (Free Tier)

**Por quê CoinGecko?**

- ✅ API gratuita robusta (50 chamadas/minuto)
- ✅ Suporta 10,000+ criptomoedas
- ✅ Conversão fiat ↔ crypto
- ✅ Dados históricos
- ✅ Sem necessidade de API key (tier gratuito)

**Alternativas**:

- CoinMarketCap (requer API key)
- Binance API (mais complexa)
- CryptoCompare (limite menor)

---

## Implementação

### 1. Backend - Service de Conversão

#### [NEW] `apps/api/src/modules/currencies/services/currency-exchange.service.ts`

```typescript
import axios from 'axios';

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: Date;
}

export class CurrencyExchangeService {
  private readonly COINGECKO_API = 'https://api.coingecko.com/api/v3';
  private cache: Map<string, { rate: number; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 30000; // 30 segundos (conforme solicitado)

  /**
   * Obtém taxa de conversão entre duas moedas
   * Suporta: Fiat ↔ Fiat, Fiat ↔ Crypto, Crypto ↔ Crypto
   * @param from Moeda origem (BRL, USD, SATS, etc)
   * @param to Moeda destino (BRL, USD, SATS, etc)
   * @returns Taxa de conversão em tempo real
   */
  async getExchangeRate(from: string, to: string): Promise<number> {
    if (from === to) return 1;

    const cacheKey = `${from}_${to}`;
    const cached = this.cache.get(cacheKey);

    // Verificar cache (30s TTL)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.rate;
    }

    // Buscar taxa atualizada da API
    const rate = await this.fetchExchangeRate(from, to);

    // Salvar no cache
    this.cache.set(cacheKey, {
      rate,
      timestamp: Date.now(),
    });

    return rate;
  }

  /**
   * Busca taxa de conversão da API CoinGecko
   * IMPORTANTE: CoinGecko fornece cotações em tempo real para:
   * - Crypto ↔ Fiat (ex: SATS → BRL)
   * - Fiat ↔ Fiat (ex: BRL → USD) usando BTC como ponte
   */
  private async fetchExchangeRate(from: string, to: string): Promise<number> {
    // Mapeamento de códigos para IDs do CoinGecko
    const cryptoMap: Record<string, string> = {
      SATS: 'bitcoin', // sats usa preço do BTC
      BTC: 'bitcoin',
      ETH: 'ethereum',
      USDT: 'tether',
    };

    const fiatMap: Record<string, string> = {
      BRL: 'brl',
      USD: 'usd',
      EUR: 'eur',
      GBP: 'gbp',
    };

    // Caso 1: Crypto → Fiat
    if (cryptoMap[from] && fiatMap[to]) {
      const cryptoId = cryptoMap[from];
      const fiatCode = fiatMap[to];

      const { data } = await axios.get(`${this.COINGECKO_API}/simple/price`, {
        params: {
          ids: cryptoId,
          vs_currencies: fiatCode,
        },
      });

      let rate = data[cryptoId][fiatCode];

      // Se for SATS, ajustar para sats (1 BTC = 100,000,000 sats)
      if (from === 'SATS') {
        rate = rate / 100000000;
      }

      return rate;
    }

    // Caso 2: Fiat → Crypto
    if (fiatMap[from] && cryptoMap[to]) {
      const rate = await this.fetchExchangeRate(to, from);
      return 1 / rate;
    }

    // Caso 3: Fiat → Fiat (usar USD como ponte)
    if (fiatMap[from] && fiatMap[to]) {
      if (from === 'USD') {
        return await this.fetchFiatToFiat('USD', to);
      }
      if (to === 'USD') {
        return await this.fetchFiatToFiat(from, 'USD');
      }

      // Converter via USD
      const fromToUsd = await this.fetchFiatToFiat(from, 'USD');
      const usdToTo = await this.fetchFiatToFiat('USD', to);
      return fromToUsd * usdToTo;
    }

    throw new Error(`Unsupported conversion: ${from} → ${to}`);
  }

  /**
   * Conversão fiat-to-fiat usando BTC como ponte
   */
  private async fetchFiatToFiat(from: string, to: string): Promise<number> {
    const fiatCode = fiatMap[to];

    const { data } = await axios.get(`${this.COINGECKO_API}/simple/price`, {
      params: {
        ids: 'bitcoin',
        vs_currencies: `${fiatMap[from]},${fiatCode}`,
      },
    });

    const btcInFrom = data.bitcoin[fiatMap[from]];
    const btcInTo = data.bitcoin[fiatCode];

    return btcInTo / btcInFrom;
  }

  /**
   * Converte valor entre moedas
   */
  async convert(amount: number, from: string, to: string): Promise<number> {
    const rate = await this.getExchangeRate(from, to);
    return amount * rate;
  }

  /**
   * Limpa cache (útil para testes)
   */
  clearCache(): void {
    this.cache.clear();
  }
}
```

### 2. Backend - API Endpoint

```typescript
// apps/api/src/modules/currencies/controllers/currency.controller.ts

/**
 * GET /api/currencies/convert?from=BRL&to=SATS&amount=2000
 * Converte valor entre moedas
 */
async convertCurrency(
  req: FastifyRequest<{
    Querystring: { from: string; to: string; amount: string };
  }>,
  reply: FastifyReply
) {
  try {
    const { from, to, amount } = req.query;

    const convertedAmount = await currencyExchangeService.convert(
      parseFloat(amount),
      from.toUpperCase(),
      to.toUpperCase()
    );

    const rate = await currencyExchangeService.getExchangeRate(
      from.toUpperCase(),
      to.toUpperCase()
    );

    return reply.send({
      from,
      to,
      amount: parseFloat(amount),
      convertedAmount,
      rate,
      timestamp: new Date(),
    });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ error: 'Conversion failed' });
  }
}
```

### 3. Frontend - Hook de Conversão

```typescript
// apps/admin/hooks/use-currency-converter.ts

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  timestamp: Date;
}

export function useCurrencyConverter(
  amount: number,
  from: string,
  to: string,
  enabled: boolean = true,
) {
  return useQuery<ConversionResult>({
    queryKey: ['currency-convert', from, to, amount],
    queryFn: async () => {
      const { data } = await api.get('/api/currencies/convert', {
        params: { from, to, amount },
      });
      return data;
    },
    enabled: enabled && amount > 0,
    staleTime: 30000, // Cache por 30 segundos
    refetchInterval: 30000, // Atualizar a cada 30 segundos (cotação em tempo real)
  });
}
```

---

## Exemplos de Uso

### Exemplo 1: Converter R$ 2.000 para sats

```typescript
const { data } = useCurrencyConverter(2000, 'BRL', 'SATS');

// Resultado:
// {
//   from: 'BRL',
//   to: 'SATS',
//   amount: 2000,
//   convertedAmount: 2051, // (exemplo)
//   rate: 1.0255,
//   timestamp: '2026-01-14T14:30:00Z'
// }
```

### Exemplo 2: Exibir preço em múltiplas moedas

```typescript
function ProductPrice({ priceInBRL }: { priceInBRL: number }) {
  const { data: inUSD } = useCurrencyConverter(priceInBRL, 'BRL', 'USD');
  const { data: inSATS } = useCurrencyConverter(priceInBRL, 'BRL', 'SATS');

  return (
    <div>
      <p>R$ {priceInBRL.toFixed(2)}</p>
      {inUSD && <p>$ {inUSD.convertedAmount.toFixed(2)}</p>}
      {inSATS && (
        <p>
          {Math.round(inSATS.convertedAmount).toLocaleString()} <SatsIcon />
        </p>
      )}
    </div>
  );
}
```

---

## Seed Data Atualizado

```typescript
// packages/database/prisma/seed.ts

const currencies = [
  // Moedas Fiat
  {
    code: 'BRL',
    name: 'Real Brasileiro',
    symbol: 'R$',
    iconType: 'TEXT',
    decimals: 2,
    isActive: true,
    isCrypto: false,
    sortOrder: 1,
  },
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    iconType: 'TEXT',
    decimals: 2,
    isActive: true,
    isCrypto: false,
    sortOrder: 2,
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    iconType: 'TEXT',
    decimals: 2,
    isActive: true,
    isCrypto: false,
    sortOrder: 3,
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    iconType: 'TEXT',
    decimals: 2,
    isActive: true,
    isCrypto: false,
    sortOrder: 4,
  },

  // Criptomoedas
  {
    code: 'SATS',
    name: 'Bitcoin (sats)', // Nome clarifica que é sats
    symbol: null,
    iconType: 'SVG',
    iconSvgPath:
      'M12.75 3V5.5H11.25V3H12.75ZM17 8.75H7V7.25H17V8.75ZM17 12.7499H7V11.2499H17V12.7499ZM17 16.75H7V15.25H17V16.75ZM12.75 18.5V21H11.25V18.5H12.75Z',
    decimals: 0, // Sats não tem decimais
    isActive: true,
    isCrypto: true,
    sortOrder: 10,
  },
];
```

---

## Benefícios da Abordagem

### 1. Simplicidade

- ✅ Sats como unidade padrão (não precisa conversão BTC↔sats)
- ✅ Exibição clara: "Bitcoin (sats)" + ícone
- ✅ Decimals = 0 para sats (valores inteiros)

### 2. Flexibilidade Futura

- ✅ Sistema de conversão preparado para qualquer moeda
- ✅ Fácil adicionar ETH, USDT, etc
- ✅ API pública gratuita e confiável

### 3. Performance

- ✅ Cache de 1 minuto para taxas
- ✅ React Query gerencia refetch automático
- ✅ Evita chamadas desnecessárias

---

## Próximos Passos

1. ✅ Model Currency simplificado (sem baseUnit/conversionRate)
2. ⏳ Implementar CurrencyExchangeService
3. ⏳ Criar endpoint /api/currencies/convert
4. ⏳ Criar hook useCurrencyConverter
5. ⏳ Testar conversões BRL→SATS, USD→SATS
6. ⏳ Documentar uso

**Estimativa**: 3-4 horas para sistema de conversão completo
