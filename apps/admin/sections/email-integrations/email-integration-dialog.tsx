'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { emailIntegrationsApi, EmailIntegration, EmailIntegrationInput } from '@/lib/api/email-integrations';
import { ProviderFields } from './provider-fields';

interface EmailIntegrationDialogProps {
  mode: 'create' | 'edit';
  integration?: EmailIntegration;
  trigger?: React.ReactNode;
  asMenuItem?: boolean;
}

export function EmailIntegrationDialog({ mode, integration, trigger, asMenuItem }: EmailIntegrationDialogProps) {
  const t = useTranslations('EmailIntegrations');
  const [open, setOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'SMTP' | 'RESEND' | 'POSTMARK' | 'AWS_SES'>(
    integration?.provider || 'SMTP'
  );
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, reset, control } = useForm<EmailIntegrationInput>({
    defaultValues: integration || {
      provider: 'SMTP',
      isActive: true,
      isPrimary: false,
      trackOpens: true,
      trackClicks: true,
    },
  });



  const isActive = useWatch({ control, name: 'isActive' });
  const isPrimary = useWatch({ control, name: 'isPrimary' });
  const trackOpens = useWatch({ control, name: 'trackOpens' });
  const trackClicks = useWatch({ control, name: 'trackClicks' });

  const createMutation = useMutation({
    mutationFn: emailIntegrationsApi.create,
    onSuccess: () => {
      console.log('Create integration success');
      queryClient.invalidateQueries({ queryKey: ['email-integrations'] });
      toast.success(t('createSuccess'));
      setOpen(false);
      reset();
    },
    onError: (error: Error) => {
      console.error('Create integration error:', error);
      toast.error(error.message || t('createFailed'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmailIntegrationInput> }) =>
      emailIntegrationsApi.update(id, data),
    onSuccess: () => {
      console.log('Update integration success');
      queryClient.invalidateQueries({ queryKey: ['email-integrations'] });
      toast.success(t('updateSuccess'));
      setOpen(false);
    },
    onError: (error: Error) => {
      console.error('Update integration error:', error);
      toast.error(error.message || t('updateFailed'));
    },
  });

  const onSubmit = (data: EmailIntegrationInput) => {
    console.log('Form submitted', { data, selectedProvider, mode });
    const payload = {
      ...data,
      provider: selectedProvider,
    };
    console.log('Payload:', payload);

    if (mode === 'create') {
      createMutation.mutate(payload);
    } else if (integration) {
      updateMutation.mutate({ id: integration.id, data: payload });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : asMenuItem ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" />
            {t('edit')}
          </DropdownMenuItem>
        ) : mode === 'create' ? (
          <Button variant="contained" color="primary" startIcon={<Plus />}>
            {t('addIntegration')}
          </Button>
        ) : (
          <Button variant="outlined" size="sm" startIcon={<Pencil />}>
            {t('edit')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? t('addIntegration') : t('editIntegration')}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? t('addIntegrationDescription')
              : t('editIntegrationDescription')}
          </DialogDescription>
        </DialogHeader>

        <form 
          onSubmit={(e) => {
            e.stopPropagation();
            handleSubmit(onSubmit)(e);
          }} 
          className="space-y-6"
        >
          {/* Provider Select */}
          <div>
            <Label>{t('provider')}</Label>
            <div className="mt-2">
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value as 'SMTP' | 'RESEND' | 'POSTMARK' | 'AWS_SES')}
                disabled={mode === 'edit'}
              >
                <option value="SMTP">{t('providers.SMTP')}</option>
                <option value="RESEND">{t('providers.RESEND')}</option>
                <option value="POSTMARK">{t('providers.POSTMARK')}</option>
                <option value="AWS_SES">{t('providers.AWS_SES')}</option>
              </select>
            </div>
            {mode === 'edit' && (
              <p className="text-xs text-muted-foreground mt-1">
                {t('providerCannotChange')}
              </p>
            )}
          </div>

          {/* Dynamic Provider Fields */}
          <div className="rounded-lg border p-4 bg-muted/20">
            <h4 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wider text-xs">Auth Credentials</h4>
            <ProviderFields provider={selectedProvider} register={register} control={control} /> 
            {/* Added control prop */}
          </div>

          {/* Sending Configuration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <h4 className="text-sm font-medium">{t('sendingConfig')}</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fromName">From Name</Label>
                <Input
                  id="fromName"
                  {...register('fromName')}
                  placeholder="Kaven"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="fromEmail">From Email</Label>
                <Input
                  id="fromEmail"
                  {...register('fromEmail')}
                  placeholder="noreply@example.com"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transactionalDomain">{t('transactionalDomain')}</Label>
                <Input
                  id="transactionalDomain"
                  {...register('transactionalDomain')}
                  placeholder="auth.kaven.site"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="marketingDomain">{t('marketingDomain')}</Label>
                <Input
                  id="marketingDomain"
                  {...register('marketingDomain')}
                  placeholder="mail.kaven.site"
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="border rounded-lg">
             <button
                type="button"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
             >
                <div className="flex items-center gap-2">
                   {isAdvancedOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                   <span className="font-medium text-sm">{t('advanced')}</span>
                </div>
                <span className="text-xs text-muted-foreground">{t('advancedDescription')}</span>
             </button>
             
             {isAdvancedOpen && (
                <div className="p-4 pt-0 space-y-4 animate-in slide-in-from-top-2">
                   <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                         <div>
                            <Label className="text-base">{t('trackOpens')}</Label>
                            <p className="text-sm text-muted-foreground">{t('trackOpensDescription')}</p>
                         </div>
                         <Switch 
                            checked={trackOpens}
                            onChange={(e) => setValue('trackOpens', e.target.checked)}
                         />
                      </div>
                      <div className="flex items-center justify-between">
                         <div>
                            <Label className="text-base">{t('trackClicks')}</Label>
                            <p className="text-sm text-muted-foreground">{t('trackClicksDescription')}</p>
                         </div>
                         <Switch 
                            checked={trackClicks}
                            onChange={(e) => setValue('trackClicks', e.target.checked)}
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <Label htmlFor="dailyLimit">{t('dailyLimit')}</Label>
                         <Input
                            id="dailyLimit"
                            type="number"
                            {...register('dailyLimit', { valueAsNumber: true })}
                            placeholder="0"
                            className="mt-2"
                         />
                         <p className="text-xs text-muted-foreground mt-1">{t('dailyLimitDescription')}</p>
                      </div>
                      <div>
                         <Label htmlFor="hourlyLimit">{t('hourlyLimit')}</Label>
                         <Input
                            id="hourlyLimit"
                            type="number"
                            {...register('hourlyLimit', { valueAsNumber: true })}
                            placeholder="0"
                            className="mt-2"
                         />
                         <p className="text-xs text-muted-foreground mt-1">{t('hourlyLimitDescription')}</p>
                      </div>
                   </div>
                </div>
             )}
          </div>

          {/* Status Switches */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label className="text-base">{t('active')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('activeDescription')}
                </p>
              </div>
              <Switch
                checked={isActive}
                onChange={(e) => setValue('isActive', e.target.checked)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label className="text-base">{t('primary')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('primaryDescription')}
                </p>
              </div>
              <Switch
                checked={isPrimary}
                onChange={(e) => setValue('isPrimary', e.target.checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outlined"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? t('create') : t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
