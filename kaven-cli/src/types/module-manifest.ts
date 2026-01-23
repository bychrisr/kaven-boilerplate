import { z } from 'zod';

export const ModuleInjectionTypeSchema = z.enum(['anchor', 'patch']);

export const ModuleInjectionSchema = z.object({
  /** Target file relative to project root */
  targetFile: z.string(),
  
  /** Type of injection strategy */
  type: ModuleInjectionTypeSchema,
  
  /** Required if type is 'anchor': The anchor name (without comments, e.g. "KAVEN_MODULE_IMPORTS") */
  anchor: z.string().optional(),
  
  /** Required if type is 'patch': The string or regex pattern to locate */
  pattern: z.string().optional(),
  
  /** Content to inject */
  content: z.string(),
  
  /** 
   * Strategy for placement relative to anchor or pattern.
   * - append: Add after content (inside anchor block)
   * - prepend: Add before content (inside anchor block)
   * - replace: Replace the matched pattern
   * - after: Add after the matched pattern
   * - before: Add before the matched pattern
   */
  strategy: z.enum(['append', 'prepend', 'replace', 'after', 'before']).optional(),
  
  /** Unique key to ensure idempotency if content might vary slightly */
  dedupeKey: z.string().optional(),
});

export const ModuleFileSchema = z.object({
  path: z.string(), // Relative to module root
  target: z.string(), // Relative to project root
});

export const ModuleManifestSchema = z.object({
  name: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be kebab-case"),
  version: z.string(),
  description: z.string(),
  category: z.enum(['core', 'feature', 'integration']).default('feature'),
  
  /** NPM dependencies to add to package.json */
  dependencies: z.record(z.string(), z.string()).optional(),
  
  /** NPM devDependencies to add */
  devDependencies: z.record(z.string(), z.string()).optional(),
  
  /** Other Kaven modules this module depends on */
  moduleDependencies: z.array(z.string()).optional(),
  
  /** Files to copy */
  files: z.array(ModuleFileSchema).default([]),
  
  /** Code injections */
  injections: z.array(ModuleInjectionSchema).default([]),
});

export type ModuleManifest = z.infer<typeof ModuleManifestSchema>;
export type ModuleInjection = z.infer<typeof ModuleInjectionSchema>;
export type ModuleFile = z.infer<typeof ModuleFileSchema>;
