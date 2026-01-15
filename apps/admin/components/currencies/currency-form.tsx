'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/radix-select';
import { currencySchema, type CurrencyFormData } from '@/lib/validations/currency';
import { SvgUploader } from './svg-uploader';
import { toast } from 'sonner';
import type { Currency } from '@/hooks/use-currency';

interface CurrencyFormProps {
  currency?: Currency;
  mode: 'create' | 'edit';
}

export function CurrencyForm({ currency, mode }: CurrencyFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CurrencyFormData>({
    resolver: zodResolver(currencySchema),
    defaultValues: currency
      ? {
          code: currency.code,
          name: currency.name,
          symbol: currency.symbol || '',
          iconType: currency.iconType,
          iconSvgPath: currency.iconSvgPath || '',
          decimals: currency.decimals,
          isActive: currency.isActive,
          isCrypto: currency.isCrypto,
          sortOrder: currency.sortOrder,
        }
      : {
          iconType: 'TEXT',
          decimals: 2,
          isActive: true,
          isCrypto: false,
          sortOrder: 0,
        },
  });

  const iconType = watch('iconType');
  const isCrypto = watch('isCrypto');

  // Mutation para criar/atualizar
  const mutation = useMutation({
    mutationFn: async (data: CurrencyFormData) => {
      const url =
        mode === 'create'
          ? '/api/currencies'
          : `/api/currencies/${currency?.code}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save currency');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      toast.success(
        mode === 'create' ? 'Moeda criada com sucesso' : 'Moeda atualizada com sucesso'
      );
      router.push('/currencies');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: CurrencyFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {mode === 'create' ? 'Nova Moeda' : 'Editar Moeda'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'create'
              ? 'Adicione uma nova moeda à plataforma'
              : 'Atualize as informações da moeda'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Informações Básicas</h2>

          {/* Código */}
          <div className="space-y-2">
            <Label htmlFor="code">
              Código * <span className="text-xs text-muted-foreground">(ex: BRL, USD, SATS)</span>
            </Label>
            <Input
              id="code"
              {...register('code')}
              placeholder="BRL"
              className="font-mono uppercase"
              disabled={mode === 'edit'}
            />
            {errors.code && (
              <p className="text-sm text-red-600">{errors.code.message}</p>
            )}
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Real Brasileiro"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Tipo de Ícone */}
          <div className="space-y-2">
            <Label htmlFor="iconType">Tipo de Ícone *</Label>
            <Select
              value={iconType}
              onValueChange={(value) => setValue('iconType', value as 'TEXT' | 'SVG')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TEXT">Texto (símbolo)</SelectItem>
                <SelectItem value="SVG">SVG (ícone customizado)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Símbolo (se TEXT) */}
          {iconType === 'TEXT' && (
            <div className="space-y-2">
              <Label htmlFor="symbol">Símbolo *</Label>
              <Input
                id="symbol"
                {...register('symbol')}
                placeholder="R$"
                maxLength={10}
              />
              {errors.symbol && (
                <p className="text-sm text-red-600">{errors.symbol.message}</p>
              )}
            </div>
          )}

          {/* SVG Path (se SVG) */}
          {iconType === 'SVG' && (
            <div className="space-y-2">
              <Label htmlFor="iconSvgPath">SVG Icon *</Label>
              <SvgUploader
                value={watch('iconSvgPath') || ''}
                onChange={(path) => setValue('iconSvgPath', path)}
              />
              {errors.iconSvgPath && (
                <p className="text-sm text-red-600">{errors.iconSvgPath.message}</p>
              )}
            </div>
          )}

          {/* Decimais */}
          <div className="space-y-2">
            <Label htmlFor="decimals">
              Casas Decimais *{' '}
              <span className="text-xs text-muted-foreground">(0-8)</span>
            </Label>
            <Input
              id="decimals"
              type="number"
              {...register('decimals', { valueAsNumber: true })}
              min={0}
              max={8}
            />
            {errors.decimals && (
              <p className="text-sm text-red-600">{errors.decimals.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {isCrypto
                ? 'Criptomoedas podem ter até 8 decimais'
                : 'Moedas fiat devem ter no máximo 2 decimais'}
            </p>
          </div>

          {/* Ordem */}
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Ordem de Exibição</Label>
            <Input
              id="sortOrder"
              type="number"
              {...register('sortOrder', { valueAsNumber: true })}
              min={0}
            />
            {errors.sortOrder && (
              <p className="text-sm text-red-600">{errors.sortOrder.message}</p>
            )}
          </div>
        </div>

        {/* Configurações */}
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Configurações</h2>

          {/* É Criptomoeda */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Criptomoeda</Label>
              <p className="text-sm text-muted-foreground">
                Marque se for uma criptomoeda (BTC, ETH, etc)
              </p>
            </div>
            <Switch
              checked={watch('isCrypto')}
              onChange={(e) => setValue('isCrypto', e.target.checked)}
            />
          </div>

          {/* Está Ativa */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Ativa</Label>
              <p className="text-sm text-muted-foreground">
                Moedas inativas não aparecem para usuários
              </p>
            </div>
            <Switch
              checked={watch('isActive')}
              onChange={(e) => setValue('isActive', e.target.checked)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </div>
  );
}
