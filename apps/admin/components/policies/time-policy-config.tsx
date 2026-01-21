'use client';

import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface TimePolicyConfigProps {
  value: {
    allowedHours?: string[];
    allowedDays?: number[];
  };
  onChange: (value: Record<string, unknown>) => void;
  disabled?: boolean;
}

export function TimePolicyConfig({ value, onChange, disabled }: TimePolicyConfigProps) {
  const t = useTranslations('Policies');

  const days = [
    { label: t('timeConfig.days.1'), value: 1 },
    { label: t('timeConfig.days.2'), value: 2 },
    { label: t('timeConfig.days.3'), value: 3 },
    { label: t('timeConfig.days.4'), value: 4 },
    { label: t('timeConfig.days.5'), value: 5 },
    { label: t('timeConfig.days.6'), value: 6 },
    { label: t('timeConfig.days.0'), value: 0 },
  ];

  const handleDayToggle = (day: number) => {
    const currentDays = value.allowedDays || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d: number) => d !== day)
      : [...currentDays, day];
    onChange({ ...value, allowedDays: newDays.sort() });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t('timeConfig.allowedHours')}</Label>
        <Input
          placeholder={t('timeConfig.hoursPlaceholder')}
          value={value.allowedHours?.[0] || ''}
          onChange={(e) => onChange({ ...value, allowedHours: [e.target.value] })}
          disabled={disabled}
        />
        <p className="text-xs text-muted-foreground">Ex: 09:00-18:00 (HH:mm-HH:mm)</p>
      </div>

      <div className="space-y-2">
        <Label>{t('timeConfig.allowedDays')}</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {days.map((day) => (
            <div key={day.value} className="flex items-center space-x-2">
              <Checkbox
                id={`day-${day.value}`}
                checked={(value.allowedDays || []).includes(day.value)}
                onCheckedChange={() => handleDayToggle(day.value)}
                disabled={disabled}
              />
              <label
                htmlFor={`day-${day.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {day.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
