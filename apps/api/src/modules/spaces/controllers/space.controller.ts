import { FastifyRequest, FastifyReply } from 'fastify';
import { spaceService } from '../services/space.service';

export class SpaceController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Extract tenantId from authenticated user or header
      const tenantId = (request as any).tenantId || (request as any).user?.tenantId;
      console.log('🔍 [Backend] SpaceController.list called. TenantId:', tenantId);
      
      const spaces = await spaceService.listSpaces(tenantId);
      console.log('✅ [Backend] SpaceService returned spaces:', spaces);
      
      reply.send({ spaces }); 
    } catch (error: any) {
      console.error('❌ [Backend] SpaceController error:', error);
      reply.status(400).send({ error: error.message });
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const space = await spaceService.getSpaceById(id);
      reply.send(space);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }
}

export const spaceController = new SpaceController();
