'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/radix-select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useFeatures } from '@/hooks/use-features';
import { Plus, Trash2, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Plan } from '@/hooks/use-plans';

const planSchema = z.object({
  code: z.string().min(2, 'Código deve ter no mínimo 2 caracteres'),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  type: z.enum(['SUBSCRIPTION', 'LIFETIME']),
  trialDays: z.coerce.number().min(0, 'Trial deve ser maior ou igual a 0'),
  isPublic: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  badge: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  prices: z.array(z.object({
    interval: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'LIFETIME', 'FOREVER']),
    intervalCount: z.coerce.number().min(1).default(1),
    amount: z.coerce.number().positive('Valor deve ser maior que 0'),
    currency: z.string().default('BRL'),
    originalAmount: z.coerce.number().optional(),
  })).min(1, 'Adicione pelo menos um preço'),
  features: z.array(z.object({
    featureCode: z.string(),
    enabled: z.boolean().optional(),
    limitValue: z.coerce.number().optional(),
    customValue: z.string().optional(),
  })),
});

type PlanFormData = z.infer<typeof planSchema>;

interface PlanFormProps {
  onSubmit: (data: PlanFormData) => Promise<void>;
  defaultValues?: Partial<Plan>;
  isLoading?: boolean;
}

export function PlanForm({ onSubmit, defaultValues, isLoading }: PlanFormProps) {
  const { data: features } = useFeatures({ isActive: true });

  const form = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      code: defaultValues?.code || '',
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      type: defaultValues?.type || 'SUBSCRIPTION',
      trialDays: defaultValues?.trialDays || 0,
      isPublic: defaultValues?.isPublic ?? true,
      isDefault: defaultValues?.isDefault ?? false,
      badge: defaultValues?.badge || '',
      sortOrder: defaultValues?.sortOrder || 0,
      prices: defaultValues?.prices || [
        { interval: 'MONTHLY', intervalCount: 1, amount: 0, currency: 'BRL' },
      ],
      features: defaultValues?.features?.map(f => ({
        featureCode: f.code,
        enabled: f.enabled,
        limitValue: f.limitValue,
        customValue: f.customValue,
      })) || [],
    },
  });

  const { fields: priceFields, append: appendPrice, remove: removePrice } = useFieldArray({
    control: form.control,
    name: 'prices',
  });

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control: form.control,
    name: 'features',
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>
            Configure as informações principais do plano
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                placeholder="ex: pro, enterprise"
                {...form.register('code')}
              />
              {form.formState.errors.code && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.code.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="ex: Plano Pro"
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descrição do plano..."
              rows={3}
              {...form.register('description')}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={form.watch('type')}
                onValueChange={(value) => form.setValue('type', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUBSCRIPTION">Assinatura</SelectItem>
                  <SelectItem value="LIFETIME">Vitalício</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trialDays">Trial (dias)</Label>
              <Input
                id="trialDays"
                type="number"
                min="0"
                {...form.register('trialDays')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Ordem</Label>
              <Input
                id="sortOrder"
                type="number"
                {...form.register('sortOrder')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="badge">Badge (opcional)</Label>
            <Input
              id="badge"
              placeholder="ex: Popular, Best Value"
              {...form.register('badge')}
            />
          </div>

          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={form.watch('isPublic')}
                onCheckedChange={(checked) => form.setValue('isPublic', checked)}
              />
              <Label htmlFor="isPublic">Público</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isDefault"
                checked={form.watch('isDefault')}
                onCheckedChange={(checked) => form.setValue('isDefault', checked)}
              />
              <Label htmlFor="isDefault">Plano Padrão</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preços */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Preços</CardTitle>
              <CardDescription>
                Configure os valores e intervalos de cobrança
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendPrice({
                interval: 'MONTHLY',
                intervalCount: 1,
                amount: 0,
                currency: 'BRL',
              })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Preço
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {priceFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Preço #{index + 1}</h4>
                {priceFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePrice(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Intervalo *</Label>
                  <Select
                    value={form.watch(`prices.${index}.interval`)}
                    onValueChange={(value) => form.setValue(`prices.${index}.interval`, value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAILY">Diário</SelectItem>
                      <SelectItem value="WEEKLY">Semanal</SelectItem>
                      <SelectItem value="MONTHLY">Mensal</SelectItem>
                      <SelectItem value="QUARTERLY">Trimestral</SelectItem>
                      <SelectItem value="YEARLY">Anual</SelectItem>
                      <SelectItem value="LIFETIME">Vitalício</SelectItem>
                      <SelectItem value="FOREVER">Gratuito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    min="1"
                    {...form.register(`prices.${index}.intervalCount`)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Valor (R$) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...form.register(`prices.${index}.amount`)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Valor Original</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Para desconto"
                    {...form.register(`prices.${index}.originalAmount`)}
                  />
                </div>
              </div>
            </div>
          ))}
          {form.formState.errors.prices && (
            <p className="text-sm text-destructive">
              {form.formState.errors.prices.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Features</CardTitle>
              <CardDescription>
                Selecione as funcionalidades incluídas neste plano
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const availableFeature = features?.find(
                  f => !featureFields.some(ff => ff.featureCode === f.code)
                );
                if (availableFeature) {
                  appendFeature({
                    featureCode: availableFeature.code,
                    enabled: true,
                    limitValue: undefined,
                  });
                }
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Feature
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {featureFields.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhuma feature adicionada. Clique em "Adicionar Feature" para começar.
            </p>
          ) : (
            featureFields.map((field, index) => {
              const feature = features?.find(f => f.code === field.featureCode);
              return (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Select
                          value={form.watch(`features.${index}.featureCode`)}
                          onValueChange={(value) => form.setValue(`features.${index}.featureCode`, value)}
                        >
                          <SelectTrigger className="w-[300px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {features?.map((f) => (
                              <SelectItem key={f.code} value={f.code}>
                                {f.name} ({f.type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {feature?.type === 'BOOLEAN' && (
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={form.watch(`features.${index}.enabled`) ?? true}
                              onCheckedChange={(checked) => 
                                form.setValue(`features.${index}.enabled`, checked)
                              }
                            />
                            <span className="text-sm">Habilitado</span>
                          </div>
                        )}

                        {feature?.type === 'QUOTA' && (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Limite (-1 = ilimitado)"
                              className="w-[200px]"
                              {...form.register(`features.${index}.limitValue`)}
                            />
                            <span className="text-sm text-muted-foreground">
                              {feature.unit}
                            </span>
                          </div>
                        )}

                        {feature?.type === 'CUSTOM' && (
                          <Input
                            placeholder="Valor customizado"
                            className="w-[200px]"
                            {...form.register(`features.${index}.customValue`)}
                          />
                        )}
                      </div>
                      {feature?.description && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {feature.description}
                        </p>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Plano'}
        </Button>
      </div>
    </form>
  );
}
