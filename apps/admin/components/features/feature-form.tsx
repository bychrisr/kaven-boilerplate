'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/radix-select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const featureSchema = z.object({
  code: z.string().min(2, 'Código deve ter no mínimo 2 caracteres').toUpperCase(),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  type: z.enum(['BOOLEAN', 'QUOTA', 'CUSTOM']),
  defaultValue: z.string().optional(),
  unit: z.string().optional(),
  category: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
});

type FeatureFormData = z.infer<typeof featureSchema>;

interface FeatureFormProps {
  onSubmit: (data: FeatureFormData) => Promise<void>;
  isLoading?: boolean;
}

export function FeatureForm({ onSubmit, isLoading }: FeatureFormProps) {
  const form = useForm<FeatureFormData>({
    resolver: zodResolver(featureSchema) as any,
    defaultValues: {
      code: '',
      name: '',
      description: '',
      type: 'BOOLEAN',
      defaultValue: '',
      unit: '',
      category: '',
      sortOrder: 0,
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Informações da Feature</CardTitle>
          <CardDescription>Configure uma nova funcionalidade do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código * (MAIÚSCULAS)</Label>
              <Input id="code" placeholder="ex: API_CALLS" {...form.register('code')} style={{ textTransform: 'uppercase' }} />
              {form.formState.errors.code && <p className="text-sm text-destructive">{form.formState.errors.code.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" placeholder="ex: Chamadas API" {...form.register('name')} />
              {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" placeholder="Descrição da feature..." rows={3} {...form.register('description')} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select value={form.watch('type')} onValueChange={(value) => form.setValue('type', value as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BOOLEAN">Boolean (On/Off)</SelectItem>
                  <SelectItem value="QUOTA">Quota (Limite numérico)</SelectItem>
                  <SelectItem value="CUSTOM">Custom (Valor customizado)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unidade</Label>
              <Input id="unit" placeholder="ex: calls, MB, users" {...form.register('unit')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input id="category" placeholder="ex: API, Storage" {...form.register('category')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultValue">Valor Padrão</Label>
              <Input id="defaultValue" placeholder="Valor inicial" {...form.register('defaultValue')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Ordem</Label>
              <Input id="sortOrder" type="number" {...form.register('sortOrder')} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancelar</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar Feature'}</Button>
      </div>
    </form>
  );
}
