
import { FastifyRequest, FastifyReply } from 'fastify';
import { projectsService } from './projects.service';

export class ProjectsController {
  async list(req: FastifyRequest, res: FastifyReply) {
    try {
      const { tenantId } = (req as any).user;
      const { page, limit, spaceId } = req.query as any;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 10;

      const result = await projectsService.findAll(tenantId, spaceId, pageNum, limitNum);
      return res.send(result);
    } catch (error) {
      req.log.error(error);
      return res.status(500).send({ error: 'Failed to fetch projects' });
    }
  }

  async get(req: FastifyRequest, res: FastifyReply) {
    try {
      const { tenantId } = (req as any).user;
      const { id } = req.params as any;

      const project = await projectsService.findOne(id, tenantId);
      if (!project) return res.status(404).send({ error: 'Project not found' });

      return res.send(project);
    } catch (error) {
       req.log.error(error);
       return res.status(500).send({ error: 'Failed to fetch project' });
    }
  }

  async create(req: FastifyRequest, res: FastifyReply) {
    try {
      const { tenantId, id: userId } = (req as any).user;
      const data = req.body as any;

      if (!data.name) return res.status(400).send({ error: 'Name is required' });

      const project = await projectsService.create(data, tenantId, userId);
      return res.status(201).send(project);
    } catch (error) {
      req.log.error(error);
      return res.status(400).send({ error: 'Failed to create project' });
    }
  }

  async update(req: FastifyRequest, res: FastifyReply) {
    try {
      const { tenantId } = (req as any).user;
      const { id } = req.params as any;
      const data = req.body as any;

      const project = await projectsService.update(id, data, tenantId);
      return res.send(project);
    } catch (error: any) {
      if (error.message === 'Project not found') return res.status(404).send({ error: 'Project not found' });
      req.log.error(error);
      return res.status(400).send({ error: 'Failed to update project' });
    }
  }

  async delete(req: FastifyRequest, res: FastifyReply) {
    try {
      const { tenantId } = (req as any).user;
      const { id } = req.params as any;

      await projectsService.delete(id, tenantId);
      return res.status(204).send();
    } catch (error: any) {
       if (error.message === 'Project not found') return res.status(404).send({ error: 'Project not found' });
       req.log.error(error);
       return res.status(500).send({ error: 'Failed to delete project' });
    }
  }
}

export const projectsController = new ProjectsController();
