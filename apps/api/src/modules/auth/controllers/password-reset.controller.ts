
import { FastifyRequest, FastifyReply } from 'fastify';
import { PasswordResetService } from '../services/password-reset.service';

export class PasswordResetController {
  constructor(private service: PasswordResetService) {}

  async requestReset(request: FastifyRequest, reply: FastifyReply) {
    const { email } = request.body as { email: string };
    const result = await this.service.requestReset(email);
    return reply.send(result);
  }

  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    const { token, password } = request.body as {
      token: string;
      password: string;
    };

    try {
      const result = await this.service.resetPassword(token, password);
      return reply.send(result);
    } catch (error: any) {
        return reply.status(400).send({ error: error.message });
    }
  }
}
