/**
 * Settings Notifications Tab
 * Notification preferences
 */

'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export function SettingsNotifications() {
  const t = useTranslations('Settings');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('notifications.title')}</CardTitle>
        <CardDescription>{t('notifications.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div>
          <h3 className="text-lg font-medium mb-4">{t('notifications.email')}</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox id="newUsers" defaultChecked />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="newUsers">
                  {t('notifications.newUsers')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('notifications.newUsersDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="newOrders" defaultChecked />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="newOrders">
                  {t('notifications.newOrders')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('notifications.newOrdersDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="systemUpdates" />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="systemUpdates">
                  {t('notifications.systemUpdates')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('notifications.systemUpdatesDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="pt-6 border-t">
          <h3 className="text-lg font-medium mb-4">{t('notifications.push')}</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox id="realTime" defaultChecked />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="realTime">
                  {t('notifications.realTime')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('notifications.realTimeDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="reminders" />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="reminders">
                  {t('notifications.reminders')}
                </Label>
                <p className="text-sm text-muted-foreground">{t('notifications.remindersDesc')}</p>
              </div>
            </div>
          </div>
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
