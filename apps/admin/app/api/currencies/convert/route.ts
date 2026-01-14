import { NextRequest, NextResponse } from 'next/server';
import { CoinGeckoService } from '@/lib/services/coingecko.service';

/**
 * API para conversão de moedas em tempo real
 * 
 * GET /api/currencies/convert?from=BRL&to=SATS&amount=100
 * 
 * Response:
 * {
 *   from: "BRL",
 *   to: "SATS",
 *   amount: 100,
 *   result: 2051,
 *   rate: 20.51,
 *   timestamp: "2026-01-14T19:45:00Z"
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const amountStr = searchParams.get('amount');

    // Validações
    if (!from || !to) {
      return NextResponse.json(
        { error: 'Parâmetros "from" e "to" são obrigatórios' },
        { status: 400 }
      );
    }

    if (!amountStr) {
      return NextResponse.json(
        { error: 'Parâmetro "amount" é obrigatório' },
        { status: 400 }
      );
    }

    const amount = parseFloat(amountStr);

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Parâmetro "amount" deve ser um número positivo' },
        { status: 400 }
      );
    }

    // Buscar taxa de conversão
    const service = CoinGeckoService.getInstance();
    const rate = await service.getExchangeRate(from, to);
    const result = amount * rate;

    return NextResponse.json({
      from,
      to,
      amount,
      result,
      rate,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] Erro na conversão:', error);

    const message = error instanceof Error ? error.message : 'Erro ao converter moedas';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
