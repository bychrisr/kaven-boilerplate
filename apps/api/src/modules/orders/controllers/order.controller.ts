import { FastifyRequest, FastifyReply } from 'fastify';
import { orderService } from '../services/order.service';

export class OrderController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { page = '1', limit = '10', tenantId } = request.query as any;
      const result = await orderService.listOrders(
        tenantId,
        parseInt(page),
        parseInt(limit)
      );
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const order = await orderService.getOrderById(id);
      reply.send(order);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.body as any;
      const order = await orderService.createOrder(data);
      reply.status(201).send(order);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async updateStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: any };
      const order = await orderService.updateOrderStatus(id, status);
      reply.send(order);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const result = await orderService.deleteOrder(id);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }
}

export const orderController = new OrderController();
