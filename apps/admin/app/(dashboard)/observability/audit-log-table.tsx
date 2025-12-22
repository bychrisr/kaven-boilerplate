'use client';

import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '@/lib/api/observability';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

export function AuditLogTable() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useQuery({
        queryKey: ['audit-logs', page],
        queryFn: () => observabilityApi.getAuditLogs({ page, limit: 10 }),
        refetchInterval: 3000, // Auto-refresh a cada 3s para mostrar novos logs
    });

    if (isLoading) return <div>Carregando logs...</div>;

    return (
        <div className="space-y-4">
             <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data/Hora</TableHead>
                            <TableHead>Ação</TableHead>
                            <TableHead>Ator</TableHead>
                            <TableHead>Entidade</TableHead>
                            <TableHead>Detalhes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.logs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>{format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{log.action}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{log.user?.name || log.userId}</span>
                                        <span className="text-xs text-muted-foreground">{log.user?.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {log.entity} <span className="text-xs text-muted-foreground">({log.entityId.slice(0, 8)}...)</span>
                                </TableCell>
                                <TableCell>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Detalhes do Log</DialogTitle>
                                                <DialogDescription>ID: {log.id}</DialogDescription>
                                            </DialogHeader>
                                            <div className="mt-4">
                                                <pre className="bg-slate-100 p-4 rounded-lg overflow-auto text-xs">
                                                    {JSON.stringify(log.metadata, null, 2)}
                                                </pre>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                        {data?.logs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-4">Nenhum log encontrado</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
             </div>
             <div className="flex justify-end space-x-2">
                 <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Anterior
                 </Button>
                 <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => p + 1)}
                    disabled={!data || page >= (data.pagination.totalPages || 1)}
                >
                    Próxima
                 </Button>
             </div>
        </div>
    );
}
