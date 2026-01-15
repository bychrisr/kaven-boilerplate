import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { currencySchema, validateCurrencyData } from '@/lib/validations/currency';

/**
 * GET /api/currencies/[code]
 * Busca uma moeda por código (ex: BRL, USD, SATS)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  console.log('[DEBUG] API GET /api/currencies/[code] chamada');
  console.log('[DEBUG] Request URL:', request.url);
  console.log('[DEBUG] Params (antes await):', params);
  
  try {
    const resolvedParams = await params;
    console.log('[DEBUG] Params (depois await):', resolvedParams);
    
    const { code } = resolvedParams;
    console.log('[DEBUG] Code extraído:', code);
    
    const upperCode = code.toUpperCase();
    console.log('[DEBUG] Buscando currency com code:', upperCode);
    
    const currency = await prisma.currency.findUnique({
      where: { code: upperCode },
    });

    console.log('[DEBUG] Currency encontrada:', currency ? 'SIM' : 'NÃO', currency);

    if (!currency) {
      console.log('[DEBUG] Retornando 404 - Currency not found');
      return NextResponse.json(
        { error: 'Currency not found' },
        { status: 404 }
      );
    }

    console.log('[DEBUG] Retornando currency:', currency.code);
    return NextResponse.json(currency);
  } catch (error) {
    console.error('[DEBUG] Erro no GET handler:', error);
    return NextResponse.json(
      { error: 'Failed to fetch currency' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/currencies/[code]
 * Atualiza uma moeda
 * Requer: SUPER_ADMIN
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
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

    // Verificar se currency existe
    const existing = await prisma.currency.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Currency not found' },
        { status: 404 }
      );
    }

    // Verificar se código já existe (se mudou)
    if (data.code !== existing.code) {
      const codeExists = await prisma.currency.findUnique({
        where: { code: data.code },
      });

      if (codeExists) {
        return NextResponse.json(
          { error: `Currency with code ${data.code} already exists` },
          { status: 409 }
        );
      }
    }

    // Atualizar currency
    const currency = await prisma.currency.update({
      where: { code: code.toUpperCase() },
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

    return NextResponse.json(currency);
  } catch (error) {
    console.error('Error updating currency:', error);
    return NextResponse.json(
      { error: 'Failed to update currency' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/currencies/[code]
 * Desativa uma moeda (soft delete)
 * Requer: SUPER_ADMIN
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    
    // Verificar se currency existe
    const existing = await prisma.currency.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Currency not found' },
        { status: 404 }
      );
    }

    // Soft delete (desativar)
    await prisma.currency.update({
      where: { code: code.toUpperCase() },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting currency:', error);
    return NextResponse.json(
      { error: 'Failed to delete currency' },
      { status: 500 }
    );
  }
}
