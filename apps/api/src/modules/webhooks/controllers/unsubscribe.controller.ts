import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../../lib/prisma';
import { secureLog } from '../../../utils/secure-logger';
import { EmailEventType } from '../../../lib/email/types';

export class UnsubscribeController {
  /**
   * GET /api/webhooks/email/unsubscribe/:token
   * Landing page/Confirmar descadastro
   */
  async confirm(request: FastifyRequest, reply: FastifyReply) {
    const { token } = request.params as { token: string };

    try {
      const user = await (prisma as any).user.findUnique({
        where: { unsubscribeToken: token },
      });

      if (!user) {
        return reply.status(404).send({ error: 'Token inválido ou expirado' });
      }

      // Atualizar status de opt-out
      await (prisma as any).user.update({
        where: { id: user.id },
        data: {
          emailOptOut: true,
          emailOptOutDate: new Date(),
        },
      });

      // Registrar evento
      await (prisma as any).emailEvent.create({
        data: {
          eventType: EmailEventType.UNSUBSCRIBE,
          email: user.email,
          userId: user.id,
          messageId: `unsub-${Date.now()}`,
          metadata: { method: 'click' },
        },
      });

      secureLog.info('[Unsubscribe] User opted out via link:', { userId: user.id, email: user.email });

      return reply.type('text/html').send(`
        <html>
          <body style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1>Você foi descadastrado com sucesso</h1>
            <p>Seu e-mail <strong>${user.email}</strong> não receberá mais comunicações de marketing.</p>
            <p>Você ainda poderá receber e-mails transacionais importantes (como redefinição de senha).</p>
          </body>
        </html>
      `);
    } catch (error: any) {
      secureLog.error('[Unsubscribe] Error in confirm:', error);
      return reply.status(500).send({ error: 'Erro interno ao processar descadastro' });
    }
  }

  /**
   * POST /api/webhooks/email/unsubscribe/:token
   * RFC 8058 One-Click Unsubscribe
   */
  async oneClick(request: FastifyRequest, reply: FastifyReply) {
    const { token } = request.params as { token: string };

    try {
      const user = await (prisma as any).user.findUnique({
        where: { unsubscribeToken: token },
      });

      if (!user) {
        return reply.status(404).send({ error: 'Token inválido' });
      }

      // Atualizar status de opt-out
      await (prisma as any).user.update({
        where: { id: user.id },
        data: {
          emailOptOut: true,
          emailOptOutDate: new Date(),
        },
      });

      // Registrar evento
      await (prisma as any).emailEvent.create({
        data: {
          eventType: EmailEventType.UNSUBSCRIBE,
          email: user.email,
          userId: user.id,
          messageId: `unsub-rfc8058-${Date.now()}`,
          metadata: { method: 'one-click-post' },
        },
      });

      secureLog.info('[Unsubscribe] User opted out via RFC 8058 (One-Click):', { userId: user.id, email: user.email });

      return reply.status(200).send({ success: true, message: 'Unsubscribed successfully' });
    } catch (error: any) {
      secureLog.error('[Unsubscribe] Error in oneClick:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }
}

export const unsubscribeController = new UnsubscribeController();
