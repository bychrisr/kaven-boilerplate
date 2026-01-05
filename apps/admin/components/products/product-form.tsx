'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useFeatures } from '@/hooks/use-features';
import { Plus, Trash2 } from 'lucide-react';
import type { Product } from '@/hooks/use-products';

const productSchema = z.object({
  code: z.string().min(2, 'Código deve ter no mínimo 2 caracteres'),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  type: z.enum(['ONE_TIME', 'CONSUMABLE', 'ADD_ON']),
  price: z.coerce.number().positive('Preço deve ser maior que 0'),
  currency: z.string().default('BRL'),
  originalPrice: z.coerce.number().optional(),
  isPublic: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
  stock: z.coerce.number().default(-1),
  maxPerTenant: z.coerce.number().default(-1),
  imageUrl: z.string().url().optional().or(z.literal('')),
  effects: z.array(z.object({
    featureCode: z.string(),
    effectType: z.enum(['ADD', 'SET', 'MULTIPLY', 'ENABLE']),
    value: z.coerce.number().optional(),
    isPermanent: z.boolean().default(false),
    durationDays: z.coerce.number().optional(),
  })),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>;
  defaultValues?: Partial<Product>;
  isLoading?: boolean;
}

export function ProductForm({ onSubmit, defaultValues, isLoading }: ProductFormProps) {
  const { data: features } = useFeatures({ isActive: true });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      code: defaultValues?.code || '',
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      type: defaultValues?.type || 'ONE_TIME',
      price: defaultValues?.price || 0,
      currency: defaultValues?.currency || 'BRL',
      originalPrice: defaultValues?.originalPrice,
      isPublic: defaultValues?.isPublic ?? true,
      sortOrder: defaultValues?.sortOrder || 0,
      stock: defaultValues?.stock || -1,
      maxPerTenant: defaultValues?.maxPerTenant || -1,
      imageUrl: defaultValues?.imageUrl || '',
      effects: defaultValues?.effects?.map(e => ({
        featureCode: e.featureCode,
        effectType: e.effectType,
        value: e.value,
        isPermanent: e.isPermanent,
        durationDays: e.durationDays,
      })) || [],
    },
  });

  const { fields: effectFields, append: appendEffect, remove: removeEffect } = useFieldArray({
    control: form.control,
    name: 'effects',
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>Configure as informações principais do produto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código *</Label>
              <Input id="code" placeholder="ex: extra_storage_10gb" {...form.register('code')} />
              {form.formState.errors.code && <p className="text-sm text-destructive">{form.formState.errors.code.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" placeholder="ex: Armazenamento Extra (10GB)" {...form.register('name')} />
              {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" placeholder="Descrição do produto..." rows={3} {...form.register('description')} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select value={form.watch('type')} onValueChange={(value) => form.setValue('type', value as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONE_TIME">Único</SelectItem>
                  <SelectItem value="CONSUMABLE">Consumível</SelectItem>
                  <SelectItem value="ADD_ON">Add-on</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input id="price" type="number" step="0.01" min="0" {...form.register('price')} />
              {form.formState.errors.price && <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Preço Original</Label>
              <Input id="originalPrice" type="number" step="0.01" min="0" placeholder="Para desconto" {...form.register('originalPrice')} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Estoque (-1 = ilimitado)</Label>
              <Input id="stock" type="number" {...form.register('stock')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPerTenant">Máx por Tenant</Label>
              <Input id="maxPerTenant" type="number" {...form.register('maxPerTenant')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Ordem</Label>
              <Input id="sortOrder" type="number" {...form.register('sortOrder')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem</Label>
            <Input id="imageUrl" type="url" placeholder="https://..." {...form.register('imageUrl')} />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isPublic" checked={form.watch('isPublic')} onCheckedChange={(checked) => form.setValue('isPublic', checked)} />
            <Label htmlFor="isPublic">Público</Label>
          </div>
        </CardContent>
      </Card>

      {/* Efeitos */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Efeitos</CardTitle>
              <CardDescription>Configure os efeitos que este produto aplica</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => appendEffect({ featureCode: '', effectType: 'ADD', isPermanent: false })}>
              <Plus className="mr-2 h-4 w-4" />Adicionar Efeito
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {effectFields.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum efeito adicionado.</p>
          ) : (
            effectFields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Efeito #{index + 1}</h4>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeEffect(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Feature *</Label>
                    <Select value={form.watch(`effects.${index}.featureCode`)} onValueChange={(value) => form.setValue(`effects.${index}.featureCode`, value)}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        {features?.map((f) => (
                          <SelectItem key={f.code} value={f.code}>{f.name} ({f.type})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Efeito *</Label>
                    <Select value={form.watch(`effects.${index}.effectType`)} onValueChange={(value) => form.setValue(`effects.${index}.effectType`, value as any)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADD">Adicionar</SelectItem>
                        <SelectItem value="SET">Definir</SelectItem>
                        <SelectItem value="MULTIPLY">Multiplicar</SelectItem>
                        <SelectItem value="ENABLE">Habilitar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Valor</Label>
                    <Input type="number" placeholder="Valor do efeito" {...form.register(`effects.${index}.value`)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Duração (dias)</Label>
                    <Input type="number" placeholder="Deixe vazio para permanente" {...form.register(`effects.${index}.durationDays`)} />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={form.watch(`effects.${index}.isPermanent`)} onCheckedChange={(checked) => form.setValue(`effects.${index}.isPermanent`, checked)} />
                  <Label>Efeito Permanente</Label>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancelar</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar Produto'}</Button>
      </div>
    </form>
  );
}
