import { injectable, inject } from 'inversify';
import { TYPES } from '../ioc/types.js';
import type { ILogger } from '../logger.js';
import 'reflect-metadata';

export interface InjectionRequest {
  moduleId: string;
  injectionId: string;
  targetFileContent: string;
  codeToInject: string;
  anchor: string;
  mode: 'before' | 'after' | 'append_eof';
}

export interface IMarkerEngine {
  inject(req: InjectionRequest): string;
  eject(moduleId: string, injectionId: string, content: string): string;
}

@injectable()
export class MarkerEngine implements IMarkerEngine {
    constructor(@inject(TYPES.Logger) private logger: ILogger) {}

  private getMarkers(moduleId: string, id: string) {
    return {
      start: `// [KAVEN_MODULE:${moduleId}:${id}:START]`,
      end: `// [KAVEN_MODULE:${moduleId}:${id}:END]`
    };
  }

  inject(req: InjectionRequest): string {
    const { start, end } = this.getMarkers(req.moduleId, req.injectionId);
    const newBlock = `${start}\n${req.codeToInject}\n${end}`;

    const existingPattern = new RegExp(`${this.escapeRegExp(start)}[\\s\\S]*?${this.escapeRegExp(end)}`, 'm');
    
    if (existingPattern.test(req.targetFileContent)) {
      this.logger.debug(`Updating existing block: ${req.moduleId}:${req.injectionId}`);
      return req.targetFileContent.replace(existingPattern, newBlock);
    }

    const anchorIdx = req.targetFileContent.indexOf(req.anchor);
    if (anchorIdx === -1) {
      throw new Error(`Anchor not found: "${req.anchor}"`);
    }

    if (req.mode === 'before') {
      const before = req.targetFileContent.slice(0, anchorIdx);
      const after = req.targetFileContent.slice(anchorIdx);
      return `${before}${newBlock}\n${after}`;
    }

    if (req.mode === 'after') {
      const anchorEndIdx = anchorIdx + req.anchor.length;
      const before = req.targetFileContent.slice(0, anchorEndIdx);
      const after = req.targetFileContent.slice(anchorEndIdx);
      return `${before}\n${newBlock}${after}`;
    }
    
    return req.targetFileContent + '\n' + newBlock;
  }

  eject(moduleId: string, injectionId: string, content: string): string {
    const { start, end } = this.getMarkers(moduleId, injectionId);
    const pattern = new RegExp(`\\n?${this.escapeRegExp(start)}[\\s\\S]*?${this.escapeRegExp(end)}\\n?`, 'g');
    return content.replace(pattern, '');
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
