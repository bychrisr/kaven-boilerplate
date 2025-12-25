import { FastifyRequest, FastifyReply } from 'fastify';
import { dashboardService } from './dashboard.service';

export class DashboardController {
  async getSummary(request: FastifyRequest, reply: FastifyReply) {
    try {
      const summary = await dashboardService.getSummaryMetrics();
      return reply.code(200).send(summary);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }

  async getCharts(request: FastifyRequest, reply: FastifyReply) {
    try {
      const charts = await dashboardService.getCharts();
      return reply.code(200).send(charts);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  }
}

export const dashboardController = new DashboardController();
