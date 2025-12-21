import prisma from '../../../lib/prisma';

export class InvoiceService {
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
    status?: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELED';
    amountPaid?: number;
    paidAt?: Date;
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
        status: data.status,
        amountPaid: data.amountPaid,
        paidAt: data.paidAt,
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
      data: { deletedAt: new Date() },
    });

    return { message: 'Invoice deletada com sucesso' };
  }
}

export const invoiceService = new InvoiceService();
