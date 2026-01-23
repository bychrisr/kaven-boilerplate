
import { FastifyRequest, FastifyReply } from 'fastify';
import { tasksService } from './tasks.service';
import { sanitize } from 'isomorphic-dompurify';

export class TasksController {
  async list(req: FastifyRequest, res: FastifyReply) {
    try {
      const { tenantId } = (req as any).user;
      const { projectId, spaceId, page, limit } = req.query as { projectId?: string; spaceId?: string; page?: string; limit?: string };
      const safeProjectId = projectId ? sanitize(projectId) : undefined;
      const safeSpaceId = spaceId ? sanitize(spaceId) : undefined;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;

      const result = await tasksService.findAll(tenantId, safeProjectId, safeSpaceId, pageNum, limitNum);
      return res.send(result);
    } catch (error) {
      req.log.error(error);
      return res.status(500).send({ error: 'Failed to fetch tasks' });
    }
  }

  async get(req: FastifyRequest, res: FastifyReply) {
    try {
      const { tenantId } = (req as any).user;
      const { id } = req.params as { id: string };

      const task = await tasksService.findOne(id, tenantId);
      if (!task) return res.status(404).send({ error: 'Task not found' });

      return res.status(200).send({
        ...task,
        title: sanitize(task.title),
        description: task.description ? sanitize(task.description) : undefined
      });
    } catch (error) {
       req.log.error(error);
       return res.status(500).send({ error: 'Failed to fetch task' });
    }
  }

  async create(req: FastifyRequest, res: FastifyReply) {
    try {
      const { tenantId, id: userId } = (req as any).user;
      const body = req.body as { title: string; description?: string; projectId: string; status?: string; priority?: string; dueDate?: string; assigneeId?: string };

      if (!body.title || typeof body.title !== 'string') return res.status(400).send({ error: 'Title is required and must be a string' });
      if (!body.projectId || typeof body.projectId !== 'string') return res.status(400).send({ error: 'ProjectId is required and must be a string' });

      // Explicitly construct payload to avoid polluting with unexpected properties
      const payload = {
        title: sanitize(body.title),
        description: body.description ? sanitize(body.description) : undefined,
        projectId: sanitize(body.projectId),
        status: body.status ? sanitize(body.status) : undefined,
        priority: body.priority ? sanitize(body.priority) : undefined,
        dueDate: body.dueDate,
        assigneeId: body.assigneeId
      };

      const task = await tasksService.create(payload, tenantId, userId);
      return res.status(201).send(task);
    } catch (error) {
      req.log.error(error);
      return res.status(400).send({ error: 'Failed to create task' });
    }
  }

  async update(req: FastifyRequest, res: FastifyReply) {
    try {
      const { tenantId } = (req as any).user;
      const { id } = req.params as { id: string };
      const body = req.body as { 
        title?: string; 
        description?: string; 
        status?: string; 
        priority?: string; 
        dueDate?: string; 
        assigneeId?: string 
      };
      
      const payload: any = {};
      if (body.title) payload.title = sanitize(body.title);
      if (body.description) payload.description = sanitize(body.description);
      if (body.status) payload.status = sanitize(body.status);
      if (body.priority) payload.priority = sanitize(body.priority);
      if (body.dueDate) payload.dueDate = body.dueDate; 
      if (body.assigneeId) payload.assigneeId = body.assigneeId;

      const task = await tasksService.update(id, payload, tenantId);
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
      const { id } = req.params as { id: string };

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
