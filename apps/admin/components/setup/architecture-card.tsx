import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ArchitectureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  selected: boolean;
  onClick: () => void;
  children?: ReactNode;
}

/**
 * Componente ArchitectureCard
 * Card selecionável para escolha de arquitetura (Single vs Multi-tenant)
 */
export function ArchitectureCard({
  title,
  description,
  icon,
  selected,
  onClick,
  children
}: ArchitectureCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-lg',
        selected && 'border-primary ring-2 ring-primary ring-offset-2'
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex items-center justify-center w-12 h-12 rounded-lg transition-colors',
              selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}
          >
            {icon}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      {children && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
}
