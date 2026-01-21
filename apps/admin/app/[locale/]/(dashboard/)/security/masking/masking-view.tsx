'use client';

import { useTranslations } from 'next-intl';
import { 
  Shield, 
  EyeOff, 
  Lock,
  Loader2
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useMaskingConfig } from '@/hooks/use-masking-config';

export function MaskingView() {
  const t = useTranslations('Security.masking');
  const { data, isLoading, error } = useMaskingConfig();

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-destructive">
        {t('errorLoading')}
      </div>
    );
  }

  // Flatten the config for the table
  const rows = Object.entries(data.config).flatMap(([entity, fields]) => 
    Object.entries(fields).map(([field, rule]) => ({
      entity,
      field,
      type: rule.type,
      capability: rule.requiredCapability
    }))
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <EyeOff className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">{t('title')}</h1>
        </div>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">{t('table.entity')}</TableHead>
              <TableHead>{t('table.field')}</TableHead>
              <TableHead>{t('table.type')}</TableHead>
              <TableHead className="text-right">{t('table.capability')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={`${row.entity}-${row.field}`}>
                <TableCell className="font-medium">
                  <Badge variant="outline">{row.entity}</Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{row.field}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <Lock className="h-3 w-3 text-muted-foreground" />
                    {t(`types.${row.type}`)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className="font-mono">
                    <Shield className="mr-1 h-3 w-3" />
                    {row.capability}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-lg bg-muted/30 p-4 border border-blue-500/10">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-blue-500">Nota técnica:</strong> O mascaramento é aplicado diretamente no backend 
          utilizando o <code>MaskingService</code>. Usuários com o cargo de <code>SUPER_ADMIN</code> ou com as 
          capabilities listadas acima visualizam os dados originais.
        </p>
      </div>
    </div>
  );
}
