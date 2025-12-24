import { QueueOptions } from 'bullmq';
import { env } from '../config/env';

const redisUrlString = env.REDIS_URL;
let redisConfig: { host: string; port: number; password?: string } = {
  host: 'localhost',
  port: 6379
};

try {
  const redisUrl = new URL(redisUrlString);
  redisConfig = {
    host: redisUrl.hostname,
    port: parseInt(redisUrl.port || '6379'),
    password: redisUrl.password || undefined,
  };
} catch (error) {
  console.warn('Invalid REDIS_URL, falling back to localhost:6379');
}

export const connection = redisConfig;

export const defaultQueueConfig: QueueOptions = {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 500,     // Keep last 500 failed jobs for debugging
  },
};
