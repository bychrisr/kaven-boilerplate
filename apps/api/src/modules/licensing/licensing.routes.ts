import { FastifyInstance } from 'fastify';
import { verifyLicenseHandler } from './licensing.controller';

export async function licensingRoutes(app: FastifyInstance) {
  app.post('/verify', verifyLicenseHandler);
}
