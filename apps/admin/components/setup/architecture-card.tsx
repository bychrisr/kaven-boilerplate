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
        'bg-[#161C24] border-gray-700 hover:border-gray-600',
        'hover:shadow-lg',
        selected && 'border-primary-main ring-2 ring-primary-main/20 bg-[#1a2332]'
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-lg transition-colors',
            selected ? 'bg-primary-main text-white' : 'bg-gray-800 text-gray-400'
          )}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
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
