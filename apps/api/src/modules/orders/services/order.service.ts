import prisma from '../../../lib/prisma';

export class OrderService {
  /**
   * GET /api/orders - Listar orders com paginação
   */
  async listOrders(tenantId?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const where = tenantId 
      ? { tenantId, deletedAt: null } 
      : { deletedAt: null };
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          orderNumber: true,
          totalAmount: true,
          currency: true,
          status: true,
          tenantId: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * GET /api/orders/:id - Buscar order por ID
   */
  async getOrderById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        payments: true,
      },
    });

    if (!order || order.deletedAt) {
      throw new Error('Order não encontrada');
    }

    return order;
  }

  /**
   * POST /api/orders - Criar nova order
   */
  async createOrder(data: {
    tenantId: string;
    totalAmount: number;
    currency?: string;
    metadata?: any;
  }) {
    // Gerar número da order (formato: ORD-YYYYMMDD-XXXX)
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await prisma.order.count();
    const orderNumber = `ORD-${dateStr}-${String(count + 1).padStart(4, '0')}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        tenantId: data.tenantId,
        totalAmount: data.totalAmount,
        currency: data.currency || 'BRL',
        status: 'PENDING',
        metadata: data.metadata || null,
      },
    });

    return order;
  }

  /**
   * PUT /api/orders/:id/status - Atualizar status da order
   */
  async updateOrderStatus(id: string, status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELED' | 'REFUNDED') {
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder || existingOrder.deletedAt) {
      throw new Error('Order não encontrada');
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    return order;
  }

  /**
   * DELETE /api/orders/:id - Deletar order (soft delete)
   */
  async deleteOrder(id: string) {
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder || existingOrder.deletedAt) {
      throw new Error('Order não encontrada');
    }

    await prisma.order.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Order deletada com sucesso' };
  }
}

export const orderService = new OrderService();
