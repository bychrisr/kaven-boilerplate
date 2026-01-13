/**
 * Settings Security Tab
 * Security and password settings
 */

'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SettingsSecurity() {
  const t = useTranslations('Settings');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('security.title')}</CardTitle>
        <CardDescription>{t('security.changePassword')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Change Password */}
        <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">{t('security.currentPassword')}</Label>
              <Input
                id="current-password"
                type="password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">{t('security.newPassword')}</Label>
              <Input
                id="new-password"
                type="password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{t('security.confirmPassword')}</Label>
              <Input
                id="confirm-password"
                type="password"
              />
            </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="pt-6 border-t">
          <h3 className="text-lg font-medium mb-2">{t('security.2fa')}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('security.2faDescription')}
          </p>
          <Button variant="outline">
            {t('security.enable2fa')}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t px-6 py-4">
        <Button>
          {t('actions.save')}
        </Button>
      </CardFooter>
    </Card>
  );
}
