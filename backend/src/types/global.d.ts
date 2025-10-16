import { FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      tenantId: string;
      isAdm: boolean;
    };
    tenantId?: string;
  }
}
