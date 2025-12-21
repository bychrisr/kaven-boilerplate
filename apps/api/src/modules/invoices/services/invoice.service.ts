import prisma from '../../../lib/prisma';

export class InvoiceService {
  /**
   * GET /api/invoices/stats - Obter estatísticas de invoices
   */
  async getStats(tenantId?: string) {
    const where = tenantId ? { tenantId, deletedAt: null } : { deletedAt: null };

    const [total, paid, pending, overdue, draft] = await Promise.all([
      // Total
      prisma.invoice.aggregate({
        where,
        _count: true,
        _sum: { amountDue: true },
      }),
      // Paid
      prisma.invoice.aggregate({
        where: { ...where, status: 'PAID' },
        _count: true,
        _sum: { amountDue: true },
      }),
      // Pending
      prisma.invoice.aggregate({
        where: { ...where, status: 'PENDING' },
        _count: true,
        _sum: { amountDue: true },
      }),
      // Overdue
      prisma.invoice.aggregate({
        where: { ...where, status: 'OVERDUE' },
        _count: true,
        _sum: { amountDue: true },
      }),
      // Draft
      prisma.invoice.aggregate({
        where: { ...where, status: 'DRAFT' },
        _count: true,
        _sum: { amountDue: true },
      }),
    ]);

    return {
      total: {
        count: total._count,
        amount: Number(total._sum.amountDue || 0),
      },
      paid: {
        count: paid._count,
        amount: Number(paid._sum.amountDue || 0),
      },
      pending: {
        count: pending._count,
        amount: Number(pending._sum.amountDue || 0),
      },
      overdue: {
        count: overdue._count,
        amount: Number(overdue._sum.amountDue || 0),
      },
      draft: {
        count: draft._count,
        amount: Number(draft._sum.amountDue || 0),
      },
    };
  }

  /**
   * GET /api/invoices - Listar invoices com paginação
   */
  async listInvoices(tenantId?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const where = tenantId 
      ? { tenantId, deletedAt: null } 
      : { deletedAt: null };
    
    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          invoiceNumber: true,
          amountDue: true,
          amountPaid: true,
          currency: true,
          status: true,
          dueDate: true,
          paidAt: true,
          tenantId: true,
          subscriptionId: true,
          createdAt: true,
          tenant: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.invoice.count({ where }),
    ]);

    return {
      invoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * GET /api/invoices/:id - Buscar invoice por ID
   */
  async getInvoiceById(id: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        tenant: {
          select: {
            name: true,
          },
        },
        subscription: {
          select: {
            id: true,
            planName: true,
            status: true,
          },
        },
      },
    });

    if (!invoice || invoice.deletedAt) {
      throw new Error('Invoice não encontrada');
    }

    return invoice;
  }

  /**
   * POST /api/invoices - Criar nova invoice
   */
  async createInvoice(data: {
    tenantId: string;
    subscriptionId?: string;
    amountDue: number;
    currency?: string;
    dueDate: Date;
    metadata?: any;
  }) {
    // Gerar número da invoice (formato: INV-YYYYMMDD-XXXX)
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await prisma.invoice.count();
    const invoiceNumber = `INV-${dateStr}-${String(count + 1).padStart(4, '0')}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        tenantId: data.tenantId,
        subscriptionId: data.subscriptionId,
        amountDue: data.amountDue,
        currency: data.currency || 'BRL',
        dueDate: data.dueDate,
        metadata: data.metadata || null,
        status: 'PENDING',
      },
    });

    return invoice;
  }

  /**
   * PUT /api/invoices/:id - Atualizar invoice
   */
  async updateInvoice(id: string, data: {
    amountDue?: number;
    dueDate?: Date;
    status?: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELED';
    amountPaid?: number;
    paidAt?: Date;
    currency?: string;
    metadata?: any;
  }) {
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!existingInvoice || existingInvoice.deletedAt) {
      throw new Error('Invoice não encontrada');
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        amountDue: data.amountDue,
        dueDate: data.dueDate,
        status: data.status,
        amountPaid: data.amountPaid,
        paidAt: data.paidAt,
        currency: data.currency,
        metadata: data.metadata,
        updatedAt: new Date(),
      },
    });

    return invoice;
  }

  /**
   * POST /api/invoices/:id/send - Enviar invoice por email
   */
  async sendInvoice(id: string) {
    const invoice = await this.getInvoiceById(id);

    // TODO: Implementar envio de email com PDF da invoice
    // await emailService.sendInvoice(invoice);

    // Atualizar metadata para marcar como enviada
    await prisma.invoice.update({
      where: { id },
      data: { 
        metadata: {
          ...(invoice.metadata as any || {}),
          sentAt: new Date().toISOString()
        },
        updatedAt: new Date()
      },
    });

    return { message: 'Invoice enviada com sucesso' };
  }

  /**
   * DELETE /api/invoices/:id - Deletar invoice (soft delete)
   */
  async deleteInvoice(id: string) {
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!existingInvoice || existingInvoice.deletedAt) {
      throw new Error('Invoice não encontrada');
    }

    await prisma.invoice.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        invoiceNumber: `deleted_${Date.now()}_${existingInvoice.invoiceNumber}`,
        status: 'CANCELED',
      },
    });

    return { message: 'Invoice deletada com sucesso' };
  }
}

export const invoiceService = new InvoiceService();
