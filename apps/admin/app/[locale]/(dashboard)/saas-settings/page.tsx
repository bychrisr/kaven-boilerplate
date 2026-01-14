'use client';

import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useQueryClient } from '@tanstack/react-query';

import { SaasSettingsView } from '@/sections/saas-settings/view/saas-settings-view';

const formSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  description: z.string().default('').refine((val) => val.length <= 160, {
      message: 'SEO Limit exceeded (max 160 chars)',
  }),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color code'),
  language: z.string(),
  currency: z.string(),
  numberFormat: z.string().default('1.000,00'),
  logoUrl: z.string().optional().default(''),
  faviconUrl: z.string().optional().default(''),
  ogImageUrl: z.string().optional().default(''),
  twitterHandle: z.string().optional().default(''),
  // Novos campos
  timezone: z.string().optional().default('UTC'),
  dateFormat: z.string().optional().default('Y-m-d'),
  timeFormat: z.string().optional().default('g:i A'),
  smtpHost: z.string().optional().default('localhost'),
  smtpPort: z.number().optional().default(1025),
  smtpSecure: z.boolean().optional().default(false),
  smtpUser: z.string().optional().default(''),
  smtpPassword: z.string().optional().default(''),
  emailFrom: z.string().optional().default('Kaven <noreply@kaven.com>'),
});

type FormData = z.infer<typeof formSchema>;


export default function PlatformSettingsPage() {
  const t = useTranslations('PlatformSettings');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      description: '',
      primaryColor: '#00A76F',
      language: 'pt-BR',
      currency: 'BRL',
      numberFormat: '1.000,00',
      logoUrl: '',
      faviconUrl: '',
      ogImageUrl: '',
      twitterHandle: '',
      // Novos campos
      timezone: 'UTC',
      dateFormat: 'Y-m-d',
      timeFormat: 'g:i A',
      smtpHost: 'localhost',
      smtpPort: 1025,
      smtpSecure: false,
      smtpUser: '',
      smtpPassword: '',
      emailFrom: 'Kaven <noreply@kaven.com>',
    }
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/settings/platform');
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            console.error('[Frontend] API Error Details:', errData);
            throw new Error(errData.message || errData.details || 'Failed to load settings');
        }
        const data = await res.json();
        
        reset({
            companyName: data.companyName || '',
            description: data.description || '',
            primaryColor: data.primaryColor || '#00A76F',
            language: data.language || 'pt-BR',
            currency: data.currency || 'BRL',
            numberFormat: data.numberFormat || '1.000,00',
            logoUrl: data.logoUrl || '',
            faviconUrl: data.faviconUrl || '',
            ogImageUrl: data.ogImageUrl || '',
            twitterHandle: data.twitterHandle || '',
            // Timezone and formats
            timezone: data.timezone || 'UTC',
            dateFormat: data.dateFormat || 'Y-m-d',
            timeFormat: data.timeFormat || 'g:i A',
            // SMTP
            smtpHost: data.smtpHost || 'localhost',
            smtpPort: data.smtpPort || 1025,
            smtpSecure: data.smtpSecure || false,
            smtpUser: data.smtpUser || '',
            smtpPassword: data.smtpPassword || '',
            emailFrom: data.emailFrom || 'Kaven <noreply@kaven.com>',
        });
      } catch (error) {
        console.error(error);
        toast.error(tCommon('errors.errorTitle'));
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [reset, tCommon]);

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings/platform', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.error('[Frontend] Save Error Details:', errData);
          throw new Error(errData.message || errData.details || 'Failed to save');
      }
      
      const updated = await res.json();
      reset(updated); // Update form with server response
      
      // Invalidate cache to trigger live reload
      queryClient.invalidateQueries({ queryKey: ['platform-settings'] });
      
      toast.success(tCommon('saved'));
      
      // Refresh server components to apply changes without full reload
      router.refresh();
      
    } catch (error) {
       console.error(error);
       toast.error(tCommon('errors.errorTitle'));
    } finally {
       setIsSaving(false);
    }
  };

  if (isLoading) {
      return (
          <div className="flex h-[50vh] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
      );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
          <SaasSettingsView isSaving={isSaving} />
      </form>
    </FormProvider>
  );
}
