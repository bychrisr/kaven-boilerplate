
import { FastifyRequest, FastifyReply } from 'fastify';
import { tasksService } from './tasks.service';

export class TasksController {
  async list(req: FastifyRequest, res: FastifyReply) {
    try {
      const { tenantId } = (req as any).user;
      const { projectId, spaceId, page, limit } = req.query as any;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;

      const result = await tasksService.findAll(tenantId, projectId, spaceId, pageNum, limitNum);
      return res.send(result);
    } catch (error) {
      req.log.error(error);
      return res.status(500).send({ error: 'Failed to fetch tasks' });
    }
  }

  async get(req: FastifyRequest, res: FastifyReply) {
    try {
      const { tenantId } = (req as any).user;
      const { id } = req.params as any;

      const task = await tasksService.findOne(id, tenantId);
      if (!task) return res.status(404).send({ error: 'Task not found' });

      return res.send(task);
    } catch (error) {
       req.log.error(error);
       return res.status(500).send({ error: 'Failed to fetch task' });
    }
  }

  async create(req: FastifyRequest, res: FastifyReply) {
    try {
      const { tenantId, id: userId } = (req as any).user;
      const data = req.body as any;

      if (!data.title || !data.projectId) return res.status(400).send({ error: 'Title and ProjectId are required' });

      const task = await tasksService.create(data, tenantId, userId);
      return res.status(201).send(task);
    } catch (error) {
      req.log.error(error);
      return res.status(400).send({ error: 'Failed to create task' });
    }
  }

  async update(req: FastifyRequest, res: FastifyReply) {
    try {
      const { tenantId } = (req as any).user;
      const { id } = req.params as any;
      const data = req.body as any;

      const task = await tasksService.update(id, data, tenantId);
      return res.send(task);
    } catch (error: any) {
      if (error.message === 'Task not found') return res.status(404).send({ error: 'Task not found' });
      req.log.error(error);
      return res.status(400).send({ error: 'Failed to update task' });
    }
  }

  async delete(req: FastifyRequest, res: FastifyReply) {
    try {
      const { tenantId } = (req as any).user;
      const { id } = req.params as any;

      await tasksService.delete(id, tenantId);
      return res.status(204).send();
    } catch (error: any) {
       if (error.message === 'Task not found') return res.status(404).send({ error: 'Task not found' });
       req.log.error(error);
       return res.status(500).send({ error: 'Failed to delete task' });
    }
  }
}

export const tasksController = new TasksController();
