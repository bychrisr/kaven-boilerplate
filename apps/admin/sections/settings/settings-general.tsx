/**
 * Settings General Tab
 * General application settings
 */

'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/radix-select';

export function SettingsGeneral() {
  const t = useTranslations('Settings');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('general.title')}</CardTitle>
        <CardDescription>{t('subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* App Name */}
        <div className="space-y-2">
          <Label htmlFor="app-name">{t('general.appName')}</Label>
          <Input
            id="app-name"
            type="text"
            defaultValue="Kaven Admin"
          />
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label htmlFor="language">{t('general.language')}</Label>
          <Select defaultValue="pt-BR">
            <SelectTrigger id="language">
              <SelectValue placeholder={t('general.language')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="es-ES">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Timezone */}
        <div className="space-y-2">
           <Label htmlFor="timezone">{t('general.timezone')}</Label>
           <Select defaultValue="America/Sao_Paulo">
            <SelectTrigger id="timezone">
              <SelectValue placeholder={t('general.timezone')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
              <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
              <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
            </SelectContent>
          </Select>
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
