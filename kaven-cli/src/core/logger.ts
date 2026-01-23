import { injectable } from 'inversify';
import chalk from 'chalk';
import ora, { Ora } from 'ora';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import 'reflect-metadata';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface ILogger {
  startSpinner(text: string): void;
  stopSpinner(success: boolean, text?: string): void;
  succeedSpinner(text: string): void;
  failSpinner(text: string): void;
  box(title: string, lines: string[]): void;
  info(message: string, meta?: any): void;
  success(message: string): void;
  warn(message: string): void;
  error(message: string, error?: any): void;
  debug(message: string, meta?: any): void;
}

@injectable()
export class LoggerService implements ILogger {
  private spinner: Ora | null = null;
  private logFilePath: string;
  private minLevel: LogLevel = LogLevel.INFO;

  constructor() {
    const homeDir = os.homedir();
    const logDir = path.join(homeDir, '.kaven', 'logs');
    fs.ensureDirSync(logDir);
    
    const dateStr = new Date().toISOString().split('T')[0];
    this.logFilePath = path.join(logDir, `cli-${dateStr}.log`);
    
    if (process.env.KAVEN_DEBUG) {
      this.minLevel = LogLevel.DEBUG;
    }
  }

  // ... (rest of methods same as before, just ensuring they implement ILogger)

  private writeToFile(level: string, message: string, meta?: any) {
    try {
      const timestamp = new Date().toISOString();
      let line = `[${timestamp}] [${level}] ${message}`;
      if (meta) {
        line += ` | ${JSON.stringify(meta)}`;
      }
      line += '\n';
      fs.appendFileSync(this.logFilePath, line);
    } catch (e) {
      // safe fail
    }
  }

  public startSpinner(text: string): void {
    if (this.spinner) {
      this.spinner.text = text;
    } else {
      this.spinner = ora(text).start();
    }
    this.writeToFile('INFO', `Spinner Started: ${text}`);
  }

  public stopSpinner(success: boolean, text?: string): void {
    if (this.spinner) {
      if (success) {
        this.spinner.succeed(text);
      } else {
        this.spinner.fail(text);
      }
      this.spinner = null;
      this.writeToFile('INFO', `Spinner Stopped (${success ? 'Success' : 'Fail'}): ${text || ''}`);
    }
  }

  public succeedSpinner(text: string): void {
      this.stopSpinner(true, text);
  }

  public failSpinner(text: string): void {
      this.stopSpinner(false, text);
  }

  public box(title: string, lines: string[]): void {
      if (this.spinner) this.spinner.stop();
      
      const width = Math.max(title.length + 4, ...lines.map(l => l.length + 4));
      const hr = '─'.repeat(width);
      
      console.log('');
      console.log(chalk.cyan(`┌${hr}┐`));
      console.log(chalk.cyan(`│  ${chalk.bold(title.padEnd(width - 4))}  │`));
      console.log(chalk.cyan(`├${hr}┤`));
      lines.forEach(line => {
          console.log(chalk.cyan(`│  ${line.padEnd(width - 4)}  │`));
      });
      console.log(chalk.cyan(`└${hr}┘`));
      console.log('');
      
      this.writeToFile('INFO', `[BOX] ${title}`, { lines });
  }

  public info(message: string, meta?: any): void {
    if (this.minLevel <= LogLevel.INFO) {
      if (this.spinner) { 
        this.spinner.text = message; 
      } else {
        console.log(chalk.blue('ℹ'), message);
      }
    }
    this.writeToFile('INFO', message, meta);
  }

  public success(message: string): void {
    if (this.spinner) {
        this.stopSpinner(true, message);
    } else {
        console.log(chalk.green('✔'), message);
    }
    this.writeToFile('INFO', message);
  }

  public warn(message: string): void {
    if (this.minLevel <= LogLevel.WARN) {
        if (this.spinner) this.spinner.stop();
        console.log(chalk.yellow('⚠'), message);
    }
    this.writeToFile('WARN', message);
  }

  public error(message: string, error?: any): void {
    if (this.minLevel <= LogLevel.ERROR) {
        if (this.spinner) this.spinner.fail(message);
        console.error(chalk.red('✖'), message);
        if (error && this.minLevel === LogLevel.DEBUG && error.stack) {
            console.error(error.stack);
        }
    }
    this.writeToFile('ERROR', message, error ? { stack: error.stack, message: error.message } : undefined);
  }

  public debug(message: string, meta?: any): void {
    if (this.minLevel <= LogLevel.DEBUG) {
        if (this.spinner) this.spinner.stop();
        console.log(chalk.gray('🐛'), message);
    }
    this.writeToFile('DEBUG', message, meta);
  }
}
