/**
 * Logger utility with colored output
 */

import chalk from 'chalk';
import ora, { Ora } from 'ora';

export class Logger {
  private spinner: Ora | null = null;

  success(message: string): void {
    console.log(chalk.green('✅'), message);
  }

  error(message: string): void {
    console.log(chalk.red('❌'), message);
  }

  warning(message: string): void {
    console.log(chalk.yellow('⚠️ '), message);
  }

  info(message: string): void {
    console.log(chalk.blue('ℹ️ '), message);
  }

  log(message: string): void {
    console.log(message);
  }

  startSpinner(message: string): void {
    this.spinner = ora(message).start();
  }

  succeedSpinner(message?: string): void {
    if (this.spinner) {
      this.spinner.succeed(message);
      this.spinner = null;
    }
  }

  failSpinner(message?: string): void {
    if (this.spinner) {
      this.spinner.fail(message);
      this.spinner = null;
    }
  }

  stopSpinner(): void {
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = null;
    }
  }

  box(title: string, lines: string[]): void {
    const maxLength = Math.max(
      title.length,
      ...lines.map((l) => l.length)
    );
    const border = '═'.repeat(maxLength + 4);

    console.log();
    console.log(chalk.cyan(`╔${border}╗`));
    console.log(chalk.cyan(`║  ${title.padEnd(maxLength)}  ║`));
    console.log(chalk.cyan(`╠${border}╣`));
    
    lines.forEach((line) => {
      console.log(chalk.cyan(`║  ${line.padEnd(maxLength)}  ║`));
    });
    
    console.log(chalk.cyan(`╚${border}╝`));
    console.log();
  }
}

export const logger = new Logger();
