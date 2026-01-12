'use client';

import { useFeatures, useDeleteFeature } from '@/hooks/use-features';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function FeaturesPage() {
  const { data: features, isLoading } = useFeatures();
  const deleteFeature = useDeleteFeature();

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteFeature.mutateAsync(id);
      toast.success(`Feature "${name}" excluída com sucesso`);
    } catch (error) {
      toast.error('Erro ao excluir feature');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Carregando features...</div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Features</h1>
          <p className="text-muted-foreground mt-2">Gerencie as funcionalidades do sistema</p>
        </div>
        <Link href="/features/new">
          <Button><Plus className="mr-2 h-4 w-4" />Nova Feature</Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features?.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">Nenhuma feature cadastrada.</TableCell></TableRow>
            ) : (
              features?.map((feature) => (
                <TableRow key={feature.id}>
                  <TableCell className="font-medium">{feature.name}</TableCell>
                  <TableCell><code className="text-xs bg-muted px-2 py-1 rounded">{feature.code}</code></TableCell>
                  <TableCell><Badge variant="outline">{feature.type}</Badge></TableCell>
                  <TableCell>{feature.unit || '-'}</TableCell>
                  <TableCell>{feature.category || '-'}</TableCell>
                  <TableCell><Badge variant={feature.isActive ? 'default' : 'secondary'}>{feature.isActive ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>Tem certeza que deseja excluir a feature "{feature.name}"?</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(feature.id, feature.name)}>Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
