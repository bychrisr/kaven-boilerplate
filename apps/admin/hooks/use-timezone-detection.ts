import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useLocale } from './use-locale';

interface TimezoneData {
  value: string;
  label: string;
  offset: string;
  country: string;
}

/**
 * Hook para auto-detecção de timezone com suporte multi-idioma
 * 
 * Funcionalidades:
 * - Busca timezones da API no idioma correto
 * - Detecta timezone do navegador automaticamente
 * - Pré-seleciona timezone detectado se campo estiver vazio/UTC
 * - Retorna lista de timezones agrupados por continente
 */
export function useTimezoneDetection(fieldName: string = 'timezone') {
  const { setValue, watch } = useFormContext();
  const { lang } = useLocale();
  const currentValue = watch(fieldName);

  // Buscar timezones da API no idioma correto
  const { data: timezones = [], isLoading } = useQuery<TimezoneData[]>({
    queryKey: ['timezones', lang],
    queryFn: async () => {
      const { data } = await api.get(`/api/settings/platform/timezones?lang=${lang}`);
      return data;
    },
  });

  // Detectar timezone do navegador
  const detectBrowserTimezone = (): string => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'UTC';
    }
  };

  const detected = detectBrowserTimezone();

  // Auto-detecção: pré-selecionar timezone detectado se campo estiver vazio
  useEffect(() => {
    if (timezones.length > 0 && (!currentValue || currentValue === 'UTC')) {
      const exists = timezones.find(tz => tz.value === detected);
      
      if (exists) {
        // shouldDirty: false para não marcar o form como "modificado"
        setValue(fieldName, detected, { shouldDirty: false });
      }
    }
  }, [timezones, currentValue, detected, fieldName, setValue]);

  // Agrupar timezones por continente
  const grouped = timezones.reduce<Record<string, TimezoneData[]>>((acc, tz) => {
    const continent = tz.country || 'Outros';
    if (!acc[continent]) acc[continent] = [];
    acc[continent].push(tz);
    return acc;
  }, {});

  return {
    timezones,
    grouped,
    detected,
    isLoading,
    lang,
  };
}
