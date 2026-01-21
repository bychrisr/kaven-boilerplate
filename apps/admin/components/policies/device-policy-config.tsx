'use client';

import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/radix-select';

interface DevicePolicyConfigProps {
  value: {
    requireTrusted?: boolean;
    minTrustLevel?: number;
  };
  onChange: (value: Record<string, unknown>) => void;
  disabled?: boolean;
}

export function DevicePolicyConfig({ value, onChange, disabled }: DevicePolicyConfigProps) {
  const t = useTranslations('Policies');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-background/50">
        <div className="space-y-0.5">
          <Label>{t('deviceConfig.requireTrusted')}</Label>
          <p className="text-[10px] text-muted-foreground">
            {t('deviceConfig.requireTrustedHelp')}
          </p>
        </div>
        <Switch
          checked={value.requireTrusted ?? true}
          onChange={(e) => onChange({ ...value, requireTrusted: e.target.checked })}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label>{t('deviceConfig.minTrustLevel')}</Label>
        <Select 
          value={String(value.minTrustLevel ?? 1)} 
          onValueChange={(val) => onChange({ ...value, minTrustLevel: Number(val) })}
          disabled={disabled || !value.requireTrusted}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">{t('deviceConfig.trustLevels.1')}</SelectItem>
            <SelectItem value="2">{t('deviceConfig.trustLevels.2')}</SelectItem>
            <SelectItem value="3">{t('deviceConfig.trustLevels.3')}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-[10px] text-muted-foreground">
          {t('deviceConfig.minTrustLevelHelp')}
        </p>
      </div>
    </div>
  );
}
