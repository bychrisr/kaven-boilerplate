import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/currencies
 * Lista todas as moedas ativas
 */
export async function GET() {
  try {
    const currencies = await prisma.currency.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
      select: {
        id: true,
        code: true,
        name: true,
        symbol: true,
        iconType: true,
        iconSvgPath: true,
        decimals: true,
        isActive: true,
        isCrypto: true,
        sortOrder: true,
      },
    });

    return NextResponse.json(currencies);
  } catch (error) {
    console.error('Error fetching currencies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch currencies' },
      { status: 500 }
    );
  }
}
