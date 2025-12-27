import { FastifyRequest, FastifyReply } from 'fastify';
import { tenantService } from '../services/tenant.service';
import { createTenantSchema, updateTenantSchema } from '../../../lib/validation';

export class TenantController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { page = '1', limit = '10', search, status } = request.query as any;
      const result = await tenantService.listTenants(
        parseInt(page), 
        parseInt(limit),
        search,
        status
      );
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async getStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const stats = await tenantService.getStats();
      reply.send(stats);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const tenant = await tenantService.getTenantById(id);
      reply.send(tenant);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createTenantSchema.parse(request.body);
      const tenant = await tenantService.createTenant(data);
      reply.status(201).send(tenant);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const data = updateTenantSchema.parse(request.body);
      const tenant = await tenantService.updateTenant(id, data);
      reply.send(tenant);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const result = await tenantService.deleteTenant(id);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }
}

export const tenantController = new TenantController();
