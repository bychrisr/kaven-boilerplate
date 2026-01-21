'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useCapabilities } from '@/hooks/use-capabilities';
import api from '@/lib/api';

interface ExportButtonProps {
  endpoint: string;
  filename?: string;
  capability?: string;
  variant?: 'outline' | 'default' | 'ghost';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  className?: string;
}

export function ExportButton({
  endpoint,
  filename = 'export.csv',
  capability,
  variant = 'outline',
  size = 'sm',
  className,
}: ExportButtonProps) {
  const t = useTranslations('Common');
  const { check } = useCapabilities();
  const [isExporting, setIsExporting] = useState(false);

  // FAIL-SAFE: Se não tiver permissão, não renderiza nada
  if (capability && !check(capability)) return null;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const response = await api.get(endpoint, {
        responseType: 'blob',
      });

      // Validar se o blob tem conteúdo
      if (!response.data || response.data.size === 0) {
        throw new Error('Empty file received');
      }

      // Cria um link temporário para o download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(t('export'));
    } catch (error) {
      console.error('Export error:', error);
      toast.error(t('exportError'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={isExporting}
      className={className}
    >
      {isExporting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isExporting ? t('exporting') : t('export')}
    </Button>
  );
}
