import { FastifyInstance } from 'fastify';
import { fileController } from '../controllers/file.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';

export async function fileRoutes(fastify: FastifyInstance) {
  // POST /api/files/upload - Upload arquivo (requer autenticação)
  fastify.post('/upload', {
    preHandler: [authMiddleware],
    handler: fileController.upload.bind(fileController),
  });

  // GET /api/files - Listar arquivos (requer autenticação)
  fastify.get('/', {
    preHandler: [authMiddleware],
    handler: fileController.list.bind(fileController),
  });

  // GET /api/files/:id - Buscar arquivo (requer autenticação)
  fastify.get('/:id', {
    preHandler: [authMiddleware],
    handler: fileController.getById.bind(fileController),
  });

  // DELETE /api/files/:id - Deletar arquivo (requer autenticação)
  fastify.delete('/:id', {
    preHandler: [authMiddleware],
    handler: fileController.delete.bind(fileController),
  });
}
