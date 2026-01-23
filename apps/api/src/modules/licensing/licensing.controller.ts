import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { licensingService } from './licensing.service';

const verifyLicenseSchema = z.object({
  key: z.string().min(1),
  moduleSlug: z.string().optional()
});

export const verifyLicenseHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { key, moduleSlug } = verifyLicenseSchema.parse(req.body);
    
    const result = await licensingService.verifyLicense(key, moduleSlug);

    if (!result.valid) {
      return reply.status(403).send({
        valid: false,
        error: result.reason
      });
    }

    return reply.status(200).send({
      valid: true,
      license: result.license
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: error.errors });
    }
    req.log.error(error);
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
};
