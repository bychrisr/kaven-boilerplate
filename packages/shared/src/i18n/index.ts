export * from './types';
import type { Locale, TranslationKeys } from './types';
import pt from './locales/pt.json';
import en from './locales/en.json';

const locales: Record<Locale, TranslationKeys> = {
  'pt': pt as TranslationKeys,
  'en': en as TranslationKeys,
};

/**
 * Get translations for a specific locale
 */
export const getTranslations = (locale: Locale = 'pt'): TranslationKeys => {
  return locales[locale] || locales['pt'];
};

/**
 * Simple interpolation helper
 * Usage: t('Hello {{name}}', { name: 'Chris' })
 */
export const interpolate = (text: string, params: Record<string, string | number> = {}): string => {
  return text.replace(/{{(\w+)}}/g, (_, key) => {
    return String(params[key] || `{{${key}}}`);
  });
};
