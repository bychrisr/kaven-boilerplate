'use client';

import { useState } from 'react';
import { useCurrencyConverter } from '@/hooks/use-currency-converter';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { RefreshCw, TrendingUp } from 'lucide-react';

/**
 * Componente de teste para conversão de moedas em tempo real
 * Útil para validar integração com CoinGecko API
 */
export function CurrencyConverterTest() {
  const [from, setFrom] = useState('BRL');
  const [to, setTo] = useState('SATS');
  const [amount, setAmount] = useState(100);
  const [enabled, setEnabled] = useState(false);

  const { result, rate, isLoading, error, timestamp } = useCurrencyConverter(
    from,
    to,
    amount,
    { enabled }
  );

  const handleConvert = () => {
    setEnabled(true);
  };

  return (
    <Card className="p-6 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Conversor de Moedas</h2>
          <p className="text-sm text-muted-foreground">
            Teste de conversão em tempo real via CoinGecko API
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">De</label>
            <Input
              value={from}
              onChange={(e) => setFrom(e.target.value.toUpperCase())}
              placeholder="BRL"
              className="uppercase"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Para</label>
            <Input
              value={to}
              onChange={(e) => setTo(e.target.value.toUpperCase())}
              placeholder="SATS"
              className="uppercase"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Valor</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            placeholder="100"
          />
        </div>

        <Button onClick={handleConvert} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Convertendo...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Converter
            </>
          )}
        </Button>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
            <p className="font-semibold">Erro:</p>
            <p className="text-sm">{error.message}</p>
          </div>
        )}

        {enabled && !isLoading && !error && result > 0 && (
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Resultado:</span>
              <div className="text-2xl font-bold">
                <CurrencyDisplay value={result} currencyCode={to} />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Taxa:</span>
              <span className="font-mono">
                1 {from} = {rate.toFixed(8)} {to}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Última atualização:</span>
              <span>{new Date(timestamp).toLocaleTimeString('pt-BR')}</span>
            </div>

            <div className="text-xs text-muted-foreground text-center pt-2 border-t">
              ⚡ Atualiza automaticamente a cada 30 segundos
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
