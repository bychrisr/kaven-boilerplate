'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useFormContext, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { TextField } from '@/components/ui/text-field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/radix-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Building2, Clock, Calendar, Globe } from 'lucide-react';
import { useTimezoneDetection } from '@/hooks/use-timezone-detection';

export function SaasSettingsGeneral() {
  const t = useTranslations('PlatformSettings');
  const { control } = useFormContext();

  // Hook de auto-detecção de timezone com suporte multi-idioma
  const { grouped, isLoading } = useTimezoneDetection('timezone');

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
      <CardContent className="space-y-8">
        {/* Seção: Informações da Empresa */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2">
            <Building2 className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Informações da Empresa</h3>
          </div>
          
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

        {/* Separador */}
        <div className="border-t" />

        {/* Seção: Configurações Regionais */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2">
            <Globe className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Configurações Regionais</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label className="mb-2 block">{t('general.language')}</Label>
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
                <Label className="mb-2 block">{t('general.currency')}</Label>
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

          <div>
              <Label className="mb-2 block">{t('general.numberFormat')}</Label>
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

        {/* Separador */}
        <div className="border-t" />

        {/* Seção: Data e Hora */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Data e Hora</h3>
          </div>

          {/* Fuso Horário */}
          <div>
            <Label className="mb-2 block">{t('timezone.label')}</Label>
            <Controller
              name="timezone"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('timezone.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(grouped).map(([continent, zones]) => (
                      <SelectGroup key={continent}>
                        <SelectLabel>{continent}</SelectLabel>
                        {zones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Formato de Data */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <Label className="mb-0">{t('formats.dateFormat')}</Label>
            </div>
            <Controller
              name="dateFormat"
              control={control}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="Y-m-d" id="date-1" />
                    <Label htmlFor="date-1" className="font-normal cursor-pointer">
                      Y-m-d <span className="text-muted-foreground">(2026-01-13)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="m/d/Y" id="date-2" />
                    <Label htmlFor="date-2" className="font-normal cursor-pointer">
                      m/d/Y <span className="text-muted-foreground">(01/13/2026)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="d/m/Y" id="date-3" />
                    <Label htmlFor="date-3" className="font-normal cursor-pointer">
                      d/m/Y <span className="text-muted-foreground">(13/01/2026)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="j \\de F \\de Y" id="date-4" />
                    <Label htmlFor="date-4" className="font-normal cursor-pointer">
                      Extenso <span className="text-muted-foreground">(13 de janeiro de 2026)</span>
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          {/* Formato de Hora */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <Label className="mb-0">{t('formats.timeFormat')}</Label>
            </div>
            <Controller
              name="timeFormat"
              control={control}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="H:i" id="time-1" />
                    <Label htmlFor="time-1" className="font-normal cursor-pointer">
                      24h <span className="text-muted-foreground">(00:24)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="g:i A" id="time-2" />
                    <Label htmlFor="time-2" className="font-normal cursor-pointer">
                      12h <span className="text-muted-foreground">(12:24 AM)</span>
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
