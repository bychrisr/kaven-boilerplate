import React from 'react';
import SatsIcon from '@/components/SatsIcon';

interface FormatSatsOptions {
  size?: number;
  showIcon?: boolean;
  variant?: 'auto' | 'positive' | 'negative' | 'neutral' | 'default';
  forceColor?: boolean; // Força a cor do className a sobrescrever a variante
  className?: string; // Classe CSS customizada para o ícone
}

export const useFormatSats = () => {
  const formatSats = (
    value: number, 
    options: FormatSatsOptions = {}
  ): React.ReactNode => {
    const { 
      size = 28, 
      showIcon = true, 
      variant = 'auto',
      forceColor = false,
      className = ''
    } = options;

    // Determinar variante automaticamente se 'auto'
    let iconVariant: 'default' | 'positive' | 'negative' | 'neutral' = 'default';
    
    if (variant === 'auto') {
      if (value > 0) iconVariant = 'positive';
      else if (value < 0) iconVariant = 'negative';
      else iconVariant = 'neutral';
    } else {
      iconVariant = variant;
    }

    // Formatação do número
    let formattedNumber: string;
    if (value === 0) {
      formattedNumber = '0';
    } else if (Math.abs(value) < 1000000) {
      formattedNumber = Math.round(value).toLocaleString();
    } else {
      formattedNumber = `${Math.round(value / 1000000)}M`;
    }

    if (!showIcon) {
      return formattedNumber;
    }

    console.log('🔍 SatsIcon Debug:', {
      value,
      formattedNumber,
      size,
      iconVariant,
      variant
    });

    return (
      <span className="flex items-center gap-1">
        {formattedNumber}
        <SatsIcon 
          size={size} 
          variant={iconVariant} 
          forceColor={forceColor}
          className={className}
        />
      </span>
    );
  };

  // Função para calcular tamanho dinâmico do texto e ícone baseado no valor
  const getDynamicSize = (value: number) => {
    const absValue = Math.abs(value);
    
    // Se o valor for zero, usar tamanho padrão
    if (absValue === 0) {
      return { textSize: 'text-number-lg', iconSize: 24 };
    }
    
    const digits = Math.floor(Math.log10(absValue)) + 1;
    
    if (digits <= 3) {
      return { textSize: 'text-number-lg', iconSize: 24 };
    } else if (digits <= 6) {
      return { textSize: 'text-number-md', iconSize: 20 };
    } else if (digits <= 9) {
      return { textSize: 'text-number-sm', iconSize: 16 };
    } else {
      return { textSize: 'text-number-xs', iconSize: 12 };
    }
  };

  return { formatSats, getDynamicSize };
};

// Hook para formatação simples (apenas texto)
export const useFormatSatsText = () => {
  return (value: number): string => {
    if (value === 0) return '0 sats';
    if (Math.abs(value) < 1000000) return `${Math.round(value).toLocaleString()} sats`;
    return `${Math.round(value / 1000000)}M sats`;
  };
};
