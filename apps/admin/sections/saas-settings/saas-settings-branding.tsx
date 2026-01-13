'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useFormContext, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { Settings, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

const PRESETS = [
    { name: 'default', main: '#00A76F' },
    { name: 'cyan', main: '#078DEE' },
    { name: 'purple', main: '#7635dc' },
    { name: 'blue', main: '#2065D1' },
    { name: 'orange', main: '#fda92d' },
    { name: 'red', main: '#FF3030' },
];

export function SaasSettingsBranding() {
    const t = useTranslations('PlatformSettings');
    const { control, setValue, watch, register } = useFormContext();
    const primaryColor = watch('primaryColor');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) { // 1MB limit for base64
                toast.error(t('validation.fileTooLarge', { size: '1' }));
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setValue('faviconUrl', reader.result as string, { shouldDirty: true });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    {t('branding.title')}
                </CardTitle>
                <CardDescription>
                    {t('branding.description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <Label className="text-foreground font-medium mb-3 block">{t('branding.presets')}</Label>
                        <div className="flex flex-wrap gap-3 mb-6">
                            {PRESETS.map((preset) => (
                                <button
                                    type="button"
                                    key={preset.name}
                                    onClick={() => setValue('primaryColor', preset.main)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                                        primaryColor === preset.main 
                                        ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background' 
                                        : 'border-transparent hover:scale-110'
                                    }`}
                                    style={{ backgroundColor: preset.main }}
                                />
                            ))}
                        </div>

                        <Label htmlFor="primaryColor" className="text-foreground font-medium mb-2 block">{t('branding.customColor')}</Label>
                        <div className="flex gap-4 items-center">
                            <div className="relative">
                                <Input
                                    id="primaryColor"
                                    type="color"
                                    {...register('primaryColor')}
                                    className="w-16 h-16 p-1 bg-background border-input cursor-pointer rounded-lg"
                                />
                            </div>
                            <div className="flex-1 max-w-xs">
                                <Input
                                    value={primaryColor}
                                    onChange={(e) => setValue('primaryColor', e.target.value)}
                                    placeholder={t('placeholders.color')}
                                    className="font-mono"
                                />
                            </div>
                            <div 
                                className="w-12 h-12 rounded-lg shadow-sm border border-border" 
                                style={{ backgroundColor: primaryColor }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {t('help.colorDescription')}
                        </p>
                    </div>

                    <div className="pt-4 border-t border-border">
                        <Label className="text-foreground font-medium mb-3 block">{t('branding.faviconAndLogo')}</Label>
                        
                        <div className="grid grid-cols-1 gap-6">
                            <Controller
                                name="faviconUrl"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-6 border p-4 rounded-lg bg-card">
                                            <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t('branding.activeFavicon')}</Label>
                                                <div className="mt-2 h-16 w-16 rounded-xl border border-dashed border-border flex items-center justify-center bg-background/50 overflow-hidden shadow-sm">
                                                    {field.value ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img 
                                                            src={field.value} 
                                                            alt="Active Favicon" 
                                                            className="w-8 h-8 object-contain"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">{t('help.noFile')}</span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex-1 space-y-3">
                                                <div className="flex gap-2 w-full items-end">
                                                    <TextField
                                                        {...field}
                                                        label={t('branding.faviconUrl')}
                                                        placeholder={t('placeholders.url')}
                                                        fullWidth
                                                        className="flex-1"
                                                    />
                                                    <input 
                                                        type="file" 
                                                        ref={fileInputRef}
                                                        className="hidden" 
                                                        accept=".ico,.png,.jpg,.svg"
                                                        onChange={handleFileUpload}
                                                    />
                                                    <Button 
                                                        type="button" 
                                                        variant="outlined" 
                                                        className="h-[46px] px-6"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        <UploadCloud className="mr-2 h-4 w-4" />
                                                        {t('branding.upload')}
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {t('branding.recommended')}
                                                    <span className="opacity-70"> (Max 1MB)</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
