import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/spaces
 * Retorna lista de spaces disponíveis para o usuário logado
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Pegar user do token JWT
    // Por enquanto, vamos retornar todos os spaces (Super Admin)
    
    const spaces = [
      {
        id: 'ARCHITECT',
        name: 'Admin',
        icon: 'Crown',
        color: 'purple'
      },
      {
        id: 'FINANCE',
        name: 'Finance',
        icon: 'DollarSign',
        color: 'green'
      },
      {
        id: 'SUPPORT',
        name: 'Support',
        icon: 'Headphones',
        color: 'blue'
      },
      {
        id: 'MARKETING',
        name: 'Marketing',
        icon: 'TrendingUp',
        color: 'orange'
      },
      {
        id: 'DEVOPS',
        name: 'DevOps',
        icon: 'Server',
        color: 'red'
      }
    ];

    // TODO: Filtrar spaces baseado na role do usuário
    // Se user.metadata.internalRole === 'FINANCE', retornar apenas Finance
    // Se user.role === 'SUPER_ADMIN', retornar todos

    return NextResponse.json({ spaces });
  } catch (error) {
    console.error('Error fetching spaces:', error);
    return NextResponse.json(
      { error: 'Failed to fetch spaces' },
      { status: 500 }
    );
  }
}
