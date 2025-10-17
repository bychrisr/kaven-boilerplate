import { FastifyInstance } from 'fastify';
import { UserService } from '../services/user.service.js';
import { AuthService } from '../services/auth.service.js';
import { UserController } from '../controllers/user.controller.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.middleware.js';
import { 
  CreateUserSchema,
  UpdateUserSchema,
  GetUsersQuerySchema,
} from '../types/user.schemas.js';

export default async function userRoutes(fastify: FastifyInstance) {
  // Initialize services and controller
  const authService = new AuthService(
    fastify.prisma,
    fastify,
    fastify.redis
  );
  const userService = new UserService(
    fastify.prisma,
    fastify,
    authService
  );
  const userController = new UserController(userService);

  // GET /api/users - List users for current tenant
  fastify.get('/', {
    preHandler: [authenticateUser],
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
          search: { type: 'string' },
          isAdm: { type: 'boolean' },
        },
      },
    },
  }, userController.getUsers.bind(userController));

  // GET /api/users/stats - Get user statistics for current tenant
  fastify.get('/stats', {
    preHandler: [authenticateUser],
  }, userController.getUserStats.bind(userController));

  // GET /api/users/:id - Get user by ID
  fastify.get('/:id', {
    preHandler: [authenticateUser],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, userController.getUserById.bind(userController) as any);

  // POST /api/users - Create new user (admin only)
  fastify.post('/', {
    preHandler: [authenticateUser, requireAdmin],
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password', 'tenantId'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          tenantId: { type: 'string', format: 'uuid' },
          isAdm: { type: 'boolean', default: false },
        },
      },
    },
  }, userController.createUser.bind(userController));

  // PUT /api/users/:id - Update user
  fastify.put('/:id', {
    preHandler: [authenticateUser],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          isAdm: { type: 'boolean' },
          password: { type: 'string', minLength: 8 },
        },
      },
    },
  }, userController.updateUser.bind(userController) as any);

  // DELETE /api/users/:id - Delete user (admin only)
  fastify.delete('/:id', {
    preHandler: [authenticateUser, requireAdmin],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, userController.deleteUser.bind(userController) as any);
}
