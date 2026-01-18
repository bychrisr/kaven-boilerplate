import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';
import { secureLog } from '../../../utils/secure-logger';
import { prisma } from '../../prisma';
import { EmailProvider, EmailType } from '../types';

export interface RenderOptions {
  templateCode: string;
  data: Record<string, any>;
  locale?: 'pt' | 'en';
}

export class EmailTemplateEngine {
  private static instance: EmailTemplateEngine;
  private templatesPath: string;
  private layoutsPath: string;
  private partialsPath: string;

  private constructor() {
    this.templatesPath = path.join(process.cwd(), 'apps/api/src/templates/emails');
    this.layoutsPath = path.join(this.templatesPath, 'layouts');
    this.partialsPath = path.join(this.templatesPath, 'partials');
    this.registerHelpers();
    this.registerPartials();
  }

  public static getInstance(): EmailTemplateEngine {
    if (!EmailTemplateEngine.instance) {
      EmailTemplateEngine.instance = new EmailTemplateEngine();
    }
    return EmailTemplateEngine.instance;
  }

  /**
   * Register Handlebars helpers
   */
  private registerHelpers(): void {
    Handlebars.registerHelper('concat', (...args) => {
      return args.slice(0, -1).join('');
    });

    Handlebars.registerHelper('formatDate', (date: Date, format: string) => {
      // Basic implementation, could use date-fns/dayjs
      return new Date(date).toLocaleDateString();
    });

    Handlebars.registerHelper('t', (key: string, options: any) => {
      // This is a placeholder for actual i18n logic
      // In a real app, you'd load translations based on the locale
      return key; 
    });
  }

  /**
   * Register Handlebars partials and layouts
   */
  private registerPartials(): void {
    try {
      // Register Layouts
      if (fs.existsSync(this.layoutsPath)) {
        const layouts = fs.readdirSync(this.layoutsPath);
        layouts.forEach((file) => {
          if (file.endsWith('.hbs')) {
            const name = path.basename(file, '.hbs');
            const content = fs.readFileSync(path.join(this.layoutsPath, file), 'utf8');
            Handlebars.registerPartial(name, content);
          }
        });
      }

      // Register Partials
      if (fs.existsSync(this.partialsPath)) {
        const partials = fs.readdirSync(this.partialsPath);
        partials.forEach((file) => {
          if (file.endsWith('.hbs')) {
            const name = path.basename(file, '.hbs');
            const content = fs.readFileSync(path.join(this.partialsPath, file), 'utf8');
            Handlebars.registerPartial(name, content);
          }
        });
      }
    } catch (error) {
      secureLog.error('[EmailTemplateEngine] Error registering partials:', error);
    }
  }

  /**
   * Render a template from the database or filesystem
   */
  public async render(options: RenderOptions): Promise<{ html: string; subject: string }> {
    const { templateCode, data, locale = 'pt' } = options;

    try {
      // 1. Try to fetch from database first
      const dbTemplate = await (prisma as any).emailTemplate.findUnique({
        where: { code: templateCode }
      });

      let htmlContent = '';
      let subject = '';

      if (dbTemplate) {
        htmlContent = locale === 'en' ? (dbTemplate.htmlContentEn || dbTemplate.htmlContentPt) : dbTemplate.htmlContentPt;
        subject = locale === 'en' ? (dbTemplate.subjectEn || dbTemplate.subjectPt) : dbTemplate.subjectPt;
      } else {
        // 2. Fallback to filesystem
        const filePath = path.join(this.templatesPath, `${templateCode}.hbs`);
        if (fs.existsSync(filePath)) {
          htmlContent = fs.readFileSync(filePath, 'utf8');
          subject = `Email: ${templateCode}`; // Default subject for file templates
        } else {
          throw new Error(`Template not found: ${templateCode}`);
        }
      }

      // 3. Compile and Render HTML
      const template = Handlebars.compile(htmlContent);
      const html = template(data);

      // 4. Compile and Render Subject (if it contains variables)
      const subjectTemplate = Handlebars.compile(subject);
      const finalSubject = subjectTemplate(data);

      return {
        html,
        subject: finalSubject
      };
    } catch (error) {
      secureLog.error(`[EmailTemplateEngine] Error rendering template ${templateCode}:`, error);
      throw error;
    }
  }
}

export const emailTemplateEngine = EmailTemplateEngine.getInstance();
