import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { currencySchema, validateCurrencyData } from '@/lib/validations/currency';

/**
 * GET /api/currencies
 * Lista todas as moedas ativas (ou todas se includeInactive=true)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const currencies = await prisma.currency.findMany({
      where: includeInactive ? {} : { isActive: true },
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

/**
 * POST /api/currencies
 * Cria uma nova moeda
 * Requer: SUPER_ADMIN
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar com Zod
    const validationResult = currencySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Validações customizadas
    const customValidation = validateCurrencyData(data);
    if (!customValidation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: customValidation.errors },
        { status: 400 }
      );
    }

    // Verificar se código já existe
    const existing = await prisma.currency.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Currency with code ${data.code} already exists` },
        { status: 409 }
      );
    }

    // Criar currency
    const currency = await prisma.currency.create({
      data: {
        code: data.code,
        name: data.name,
        symbol: data.symbol || null,
        iconType: data.iconType,
        iconSvgPath: data.iconSvgPath || null,
        decimals: data.decimals,
        isActive: data.isActive,
        isCrypto: data.isCrypto,
        sortOrder: data.sortOrder,
        metadata: data.metadata || null,
      },
    });

    return NextResponse.json(currency, { status: 201 });
  } catch (error) {
    console.error('Error creating currency:', error);
    return NextResponse.json(
      { error: 'Failed to create currency' },
      { status: 500 }
    );
  }
}
