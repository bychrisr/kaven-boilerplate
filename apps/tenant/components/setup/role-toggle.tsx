import { ReactNode } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RoleToggleProps {
  icon: ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  badge?: string;
}

/**
 * Componente RoleToggle
 * Toggle para seleção de personas do Admin Tenant
 */
export function RoleToggle({
  icon,
  title,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  badge
}: RoleToggleProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 rounded-lg border-2 transition-colors',
        'bg-card border-border',
        checked && !disabled && 'bg-accent/10 border-primary/40',
        disabled && 'opacity-60 cursor-not-allowed'
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Icon */}
        <div
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-lg transition-colors',
            checked && !disabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}
        >
          {icon}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Label
              htmlFor={`role-${title}`}
              className={cn(
                'text-sm font-medium cursor-pointer text-foreground',
                disabled && 'cursor-not-allowed'
              )}
            >
              {title}
            </Label>
            {badge && (
              <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                {badge}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {description}
          </p>
        </div>
      </div>
      
      {/* Switch */}
      <Switch
        id={`role-${title}`}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        disabled={disabled}
      />
    </div>
  );
}
