import { Role } from '@prisma/client';

declare module 'fastify' {
  interface FastifyRequest {
    tenantId?: string;
    spaceId?: string;
    user?: {
      id: string;
      email: string;
      role: Role;
      tenantId?: string;
      [key: string]: any; // Permite flexibilidade para outros middlewares, se necessário
    };
  }
}
