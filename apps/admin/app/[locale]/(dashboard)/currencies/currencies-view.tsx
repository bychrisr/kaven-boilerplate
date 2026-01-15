'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CurrencyIcon } from '@/components/ui/currency-icon';
import type { Currency } from '@/hooks/use-currency';
import { toast } from 'sonner';

export default function CurrenciesView() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Buscar todas as currencies (incluindo inativas para admin)
  const { data: currencies = [], isLoading } = useQuery<Currency[]>({
    queryKey: ['currencies', 'all'],
    queryFn: async () => {
      const response = await fetch('/api/currencies?includeInactive=true');
      if (!response.ok) throw new Error('Failed to fetch currencies');
      return response.json();
    },
  });

  // Mutation para deletar currency
  const deleteMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await fetch(`/api/currencies/${code}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete currency');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] });
      toast.success('Moeda desativada com sucesso');
      setDeletingId(null);
    },
    onError: () => {
      toast.error('Erro ao desativar moeda');
      setDeletingId(null);
    },
  });

  const handleDelete = (code: string) => {
    if (confirm('Tem certeza que deseja desativar esta moeda?')) {
      setDeletingId(code);
      deleteMutation.mutate(code);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Moedas</h1>
          <p className="text-muted-foreground">
            Gerencie as moedas disponíveis na plataforma
          </p>
        </div>
        <Button onClick={() => router.push('/currencies/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Moeda
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Símbolo/Ícone</TableHead>
              <TableHead>Decimais</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currencies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Nenhuma moeda encontrada
                </TableCell>
              </TableRow>
            ) : (
              currencies.map((currency) => (
                <TableRow key={currency.code}>
                  <TableCell className="font-mono font-semibold">
                    {currency.code}
                  </TableCell>
                  <TableCell>{currency.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {currency.iconType === 'TEXT' ? (
                        <span className="text-lg">{currency.symbol}</span>
                      ) : (
                        <CurrencyIcon currency={currency} size={20} />
                      )}
                      <span className="text-xs text-muted-foreground">
                        ({currency.iconType})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{currency.decimals}</TableCell>
                  <TableCell>
                    <Badge variant={currency.isCrypto ? 'default' : 'secondary'}>
                      {currency.isCrypto ? 'Crypto' : 'Fiat'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {currency.isActive ? (
                      <Badge variant="outline" className="gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Ativa
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <XCircle className="h-3 w-3 text-red-600" />
                        Inativa
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/currencies/${currency.code}/edit`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(currency.code)}
                        disabled={deletingId === currency.code || !currency.isActive}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
