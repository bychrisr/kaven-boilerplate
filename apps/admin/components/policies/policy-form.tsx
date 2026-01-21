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
import { DevicePolicyConfig } from './device-policy-config';
import { useSpaces } from '@/hooks/use-spaces';
import { Space } from '@/stores/space.store';
import { useRoles, useCapabilitiesList, Role, Capability } from '@/hooks/use-roles';

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

  const { availableSpaces: spaces } = useSpaces();
  const { data: roles } = useRoles();
  const { data: capabilities } = useCapabilitiesList();

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
  const targetType = useWatch({ control: form.control, name: 'targetType' });

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
                    onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue('targetId', ''); // Reset ID when type changes
                    }} 
                    defaultValue={field.value} 
                    disabled={isEditing || isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['GLOBAL', 'SPACE', 'ROLE', 'CAPABILITY', 'USER'].map((target) => (
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
                  {targetType === 'GLOBAL' ? (
                    <FormControl>
                      <Input value="Global Access" disabled className="bg-muted" />
                    </FormControl>
                  ) : targetType === 'SPACE' ? (
                    <Select onValueChange={field.onChange} value={field.value} disabled={isEditing || isLoading}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select Space..." /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {spaces?.map((s: Space) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : targetType === 'ROLE' ? (
                    <Select onValueChange={field.onChange} value={field.value} disabled={isEditing || isLoading}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select Role..." /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles?.map((r: Role) => <SelectItem key={r.id} value={r.id}>{r.name} ({r.spaceId === 'ADMIN' ? 'Global' : 'Space'})</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : targetType === 'CAPABILITY' ? (
                    <Select onValueChange={field.onChange} value={field.value} disabled={isEditing || isLoading}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select Capability..." /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {capabilities?.map((c: Capability) => <SelectItem key={c.id} value={c.code}>{c.code}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : (
                    <FormControl>
                      <Input {...field} placeholder="User ID (UUID)" disabled={isEditing || isLoading} />
                    </FormControl>
                  )}
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
                    onChange={(e: { target: { checked: boolean } }) => field.onChange(e.target.checked)}
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
              <DevicePolicyConfig
                value={form.getValues('conditions') as { requireTrusted?: boolean; minTrustLevel?: number }}
                onChange={(val) => form.setValue('conditions', val, { shouldDirty: true })}
                disabled={isLoading}
              />
            )}
            {selectedType === 'GEO_RESTRICTION' && (
              <div className="grid gap-4">
                <div className="space-y-2">
                  <FormLabel>{t('geoConfig.allowedCountries')}</FormLabel>
                  <Input 
                    placeholder={t('geoConfig.placeholder')} 
                    value={(form.getValues('conditions') as { allowedCountries?: string[] }).allowedCountries?.join(', ') || ''}
                    onChange={(e) => {
                      const val = e.target.value.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
                      const current = form.getValues('conditions') as Record<string, unknown>;
                      form.setValue('conditions', { ...current, allowedCountries: val }, { shouldDirty: true });
                    }}
                    disabled={isLoading}
                  />
                  <p className="text-[10px] text-muted-foreground">{t('geoConfig.help')}</p>
                </div>
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
