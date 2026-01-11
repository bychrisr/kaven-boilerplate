/**
 * Git utilities
 */

import { execa } from 'execa';
import { logger } from './logger.js';

export class GitUtils {
  /**
   * Check if Git is installed
   */
  async isGitInstalled(): Promise<boolean> {
    try {
      await execa('git', ['--version']);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Initialize Git repository
   */
  async init(cwd: string): Promise<void> {
    try {
      await execa('git', ['init'], { cwd });
      await execa('git', ['add', '.'], { cwd });
      await execa('git', ['commit', '-m', 'chore: initial commit from Kaven v2.0.0'], { cwd });
    } catch (error) {
      throw new Error(`Failed to initialize Git: ${error}`);
    }
  }

  /**
   * Check if directory is a Git repository
   */
  async isRepo(cwd: string): Promise<boolean> {
    try {
      await execa('git', ['rev-parse', '--git-dir'], { cwd });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get current branch name
   */
  async getCurrentBranch(cwd: string): Promise<string> {
    try {
      const { stdout } = await execa('git', ['branch', '--show-current'], { cwd });
      return stdout.trim();
    } catch (error) {
      throw new Error(`Failed to get current branch: ${error}`);
    }
  }

  /**
   * Create new branch
   */
  async createBranch(name: string, cwd: string): Promise<void> {
    try {
      await execa('git', ['checkout', '-b', name], { cwd });
    } catch (error) {
      throw new Error(`Failed to create branch ${name}: ${error}`);
    }
  }

  /**
   * Commit changes
   */
  async commit(message: string, cwd: string): Promise<void> {
    try {
      await execa('git', ['add', '.'], { cwd });
      await execa('git', ['commit', '-m', message], { cwd });
    } catch (error) {
      throw new Error(`Failed to commit: ${error}`);
    }
  }

  /**
   * Check if there are uncommitted changes
   */
  async hasUncommittedChanges(cwd: string): Promise<boolean> {
    try {
      const { stdout } = await execa('git', ['status', '--porcelain'], { cwd });
      return stdout.trim().length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Stash changes
   */
  async stash(cwd: string): Promise<void> {
    try {
      await execa('git', ['stash'], { cwd });
      logger.info('Changes stashed. Run "git stash pop" to restore them.');
    } catch (error) {
      throw new Error(`Failed to stash changes: ${error}`);
    }
  }
}

export const git = new GitUtils();
