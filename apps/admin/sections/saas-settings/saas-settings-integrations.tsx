'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useFormContext, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Blocks, Mail, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export function SaasSettingsIntegrations() {
  const t = useTranslations('PlatformSettings');
  const { control, register } = useFormContext();
  const [isTesting, setIsTesting] = useState(false);

  const handleTestEmail = async () => {
    setIsTesting(true);
    try {
      const { data } = await api.post('/api/settings/platform/test-email');
      
      if (data.success) {
        toast.success(t('integrations.emailTestSuccess'), {
          icon: <CheckCircle2 className="h-4 w-4" />,
        });
      } else {
        toast.error(`${t('integrations.emailTestFailed')}: ${data.message}`, {
          icon: <XCircle className="h-4 w-4" />,
        });
      }
    } catch {
      toast.error(t('integrations.emailTestError'));
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Blocks className="h-5 w-5 text-primary" />
          {t('integrations.title')}
        </CardTitle>
        <CardDescription>
          {t('integrations.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email/SMTP Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Mail className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">{t('integrations.emailIntegration')}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="smtpHost">{t('integrations.smtpHost')}</Label>
              <Input
                id="smtpHost"
                {...register('smtpHost')}
                placeholder="smtp.gmail.com"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="smtpPort">{t('integrations.smtpPort')}</Label>
              <Input
                id="smtpPort"
                {...register('smtpPort', { valueAsNumber: true })}
                type="number"
                placeholder="587"
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="smtpUser">{t('integrations.smtpUser')}</Label>
              <Input
                id="smtpUser"
                {...register('smtpUser')}
                placeholder="user@example.com"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="smtpPassword">{t('integrations.smtpPassword')}</Label>
              <Input
                id="smtpPassword"
                {...register('smtpPassword')}
                type="password"
                placeholder="••••••••"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('integrations.smtpPasswordDescription')}
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="emailFrom">{t('integrations.emailFrom')}</Label>
            <Input
              id="emailFrom"
              {...register('emailFrom')}
              placeholder="Kaven <noreply@kaven.com>"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t('integrations.emailFromDescription')}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">{t('integrations.smtpSecure')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('integrations.smtpSecureDescription')}
              </p>
            </div>
            <Controller
              name="smtpSecure"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button
              type="button"
              variant="outlined"
              onClick={handleTestEmail}
              disabled={isTesting}
            >
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('integrations.testing')}
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {t('integrations.testEmailConfiguration')}
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              {t('integrations.testEmailHint')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
