'use client';

import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { UseFormRegister, Control, Controller } from 'react-hook-form';

interface ProviderFieldsProps {
  provider: 'SMTP' | 'RESEND' | 'POSTMARK' | 'AWS_SES';
  register: UseFormRegister<any>;
  control: Control<any>;
}

export function ProviderFields({ provider, register, control }: ProviderFieldsProps) {
  const t = useTranslations('EmailIntegrations');

  switch (provider) {
    case 'SMTP':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtpHost">{t('smtpHost')}</Label>
              <Input
                id="smtpHost"
                {...register('smtpHost')}
                placeholder="smtp.gmail.com"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="smtpPort">{t('smtpPort')}</Label>
              <Input
                id="smtpPort"
                {...register('smtpPort', { valueAsNumber: true })}
                type="number"
                placeholder="587"
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtpUser">{t('smtpUser')}</Label>
              <Input
                id="smtpUser"
                {...register('smtpUser')}
                placeholder="user@example.com"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="smtpPassword">{t('smtpPassword')}</Label>
              <Input
                id="smtpPassword"
                {...register('smtpPassword')}
                type="password"
                placeholder="••••••••"
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label className="text-base">{t('smtpSecure')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('smtpSecureDescription')}
              </p>
            </div>
            <Controller
              control={control}
              name="smtpSecure"
              render={({ field }) => (
                <Switch 
                  checked={field.value} 
                  onChange={field.onChange} 
                />
              )}
            />
          </div>
        </div>
      );

    case 'RESEND':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              {...register('apiKey')}
              placeholder="re_••••••••"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Get your API key from Resend dashboard
            </p>
          </div>
        </div>
      );

    case 'POSTMARK':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="apiKey">Server API Token</Label>
            <Input
              id="apiKey"
              {...register('apiKey')}
              placeholder="pm_••••••••"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Get your server token from Postmark
            </p>
          </div>

          <div>
            <Label htmlFor="webhookSecret">Webhook Secret (Optional)</Label>
            <Input
              id="webhookSecret"
              {...register('webhookSecret')}
              placeholder="••••••••"
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="transactionalStream">{t('transactionalStream')}</Label>
              <Input
                id="transactionalStream"
                {...register('transactionalStream')}
                placeholder="outbound"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="marketingStream">{t('marketingStream')}</Label>
              <Input
                id="marketingStream"
                {...register('marketingStream')}
                placeholder="broadcasts"
                className="mt-2"
              />
            </div>
          </div>
        </div>
      );

    case 'AWS_SES':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="apiKey">Access Key ID</Label>
            <Input
              id="apiKey"
              {...register('apiKey')}
              placeholder="AKIA••••••••"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="apiSecret">Secret Access Key</Label>
            <Input
              id="apiSecret"
              {...register('apiSecret')}
              type="password"
              placeholder="••••••••"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="region">{t('region')}</Label>
            <Input
              id="region"
              {...register('region')}
              placeholder="us-east-1"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t('regionDescription')}
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
}

