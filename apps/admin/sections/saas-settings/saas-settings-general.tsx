'use client';

import { useTranslations } from 'next-intl';
import { useFormContext, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { TextField } from '@/components/ui/text-field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/radix-select';
import { Building2 } from 'lucide-react';

export function SaasSettingsGeneral() {
  const t = useTranslations('PlatformSettings');
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {t('general.title')}
        </CardTitle>
        <CardDescription>
            {t('general.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
            <Controller
                name="companyName"
                control={control}
                render={({ field, fieldState }) => (
                    <TextField
                        {...field}
                        label={t('general.companyName')}
                        placeholder={t('placeholders.companyName')}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        fullWidth
                    />
                )}
            />
            
            <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => {
                    const length = field.value?.length || 0;
                    const isWarning = length >= 155 && length < 160;
                    const isLimit = length >= 160;
                    
                    return (
                        <div className="relative">
                            <TextField
                                {...field}
                                label={t('general.seoDescription')}
                                placeholder={t('placeholders.seoDescription')}
                                multiline
                                rows={3}
                                fullWidth
                                maxLength={160}
                                error={!!fieldState.error || isLimit}
                                helperText={fieldState.error?.message}
                                className={isWarning ? '!border-yellow-500 focus:!ring-yellow-500/20' : ''}
                            />
                            <div className={`absolute right-1 top-0 text-xs font-medium transition-colors ${
                                isLimit ? 'text-destructive' : isWarning ? 'text-yellow-600' : 'text-muted-foreground'
                            }`}>
                                {length}/160
                            </div>
                        </div>
                    );
                }}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label className="mb-2 block md:mb-1.5">{t('general.language')}</Label>
                <Controller
                    name="language"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t('general.language')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pt-BR">🇧🇷 Português (Brasil)</SelectItem>
                                <SelectItem value="en-US">🇺🇸 English (US)</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div>
                <Label className="mb-2 block md:mb-1.5">{t('general.currency')}</Label>
                <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t('general.currency')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BRL">R$ Real (BRL)</SelectItem>
                                <SelectItem value="USD">$ Dollar (USD)</SelectItem>
                                <SelectItem value="BTC">₿ Bitcoin (Sats)</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label className="mb-2 block md:mb-1.5">{t('general.numberFormat')}</Label>
                <Controller
                    name="numberFormat"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t('general.numberFormat')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1.000,00">1.000,00 (Ex: R$ 1.234,56)</SelectItem>
                                <SelectItem value="1,000.00">1,000.00 (Ex: $ 1,234.56)</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
