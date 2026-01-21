'use client';

import { useTranslations } from 'next-intl';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface IpPolicyConfigProps {
  value: {
    allowedIps?: string[];
    blockedIps?: string[];
  };
  onChange: (value: Record<string, unknown>) => void;
  disabled?: boolean;
}

export function IpPolicyConfig({ value, onChange, disabled }: IpPolicyConfigProps) {
  const t = useTranslations('Policies');

  const handleAllowedChange = (val: string) => {
    const ips = val.split('\n').map(s => s.trim()).filter(Boolean);
    onChange({ ...value, allowedIps: ips });
  };

  const handleBlockedChange = (val: string) => {
    const ips = val.split('\n').map(s => s.trim()).filter(Boolean);
    onChange({ ...value, blockedIps: ips });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t('ipConfig.allowedIps')}</Label>
        <Textarea
          placeholder={t('ipConfig.placeholder')}
          value={value.allowedIps?.join('\n') || ''}
          onChange={(e) => handleAllowedChange(e.target.value)}
          disabled={disabled}
          className="min-h-[100px] font-mono text-xs"
        />
        <p className="text-[10px] text-muted-foreground">{t('ipConfig.help')}</p>
      </div>

      <div className="space-y-2">
        <Label>{t('ipConfig.blockedIps')}</Label>
        <Textarea
          placeholder={t('ipConfig.placeholder')}
          value={value.blockedIps?.join('\n') || ''}
          onChange={(e) => handleBlockedChange(e.target.value)}
          disabled={disabled}
          className="min-h-[100px] font-mono text-xs"
        />
      </div>
    </div>
  );
}
