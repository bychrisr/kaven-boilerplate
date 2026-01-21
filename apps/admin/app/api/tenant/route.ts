import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/tenant
 * Retorna dados do tenant atual do usuário logado
 */
export async function GET() {
  try {
    // TODO: Pegar tenantId do token JWT ou header
    // Por enquanto, vamos buscar o primeiro tenant (Admin Tenant)
    const tenant = await prisma.tenant.findFirst({
      select: {
        id: true,
        name: true,
        slug: true,
      }
    });

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    // TODO: Buscar plan do tenant (quando implementarmos billing)
    const plan = 'FREE'; // Hardcoded por enquanto

    return NextResponse.json({
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      plan
    });
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenant' },
      { status: 500 }
    );
  }
}
