import { FastifyRequest, FastifyReply } from 'fastify';
import { userService } from '../services/user.service';
import { authorizationService } from '../../../services/authorization.service';
import { createUserSchema, updateUserSchema } from '../../../lib/validation';
import { maskingService } from '../../../services/masking.service';
import { sanitize } from 'isomorphic-dompurify';

export class UserController {
  async getStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      // NÃO usar x-tenant-id automaticamente
      // SUPER_ADMIN deve ver stats globais (sem filtro de tenant)
      // Se precisar filtrar por tenant, passar como query parameter
      const { tenantId } = request.query as { tenantId?: string };
      const stats = await userService.getStats(tenantId);
      reply.send(stats);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as Record<string, any>;
      const pageNum = Number(query.page) || 1;
      const limitNum = Number(query.limit) || 10;
      const tenantId = typeof query.tenantId === 'string' ? query.tenantId : undefined;
      const search = typeof query.search === 'string' ? sanitize(query.search) : undefined;
      const status = typeof query.status === 'string' ? sanitize(query.status) : undefined;

      const result = await userService.listUsers(
        tenantId,
        pageNum,
        limitNum,
        search,
        status
      );
      
      const spaceId = request.headers['x-space-id'] as string | undefined;
      const { capabilities } = request.user 
        ? await authorizationService.getUserCapabilities(request.user.id, spaceId) 
        : { capabilities: [] as string[] };

      // Mascarar PII se necessário
      if (result.users) {
        result.users = maskingService.maskObject('User', result.users, capabilities);
      }

      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const user = await userService.getUserById(id);

      const spaceId = request.headers['x-space-id'] as string | undefined;
      const { capabilities } = request.user 
        ? await authorizationService.getUserCapabilities(request.user.id, spaceId) 
        : { capabilities: [] as string[] };
      
      const masked = maskingService.maskObject('User', user, capabilities);
      reply.send(masked);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

    async getCurrent(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({ error: 'Não autenticado' });
      }
      const userId = request.user.id;
      const user = await userService.getCurrentUser(userId);
      reply.send(user);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  async getCapabilities(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.status(401).send({ error: 'Não autenticado' });
      }
      const userId = request.user.id;
      const spaceId = request.headers['x-space-id'] as string | undefined;
      
      const result = await authorizationService.getUserCapabilities(userId, spaceId);
      
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      console.log('🔍 [USER CONTROLLER] Create User - Raw body:', JSON.stringify(request.body, null, 2));
      const data = createUserSchema.parse(request.body);
      console.log('✅ [USER CONTROLLER] Create User - Validated data:', JSON.stringify(data, null, 2));
      const user = await userService.createUser(data);
      console.log('✅ [USER CONTROLLER] Create User - Created user:', JSON.stringify(user, null, 2));
      reply.status(201).send(user);
    } catch (error: any) {
      console.error('❌ [USER CONTROLLER] Create User - Error:', error);
      reply.status(400).send({  error: error.message });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      console.log('Update User Request Body:', request.body);
      const data = updateUserSchema.parse(request.body);
      const user = await userService.updateUser(id, data);
      reply.send(user);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async uploadAvatar(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      
      // Processar multipart/form-data
      const data = await request.file();
      
      if (!data) {
        return reply.status(400).send({ error: 'No file uploaded' });
      }

      console.log('📤 [USER CONTROLLER] Upload Avatar - File:', {
        filename: data.filename,
        mimetype: data.mimetype,
        encoding: data.encoding,
      });

      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(data.mimetype)) {
        return reply.status(400).send({ 
          error: 'Invalid file type. Allowed: jpeg, jpg, png, gif, webp' 
        });
      }

      // Converter stream para buffer
      const buffer = await data.toBuffer();

      // Validar tamanho (3MB)
      const maxSize = 3 * 1024 * 1024; // 3MB
      if (buffer.length > maxSize) {
        return reply.status(400).send({ 
          error: 'File too large. Maximum size: 3MB' 
        });
      }

      console.log('✅ [USER CONTROLLER] Upload Avatar - File validated, size:', buffer.length);

      // Salvar avatar
      const avatarUrl = await userService.uploadAvatar(id, buffer, data.filename);
      
      console.log('✅ [USER CONTROLLER] Upload Avatar - Saved:', avatarUrl);

      reply.send({ avatarUrl });
    } catch (error: any) {
      console.error('❌ [USER CONTROLLER] Upload Avatar - Error:', error);
      reply.status(400).send({ error: error.message });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const result = await userService.deleteUser(id);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }
}

export const userController = new UserController();
