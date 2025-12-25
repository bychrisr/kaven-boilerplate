import { ReactNode } from 'react';
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
    <div
      className={cn(
        'cursor-pointer transition-all rounded-lg border-2 p-6',
        'bg-card border-border hover:border-input',
        'hover:shadow-lg',
        selected && 'border-primary ring-2 ring-primary/20 bg-accent/10'
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-lg transition-colors',
            selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
}
