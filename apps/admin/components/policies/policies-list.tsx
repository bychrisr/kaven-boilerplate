'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { 
  Shield, 
  Clock, 
  Globe, 
  MoreVertical, 
  Pencil, 
  Trash2,
  AlertTriangle,
  Monitor
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Policy, useDeletePolicy } from '@/hooks/use-policies';
import { useLocale } from 'next-intl';

interface PoliciesListProps {
  policies: Policy[];
  onEdit: (policyId: string) => void;
}

export function PoliciesList({ policies, onEdit }: PoliciesListProps) {
  const t = useTranslations('Policies');
  const locale = useLocale();
  const dateLocale = locale === 'pt' ? ptBR : enUS;

  const [policyToDelete, setPolicyToDelete] = useState<string | null>(null);
  const deletePolicy = useDeletePolicy();

  const handleDelete = async () => {
    if (policyToDelete) {
      await deletePolicy.mutateAsync(policyToDelete);
      setPolicyToDelete(null);
    }
  };

  const getPolicyIcon = (type: string) => {
    switch (type) {
      case 'IP_WHITELIST':
        return <Globe className="h-4 w-4" />;
      case 'TIME_BASED':
        return <Clock className="h-4 w-4" />;
      case 'DEVICE_TRUST':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getEnforcementColor = (enforcement: string) => {
    switch (enforcement) {
      case 'DENY':
        return 'destructive';
      case 'ALLOW':
        return 'success';
      case 'WARN':
        return 'warning';
      case 'REQUIRE_MFA':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="relative mx-0 rounded-none border-none text-card-foreground shadow-none bg-transparent overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="border-b border-dashed border-border/50 hover:bg-transparent">
            <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">
              {t('list.name')}
            </TableHead>
            <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">
              {t('list.type')}
            </TableHead>
            <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">
              {t('list.target')}
            </TableHead>
            <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">
              {t('list.enforcement')}
            </TableHead>
            <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">
              {t('list.status')}
            </TableHead>
            <TableHead className="px-4 h-16 font-semibold bg-transparent text-foreground dark:text-white">
              {t('list.createdAt')}
            </TableHead>
            <TableHead className="px-4 h-16 font-semibold bg-transparent text-right last:rounded-tr-none" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <p className="text-muted-foreground font-medium">{t('list.empty')}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            policies.map((policy) => (
              <TableRow key={policy.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                <TableCell className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{policy.name}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{policy.description || '-'}</span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-muted/50 text-muted-foreground">
                      {getPolicyIcon(policy.type)}
                    </div>
                    <span className="text-sm">{t(`types.${policy.type}`)}</span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{t(`targets.${policy.targetType}`)}</span>
                    {policy.targetId && (
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">{policy.targetId.substring(0, 8)}...</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4">
                  <Badge variant={getEnforcementColor(policy.enforcement) as "destructive" | "success" | "warning" | "secondary" | "outline"}>
                    {t(`enforcements.${policy.enforcement}`)}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-4">
                  <Badge variant={policy.isActive ? 'success' : 'outline'}>
                    {policy.isActive ? t('list.active') : t('list.inactive')}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                  {format(new Date(policy.createdAt), 'PP', { locale: dateLocale })}
                </TableCell>
                <TableCell className="px-4 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => onEdit(policy.id)} className="gap-2">
                        <Pencil className="h-4 w-4" />
                        {t('list.actions.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setPolicyToDelete(policy.id)}
                        className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        {t('list.actions.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!policyToDelete} onOpenChange={(open) => !open && setPolicyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {t('list.deleteConfirm.title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('list.deleteConfirm.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('list.deleteConfirm.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('list.deleteConfirm.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
