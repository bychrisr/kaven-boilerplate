'use client';

import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

interface TimezoneAutoDetectProps {
  fieldName: string;
}

/**
 * Componente que auto-detecta o timezone do navegador
 * e atualiza o campo do formulário se estiver vazio ou em UTC
 */
export function TimezoneAutoDetect({ fieldName }: TimezoneAutoDetectProps) {
  const { setValue, watch } = useFormContext();
  const currentValue = watch(fieldName);

  useEffect(() => {
    if (!currentValue || currentValue === 'UTC') {
      try {
        const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // Verificar se a zona detectada é válida (existe na nossa lista)
        // A validação será feita pelo componente pai que tem acesso à lista de timezones
        setValue(fieldName, userZone, { shouldDirty: false });
      } catch {
        // Mantém UTC se houver erro
      }
    }
  }, [currentValue, fieldName, setValue]);

  return null; // Componente invisível
}
