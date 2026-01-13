'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useFormContext, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

export function SaasSettingsSeo() {
    const t = useTranslations('PlatformSettings');
    const { control, setValue } = useFormContext();
    const ogInputRef = useRef<HTMLInputElement>(null);

    const handleOgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit for OG
                toast.error(t('validation.fileTooLargeOg'));
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                 setValue('ogImageUrl', reader.result as string, { shouldDirty: true });
            };
            reader.readAsDataURL(file);
        }
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-primary" />
            {t('seo.title')}
        </CardTitle>
        <CardDescription>
            {t('seo.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label className="mb-2 block md:mb-1.5">{t('seo.twitterHandle')}</Label>
                <Controller
                    name="twitterHandle"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            placeholder="@kavensaas"
                            fullWidth
                            startAdornment={<span className="text-muted-foreground select-none pointer-events-none">@</span>}
                        />
                    )}
                />
            </div>
         </div>

         <div className="pt-4 border-t border-border">
            <Label className="text-foreground font-medium mb-3 block">{t('seo.ogImage')}</Label>
            <div className="grid grid-cols-1 gap-6">
                 <Controller
                    name="ogImageUrl"
                    control={control}
                    render={({ field }) => (
                        <div className="space-y-4">
                            <div className="flex items-start gap-6 border p-4 rounded-lg bg-card">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t('seo.preview')}</Label>
                                    <div className="mt-2 h-24 w-40 rounded-xl border border-dashed border-border flex items-center justify-center bg-background/50 overflow-hidden shadow-sm relative group">
                                        {field.value ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img 
                                                src={field.value} 
                                                alt="OG Preview" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs text-muted-foreground text-center px-2 whitespace-pre-wrap">{t('help.ogDefault')}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex-1 space-y-3">
                                     <div className="flex gap-2 w-full items-end">
                                        <TextField
                                            {...field}
                                            label="OG Image URL"
                                            placeholder={t('placeholders.url')}
                                            fullWidth
                                            className="flex-1"
                                        />
                                        <input 
                                            type="file" 
                                            ref={ogInputRef}
                                            className="hidden" 
                                            accept=".png,.jpg,.jpeg"
                                            onChange={handleOgUpload}
                                        />
                                        <Button 
                                            type="button" 
                                            variant="outlined" 
                                            className="h-[46px] px-6"
                                            onClick={() => ogInputRef.current?.click()}
                                        >
                                            <UploadCloud className="mr-2 h-4 w-4" />
                                            {t('branding.upload')}
                                        </Button>
                                     </div>
                                     <p className="text-xs text-muted-foreground">
                                        {t('help.ogRecommended')}
                                     </p>
                                </div>
                            </div>
                        </div>
                    )}
                />
            </div>
         </div>
      </CardContent>
    </Card>
  );
}
