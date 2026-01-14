import { TIMEZONES, type TimezoneOption } from './timezone-constants';

/**
 * Adaptador para compatibilidade com a API existente
 * Converte o formato multi-idioma para o formato esperado pelo backend
 */
export const timezones = TIMEZONES.map((tz: TimezoneOption) => ({
  value: tz.zone,
  label: tz.pt, // Usa português por padrão no backend
  offset: tz.offset,
  country: tz.continent,
}));
