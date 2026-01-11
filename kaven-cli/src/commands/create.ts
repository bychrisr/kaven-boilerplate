import { ProjectInitializer } from '../core/project-initializer.js';

export async function createCommand(): Promise<void> {
  const initializer = new ProjectInitializer();
  await initializer.run();
}
