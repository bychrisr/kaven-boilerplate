import path from 'path';
import degit from 'degit';
import { execa } from 'execa';
import inquirer from 'inquirer';
import { logger } from '../lib/logger.js';
import { git } from '../lib/git.js';
import { fsUtils } from '../lib/fs.js';
import { InstallOptions, KavenConfig } from '../types/index.js';

export class ProjectInitializer {
  async run(): Promise<void> {
    const projectName = await this.getProjectName();
    const options = await this.promptInstallOptions(projectName);
    const projectPath = path.resolve(process.cwd(), projectName);

    if (await fsUtils.exists(projectPath)) {
      if (!(await fsUtils.isDirectoryEmpty(projectPath))) {
        logger.error(`Directory "${projectName}" is not empty.`);
        process.exit(1);
      }
    }

    logger.startSpinner('Downloading template...');
    try {
      await this.downloadTemplate(projectPath);
      logger.succeedSpinner('Downloaded successfully!');
    } catch (error) {
      logger.failSpinner('Download failed');
      logger.error(`Error: ${error}`);
      process.exit(1);
    }

    logger.startSpinner('Configuring project...');
    try {
      await this.configureProject(projectPath, options);
      logger.succeedSpinner('Project configured!');
    } catch (error) {
      logger.failSpinner('Configuration failed');
      logger.error(`Error: ${error}`);
      process.exit(1);
    }

    logger.startSpinner('Installing dependencies (this may take a few minutes)...');
    try {
      await this.installDependencies(projectPath);
      logger.succeedSpinner('Dependencies installed!');
    } catch (error) {
      logger.failSpinner('Installation failed');
      logger.error(`Error: ${error}`);
      logger.info('You can install dependencies manually: cd ' + projectName + ' && pnpm install');
    }

    const shouldInitGit = await git.isGitInstalled();
    if (shouldInitGit) {
      logger.startSpinner('Initializing Git repository...');
      try {
        await git.init(projectPath);
        logger.succeedSpinner('Git initialized!');
      } catch (error) {
        logger.failSpinner('Git initialization failed');
        logger.warning(`Error: ${error}`);
      }
    }

    logger.log('');
    logger.box('SUCCESS! 🎉', [
      `Project "${projectName}" created successfully!`,
      '',
      'Next steps:',
      `  cd ${projectName}`,
      '  pnpm dev',
      '',
      'Happy coding! 🚀',
    ]);
  }

  private async getProjectName(): Promise<string> {
    const { projectName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: 'my-saas',
        validate: (input: string) => {
          if (!input || input.trim().length === 0) return 'Project name is required';
          if (!/^[a-z0-9-]+$/.test(input)) return 'Project name can only contain lowercase letters, numbers, and hyphens';
          return true;
        },
      },
    ]);
    return projectName;
  }

  private async promptInstallOptions(projectName: string): Promise<InstallOptions> {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'database',
        message: 'Which database do you want to use?',
        choices: [
          { name: 'PostgreSQL (recommended)', value: 'postgresql' },
          { name: 'MySQL', value: 'mysql' },
          { name: 'MongoDB', value: 'mongodb' },
        ],
        default: 'postgresql',
      },
      {
        type: 'confirm',
        name: 'multiTenant',
        message: 'Enable multi-tenancy (multiple organizations)?',
        default: true,
      },
      {
        type: 'list',
        name: 'payment',
        message: 'Which payment gateway do you want to use?',
        choices: [
          { name: 'Stripe', value: 'stripe' },
          { name: 'Mercado Pago', value: 'mercadopago' },
          { name: 'None (I\'ll add later)', value: 'none' },
        ],
        default: 'stripe',
      },
      {
        type: 'checkbox',
        name: 'modules',
        message: 'Select optional modules to install:',
        choices: [
          { name: 'Analytics (tracking & metrics)', value: 'analytics', checked: true },
          { name: 'AI Assistant (OpenAI integration)', value: 'aiAssistant' },
          { name: 'Notifications (email/SMS/push)', value: 'notifications' },
        ],
      },
    ]);

    return {
      projectName,
      database: answers.database,
      multiTenant: answers.multiTenant,
      payment: answers.payment,
      modules: {
        analytics: answers.modules.includes('analytics'),
        aiAssistant: answers.modules.includes('aiAssistant'),
        notifications: answers.modules.includes('notifications'),
      },
    };
  }

  private async downloadTemplate(projectPath: string): Promise<void> {
    const emitter = degit('bychrisr/kaven-boilerplate#main', {
      cache: false,
      force: true,
    });
    await emitter.clone(projectPath);
  }

  private async configureProject(projectPath: string, options: InstallOptions): Promise<void> {
    const config: KavenConfig = {
      name: options.projectName,
      version: '1.0.0',
      kaven: {
        version: '2.0.0',
        installedAt: new Date().toISOString(),
        repository: 'https://github.com/bychrisr/kaven-boilerplate',
        features: {
          multiTenant: options.multiTenant,
          database: options.database,
          payment: options.payment !== 'none' ? options.payment : undefined,
        },
        modules: {
          core: { auth: true, users: true, tenants: true },
          optional: {
            'payments-stripe': options.payment === 'stripe',
            'payments-mercadopago': options.payment === 'mercadopago',
            analytics: options.modules.analytics,
            'ai-assistant': options.modules.aiAssistant,
            notifications: options.modules.notifications,
          },
        },
        customizations: { removedModules: [], addedModules: [] },
      },
    };

    await fsUtils.writeKavenConfig(projectPath, config);
    await fsUtils.createEnvFile(projectPath, options);

    const modulesPath = path.join(projectPath, 'apps/api/src/modules');
    if (await fsUtils.exists(modulesPath)) {
      if (options.payment !== 'stripe') await fsUtils.remove(path.join(modulesPath, 'payments-stripe'));
      if (options.payment !== 'mercadopago') await fsUtils.remove(path.join(modulesPath, 'payments-mercadopago'));
      if (!options.modules.analytics) await fsUtils.remove(path.join(modulesPath, 'analytics'));
      if (!options.modules.aiAssistant) await fsUtils.remove(path.join(modulesPath, 'ai-assistant'));
      if (!options.modules.notifications) await fsUtils.remove(path.join(modulesPath, 'notifications'));
    }
  }

  private async installDependencies(projectPath: string): Promise<void> {
    await execa('pnpm', ['install'], { cwd: projectPath, stdio: 'pipe' });
  }
}