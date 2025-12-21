import { FastifyRequest, FastifyReply } from 'fastify';
import { invoiceService } from '../services/invoice.service';

export class InvoiceController {
  async getStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const tenantId = request.headers['x-tenant-id'] as string | undefined;
      const stats = await invoiceService.getStats(tenantId);
      reply.send(stats);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { page = '1', limit = '10', tenantId } = request.query as any;
      const result = await invoiceService.listInvoices(
        tenantId,
        parseInt(page),
        parseInt(limit)
      );
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const invoice = await invoiceService.getInvoiceById(id);
      reply.send(invoice);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.body as any;
      const invoice = await invoiceService.createInvoice(data);
      reply.status(201).send(invoice);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const data = request.body as any;
      const invoice = await invoiceService.updateInvoice(id, data);
      reply.send(invoice);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async send(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const result = await invoiceService.sendInvoice(id);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const result = await invoiceService.deleteInvoice(id);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }
}

export const invoiceController = new InvoiceController();
