import { FastifyInstance } from 'fastify';
import { dashboardController } from './dashboard.controller';

export async function dashboardRoutes(app: FastifyInstance) {
  app.get(
    '/summary',
    {
        // Add auth preHandler if needed, e.g. app.verifyJwt
        // preHandler: [app.authenticate] 
    },
    dashboardController.getSummary
  );

  app.get(
    '/charts',
    dashboardController.getCharts
  );
}
