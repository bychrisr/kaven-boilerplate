import { useQuery } from '@tanstack/react-query';

interface PlatformSettings {
  id: string;
  companyName: string;
  description?: string;
  primaryColor: string;
  logoUrl?: string;
  faviconUrl?: string;
  language: string;
  currency: string;
  numberFormat: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  twitterHandle?: string;
  ogImageUrl?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  smtpUser?: string;
  smtpPassword?: string;
  emailFrom?: string;
}

export function usePlatformSettings() {
  return useQuery<PlatformSettings>({
    queryKey: ['platform-settings'],
    queryFn: async () => {
      const res = await fetch('/api/settings/platform');
      if (!res.ok) throw new Error('Failed to load platform settings');
      return res.json();
    },
    refetchInterval: 5000, // Revalida a cada 5 segundos
    refetchOnWindowFocus: true, // Revalida ao focar janela
    staleTime: 2000, // Considera dados "frescos" por 2s
  });
}
