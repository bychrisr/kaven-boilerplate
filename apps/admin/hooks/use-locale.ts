import { useLocale as useNextIntlLocale } from 'next-intl';

/**
 * Hook para gerenciar idioma da aplicação
 * Converte locale do next-intl (pt-BR, en-US) para formato simplificado (pt, en)
 */
export function useLocale() {
  const locale = useNextIntlLocale();
  
  // Converter locale para formato de idioma simplificado
  const lang = locale.startsWith('pt') ? 'pt' : 'en';
  
  return { 
    locale, // pt-BR, en-US, etc
    lang,   // pt ou en
  };
}
