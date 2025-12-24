import { Queue } from 'bullmq';
import { defaultQueueConfig } from '../config/queue.config';

export const emailQueue = new Queue('email', defaultQueueConfig);

export enum EmailJobType {
  WELCOME = 'welcome',
  VERIFY_EMAIL = 'verify_email',
  FORGOT_PASSWORD = 'forgot_password',
  ALERT = 'alert',
  LOGIN_ALERT = 'login_alert',
}

export interface EmailJobData {
  to: string;
  subject?: string;
  template?: string;
  context?: Record<string, any>;
}

export const addEmailJob = (type: EmailJobType, data: EmailJobData) => {
  return emailQueue.add(type, data);
};
