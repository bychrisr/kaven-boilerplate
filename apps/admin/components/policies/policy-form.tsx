'use client';

import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePolicy, useUpdatePolicy, Policy, PolicyType, PolicyTargetType, PolicyEnforcement } from '@/hooks/use-policies';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/radix-select';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { IpPolicyConfig } from './ip-policy-config';
import { TimePolicyConfig } from './time-policy-config';

const policySchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().optional(),
  type: z.enum(['IP_WHITELIST', 'DEVICE_TRUST', 'TIME_BASED', 'GEO_RESTRICTION']),
  targetType: z.enum(['SPACE', 'ROLE', 'CAPABILITY', 'USER', 'GLOBAL']),
  targetId: z.string().optional(),
  enforcement: z.enum(['DENY', 'ALLOW', 'WARN', 'REQUIRE_MFA']),
  isActive: z.boolean(),
  conditions: z.record(z.string(), z.unknown()),
});

type PolicyFormValues = z.infer<typeof policySchema>;

interface PolicyFormProps {
  initialData?: Policy;
  onSuccess?: () => void;
}

export function PolicyForm({ initialData, onSuccess }: PolicyFormProps) {
  const t = useTranslations('Policies');
  const createPolicy = useCreatePolicy();
  const updatePolicy = useUpdatePolicy();
  const isEditing = !!initialData;
  const isLoading = createPolicy.isPending || updatePolicy.isPending;

  const form = useForm<PolicyFormValues>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      type: (initialData?.type as PolicyType) || 'IP_WHITELIST',
      targetType: (initialData?.targetType as PolicyTargetType) || 'GLOBAL',
      targetId: initialData?.targetId || '',
      enforcement: (initialData?.enforcement as PolicyEnforcement) || 'DENY',
      isActive: initialData?.isActive ?? true,
      conditions: (initialData?.conditions as Record<string, unknown>) || {},
    },
  });

  const selectedType = useWatch({ control: form.control, name: 'type' });

  const onSubmit = async (data: PolicyFormValues) => {
    try {
      if (isEditing && initialData) {
        await updatePolicy.mutateAsync({
          id: initialData.id,
          ...data,
        });
      } else {
        await createPolicy.mutateAsync(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('list.name')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('form.namePlaceholder')} {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.typeLabel')}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                    disabled={isEditing || isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['IP_WHITELIST', 'DEVICE_TRUST', 'TIME_BASED', 'GEO_RESTRICTION'].map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`types.${type}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enforcement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.enforcementLabel')}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['DENY', 'ALLOW', 'WARN', 'REQUIRE_MFA'].map((enf) => (
                        <SelectItem key={enf} value={enf}>
                          {t(`enforcements.${enf}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="targetType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.targetTypeLabel')}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                    disabled={isEditing || isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['GLOBAL', 'SPACE', 'ROLE', 'USER'].map((target) => (
                        <SelectItem key={target} value={target}>
                          {t(`targets.${target}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.targetIdLabel')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ID (UUID)" disabled={isEditing || isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Policy Status</FormLabel>
                  <FormDescription>Enable or disable this policy rules.</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    disabled={isLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="pt-4 border-t">
            <h3 className="font-medium mb-4">{t('form.conditions')}</h3>
            {selectedType === 'IP_WHITELIST' && (
              <IpPolicyConfig
                value={form.getValues('conditions') as { allowedIps?: string[]; blockedIps?: string[] }}
                onChange={(val) => form.setValue('conditions', val, { shouldDirty: true })}
                disabled={isLoading}
              />
            )}
            {selectedType === 'TIME_BASED' && (
              <TimePolicyConfig
                value={form.getValues('conditions') as { allowedHours?: string[]; allowedDays?: number[] }}
                onChange={(val) => form.setValue('conditions', val, { shouldDirty: true })}
                disabled={isLoading}
              />
            )}
            {selectedType === 'DEVICE_TRUST' && (
              <div className="p-4 bg-muted rounded-md text-sm">
                This policy requires the user to be using a registered trusted device.
                No additional conditions needed.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? t('form.save') : t('form.create')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
