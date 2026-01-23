
import { FastifyRequest, FastifyReply } from 'fastify';
import { projectsService } from './projects.service';
import { sanitize } from 'isomorphic-dompurify';

export class ProjectsController {
  async list(req: FastifyRequest, res: FastifyReply) {
    try {
      const { tenantId } = (req as any).user;
      const { page, limit, spaceId } = req.query as { page?: string; limit?: string; spaceId?: string };
      const safeSpaceId = spaceId ? sanitize(spaceId) : undefined;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 10;

      const result = await projectsService.findAll(tenantId, safeSpaceId, pageNum, limitNum);
      return res.status(200).send(result);
    } catch (error) {
      req.log.error(error);
      return res.status(500).send({ error: 'Failed to fetch projects' });
    }
  }

  async get(req: FastifyRequest, res: FastifyReply) {
    try {
      const { tenantId } = (req as any).user;
      const { id } = req.params as { id: string };

      const project = await projectsService.findOne(id, tenantId);
      if (!project) return res.status(404).send({ error: 'Project not found' });

      return res.status(200).send({
        ...project,
        name: sanitize(project.name),
        description: project.description ? sanitize(project.description) : undefined
      });
    } catch (error) {
       req.log.error(error);
       return res.status(500).send({ error: 'Failed to fetch project' });
    }
  }

  async create(req: FastifyRequest, res: FastifyReply) {
    try {
      const { tenantId, id: userId } = (req as any).user;
      const body = req.body as { name: string; description?: string; color?: string; accessLevel?: string };

      if (!body.name || typeof body.name !== 'string') return res.status(400).send({ error: 'Name is required and must be a string' });
      
      const payload = {
        name: sanitize(body.name),
        description: body.description ? sanitize(body.description) : undefined,
        color: body.color ? sanitize(body.color) : undefined,
        accessLevel: body.accessLevel ? sanitize(body.accessLevel) : undefined
      };

      const project = await projectsService.create(payload, tenantId, userId);
      return res.status(201).send(project);
    } catch (error) {
      req.log.error(error);
      return res.status(400).send({ error: 'Failed to create project' });
    }
  }

  async update(req: FastifyRequest, res: FastifyReply) {
    try {
      const { tenantId } = (req as any).user;
      const { id } = req.params as { id: string };
      const body = req.body as { 
        name?: string; 
        description?: string; 
        color?: string; 
        accessLevel?: string; 
        status?: string 
      };
      
      const payload: any = {};
      if (body.name) payload.name = sanitize(body.name);
      if (body.description) payload.description = sanitize(body.description);
      if (body.color) payload.color = sanitize(body.color);
      if (body.accessLevel) payload.accessLevel = sanitize(body.accessLevel);
      if (body.status) payload.status = sanitize(body.status);

      const project = await projectsService.update(id, payload, tenantId);
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
      const { id } = req.params as { id: string };

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
