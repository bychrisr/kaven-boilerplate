import { Worker, Job } from 'bullmq';
import { defaultQueueConfig } from '../config/queue.config';
import { prisma } from '../lib/prisma';
import { secureLog } from '../utils/secure-logger';
import { emailServiceV2 } from '../lib/email';
import { EmailType } from '../lib/email/types';

/**
 * Worker para processamento da fila de e-mails
 */
export const emailWorker = new Worker(
  'email',
  async (job: Job) => {
    const { queueId } = job.data;
    
    secureLog.info(`[EmailWorker] Processing job ${job.id}`, { queueId });

    try {
      // 1. Buscar registro na EmailQueue
      const emailRecord = await (prisma as any).emailQueue.findUnique({
        where: { id: queueId }
      });

      if (!emailRecord) {
        secureLog.error(`[EmailWorker] Record not found for queueId: ${queueId}`);
        return;
      }

      // 2. Marcar como processando
      await (prisma as any).emailQueue.update({
        where: { id: queueId },
        data: { 
          status: 'PROCESSING',
          attempts: { increment: 1 },
          lastAttemptAt: new Date()
        }
      });

      // 3. Enviar e-mail usando o EmailServiceV2 (sendDirect para evitar loop)
      // Note: O sendDirect agora lida com templates se payload.template estiver presente
      const result = await (emailServiceV2 as any).sendDirect({
        to: emailRecord.to,
        cc: emailRecord.cc,
        bcc: emailRecord.bcc,
        subject: emailRecord.subject,
        html: emailRecord.htmlBody,
        text: emailRecord.textBody,
        template: emailRecord.templateCode,
        templateData: emailRecord.templateData as any,
        type: emailRecord.emailType as any || EmailType.TRANSACTIONAL,
        from: emailRecord.fromEmail,
        fromName: emailRecord.fromName,
        replyTo: emailRecord.replyTo,
        userId: emailRecord.userId,
        tenantId: emailRecord.tenantId,
        idempotencyKey: emailRecord.idempotencyKey,
        metadata: emailRecord.metadata as any
      });

      if (result.success) {
        // 4. Sucesso: Marcar como enviado
        await (prisma as any).emailQueue.update({
          where: { id: queueId },
          data: { 
            status: 'SENT',
            messageId: result.messageId,
            provider: result.provider,
            sentAt: new Date()
          }
        });
        secureLog.info(`[EmailWorker] Email sent successfully for job ${job.id}`, { messageId: result.messageId });
      } else {
        // 5. Falha: Lançar erro para o BullMQ tentar novamente
        throw new Error(result.error || 'Unknown error during email sending');
      }
    } catch (error: any) {
      secureLog.error(`[EmailWorker] Error processing job ${job.id}:`, error);
      
      // Atualizar status de falha no banco
      await (prisma as any).emailQueue.update({
        where: { id: queueId },
        data: { 
          status: 'FAILED',
          error: error.message
        }
      }).catch(err => secureLog.error('[EmailWorker] Error updating failure status:', err));

      throw error; // Re-throw para o BullMQ lidar com retries
    }
  },
  {
    connection: defaultQueueConfig.connection,
    concurrency: 5 // Processa até 5 e-mails simultaneamente
  }
);

// Eventos do Worker para monitoramento
emailWorker.on('completed', (job) => {
  secureLog.info(`[EmailWorker] Job ${job.id} completed`);
});

emailWorker.on('failed', (job: Job | undefined, err: Error) => {
  secureLog.error(`[EmailWorker] Job ${job?.id} failed:`, err);
});
