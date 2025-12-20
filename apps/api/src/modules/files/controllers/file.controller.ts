import { FastifyRequest, FastifyReply } from 'fastify';
import { fileService } from '../services/file.service';

export class FileController {
  async upload(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await request.file();
      
      if (!data) {
        return reply.status(400).send({ error: 'Nenhum arquivo enviado' });
      }

      const userId = request.user!.id;
      const tenantId = request.tenantContext?.tenantId || undefined;

      const file = await fileService.upload(data, userId, tenantId);

      reply.status(201).send(file);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao fazer upload';
      reply.status(400).send({ error: message });
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const userId = request.user!.id;

      const file = await fileService.getById(id, userId);
      reply.send(file);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar arquivo';
      reply.status(404).send({ error: message });
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { page = 1, limit = 20 } = request.query as { page?: number; limit?: number };
      const userId = request.user!.id;

      const result = await fileService.list(userId, Number(page), Number(limit));
      reply.send(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao listar arquivos';
      reply.status(500).send({ error: message });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const userId = request.user!.id;

      const result = await fileService.delete(id, userId);
      reply.send(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao deletar arquivo';
      reply.status(404).send({ error: message });
    }
  }
}

export const fileController = new FileController();
