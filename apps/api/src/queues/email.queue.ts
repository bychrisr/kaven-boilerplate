import { Queue } from 'bullmq';
import { defaultQueueConfig } from '../config/queue.config';

/**
 * Fila BullMQ para envio de e-mails
 */
export const emailQueue = new Queue('email', defaultQueueConfig);

/**
 * Adiciona um e-mail para ser processado via worker
 * @param queueId ID do registro na tabela EmailQueue (Prisma)
 */
export const addEmailJobV2 = (queueId: string) => {
  return emailQueue.add('send_email', { queueId }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  });
};
