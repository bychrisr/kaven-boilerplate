'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Settings, Save, Loader2, Building2, UploadCloud } from 'lucide-react';

import { useTranslations } from 'next-intl';

import { Breadcrumbs, BreadcrumbItem } from '@/components/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { Label } from '@/components/ui/label';
import { Select, SelectOption } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

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
});

type FormData = z.infer<typeof formSchema>;

const PRESETS = [
  { name: 'default', main: '#00A76F' },
  { name: 'cyan', main: '#078DEE' },
  { name: 'purple', main: '#7635dc' },
  { name: 'blue', main: '#2065D1' },
  { name: 'orange', main: '#fda92d' },
  { name: 'red', main: '#FF3030' },
];

export default function PlatformSettingsPage() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { control, register, handleSubmit, reset, watch, setValue } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      description: '',
      primaryColor: '#00A76F',
      language: 'pt-BR',
      currency: 'BRL',
      numberFormat: '1.000,00',
      ogImageUrl: '',
      twitterHandle: '',
    }
  });

  const primaryColor = watch('primaryColor');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for base64
        toast.error('File too large. Max 1MB for direct upload.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('faviconUrl', reader.result as string, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const ogInputRef = useRef<HTMLInputElement>(null);
  const handleOgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for OG
        toast.error('File too large. Max 2MB for OG images.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
         setValue('ogImageUrl', reader.result as string, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

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
        });
      } catch (error) {
        console.error(error);
        toast.error('Erro ao carregar configurações');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [reset]);

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
      toast.success(t('Settings.saved'));
      
      // Reload to apply branding changes immediately
      window.location.reload();
      
    } catch (error) {
       console.error(error);
       toast.error('Erro ao salvar configurações');
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
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)}>
          {/* Page Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('Settings.title')}</h1>
              <div className="mt-2">
                <Breadcrumbs>
                  <BreadcrumbItem>
                    <Link href="/dashboard" className="transition-colors hover:text-foreground">
                      {t('Common.dashboard')}
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem current>{t('Settings.title')}</BreadcrumbItem>
                </Breadcrumbs>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2 items-center">
                <Button
                    type="button"
                    variant="outlined"
                    size="lg"
                    className="h-12 text-md font-medium"
                    onClick={() => window.location.reload()} // Simple reset
                    disabled={isSaving}
                >
                    Discard
                </Button>
                <Button 
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="lg"
                    disabled={isSaving}
                    className="h-12 text-md font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                >
                    {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="grid gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    General Settings
                </CardTitle>
                <CardDescription>
                    Configure the general information for your platform.
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
                                label="Company Name"
                                placeholder="Ex: Kaven SaaS"
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
                                        label="Description (SEO)"
                                        placeholder="Platform description..."
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
                        <Label className="mb-2 block md:mb-1.5">Default Language</Label>
                        <Controller
                            name="language"
                            control={control}
                            render={({ field }) => (
                                <Select 
                                    value={field.value} 
                                    onChange={field.onChange}
                                    fullWidth
                                >
                                    <SelectOption value="pt-BR">🇧🇷 Português (Brasil)</SelectOption>
                                    <SelectOption value="en-US">🇺🇸 English (US)</SelectOption>
                                </Select>
                            )}
                        />
                     </div>
                     <div>
                        <Label className="mb-2 block md:mb-1.5">Default Currency</Label>
                        <Controller
                            name="currency"
                            control={control}
                            render={({ field }) => (
                                <Select 
                                    value={field.value} 
                                    onChange={field.onChange}
                                    fullWidth
                                >
                                    <SelectOption value="BRL">R$ Real (BRL)</SelectOption>
                                    <SelectOption value="USD">$ Dollar (USD)</SelectOption>
                                    <SelectOption value="BTC">₿ Bitcoin (Sats)</SelectOption>
                                </Select>
                            )}
                        />
                     </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <Label className="mb-2 block md:mb-1.5">Number Format</Label>
                        <Controller
                            name="numberFormat"
                            control={control}
                            render={({ field }) => (
                                <Select 
                                    value={field.value} 
                                    onChange={field.onChange}
                                    fullWidth
                                >
                                    <SelectOption value="1.000,00">1.000,00 (Ex: R$ 1.234,56)</SelectOption>
                                    <SelectOption value="1,000.00">1,000.00 (Ex: $ 1,234.56)</SelectOption>
                                </Select>
                            )}
                        />
                     </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Branding
                </CardTitle>
                <CardDescription>
                    Customize the look and feel of your SaaS.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                     <div>
                       <Label className="text-foreground font-medium mb-3 block">Color Presets</Label>
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

                       <Label htmlFor="primaryColor" className="text-foreground font-medium mb-2 block">Custom Color</Label>
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
                                 placeholder="#000000"
                                 className="font-mono"
                              />
                         </div>
                         <div 
                             className="w-12 h-12 rounded-lg shadow-sm border border-border" 
                             style={{ backgroundColor: primaryColor }}
                         />
                       </div>
                       <p className="text-xs text-muted-foreground mt-2">
                         Select a preset or choose a custom color. This will be applied globally.
                       </p>
                     </div>

                     <div className="pt-4 border-t border-border">
                        <Label className="text-foreground font-medium mb-3 block">Favicon & Logo</Label>
                        
                        <div className="grid grid-cols-1 gap-6">
                             <Controller
                                name="faviconUrl"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-6 border p-4 rounded-lg bg-card">
                                            <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Active Favicon</Label>
                                                <div className="mt-2 h-16 w-16 rounded-xl border border-dashed border-border flex items-center justify-center bg-background/50 overflow-hidden shadow-sm">
                                                    {field.value ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img 
                                                            src={field.value} 
                                                            alt="Active Favicon" 
                                                            className="w-8 h-8 object-contain"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">None</span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex-1 space-y-3">
                                                 <div className="flex gap-2 w-full items-end">
                                                    <TextField
                                                        {...field}
                                                        label="Favicon URL"
                                                        placeholder="https://..."
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
                                                        Upload
                                                    </Button>
                                                 </div>
                                                 <p className="text-xs text-muted-foreground">
                                                    Recommended: 32x32px or 64x64px. Formats: .ico, .png, .svg. 
                                                    <span className="opacity-70"> (Max 1MB for upload)</span>
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UploadCloud className="h-5 w-5 text-primary" />
                    Public SEO Configuration
                </CardTitle>
                <CardDescription>
                    Configure Global SEO settings for your public pages (OG Image, Twitter).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label className="mb-2 block md:mb-1.5">Twitter Handle</Label>
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
                    <Label className="text-foreground font-medium mb-3 block">OpenGraph Image (Social Share)</Label>
                    <div className="grid grid-cols-1 gap-6">
                         <Controller
                            name="ogImageUrl"
                            control={control}
                            render={({ field }) => (
                                <div className="space-y-4">
                                    <div className="flex items-start gap-6 border p-4 rounded-lg bg-card">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Preview</Label>
                                            <div className="mt-2 h-24 w-40 rounded-xl border border-dashed border-border flex items-center justify-center bg-background/50 overflow-hidden shadow-sm relative group">
                                                {field.value ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img 
                                                        src={field.value} 
                                                        alt="OG Preview" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-muted-foreground text-center px-2">1200x630<br/>Recommended</span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 space-y-3">
                                             <div className="flex gap-2 w-full items-end">
                                                <TextField
                                                    {...field}
                                                    label="OG Image URL"
                                                    placeholder="https://..."
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
                                                    Upload
                                                </Button>
                                             </div>
                                             <p className="text-xs text-muted-foreground">
                                                Recommended: 1200x630px (1.91:1 ratio). Max 2MB.
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
          </div>
      </form>
     </div>
  );
}
