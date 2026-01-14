import { timezones } from './timezone-data';
import { getTimezonesByLanguage, groupTimezonesByContinent, detectBrowserTimezone } from './timezone-constants';

export interface TimezoneInfo {
  value: string;
  label: string;
  offset: string;
  country: string;
}

export class TimezoneUtil {
  /**
   * Obter lista de timezones disponíveis agrupados por região
   */
  static getAvailableTimezones(): TimezoneInfo[] {
    return timezones;
  }

  /**
   * Obter timezones com labels no idioma especificado
   */
  static getTimezonesByLanguage(lang: 'pt' | 'en' = 'pt') {
    return getTimezonesByLanguage(lang);
  }

  /**
   * Agrupar timezones por continente no idioma especificado
   */
  static groupTimezonesByContinent(lang: 'pt' | 'en' = 'pt') {
    return groupTimezonesByContinent(lang);
  }

  /**
   * Detectar timezone do navegador
   */
  static detectBrowserTimezone(): string {
    return detectBrowserTimezone();
  }

  /**
   * Validar se um timezone é válido (IANA timezone)
   */
  static isValidTimezone(timezone: string): boolean {
    try {
      // Tenta criar um formatter com o timezone
      Intl.DateTimeFormat(undefined, { timeZone: timezone });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Converter data para timezone específico
   */
  static convertToTimezone(date: Date, timezone: string): Date {
    const dateString = date.toLocaleString('en-US', { timeZone: timezone });
    return new Date(dateString);
  }

  /**
   * Formatar data em timezone específico
   */
  static formatInTimezone(
    date: Date,
    timezone: string,
    options: Intl.DateTimeFormatOptions = {}
  ): string {
    return date.toLocaleString('pt-BR', {
      ...options,
      timeZone: timezone,
    });
  }

  /**
   * Obter offset de um timezone em formato legível (ex: GMT-3)
   */
  static getTimezoneOffset(timezone: string): string {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    });
    
    const parts = formatter.formatToParts(now);
    const offsetPart = parts.find(part => part.type === 'timeZoneName');
    
    return offsetPart?.value || 'GMT';
  }
}
