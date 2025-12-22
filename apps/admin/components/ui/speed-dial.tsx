import * as React from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Fab } from './fab';

export interface SpeedDialProps {
  /**
   * Open state
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Direction
   * @default 'up'
   */
  direction?: 'up' | 'down' | 'left' | 'right';
  /**
   * Icon when closed
   */
  icon?: React.ReactNode;
  /**
   * Icon when open
   */
  openIcon?: React.ReactNode;
  /**
   * ARIA label
   */
  ariaLabel?: string;
  children: React.ReactNode;
}

export const SpeedDial: React.FC<SpeedDialProps> = ({
  open: controlledOpen,
  onOpenChange,
  direction = 'up',
  icon = <Plus className="size-6" />,
  openIcon = <X className="size-6" />,
  ariaLabel = 'SpeedDial',
  children,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = controlledOpen ?? internalOpen;

  const handleToggle = () => {
    const newOpen = !isOpen;
    setInternalOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const directionClasses = {
    up: 'flex-col-reverse bottom-20',
    down: 'flex-col top-20',
    left: 'flex-row-reverse right-20',
    right: 'flex-row left-20',
  };

  return (
    <div className="relative inline-flex">
      <Fab onClick={handleToggle} aria-label={ariaLabel} aria-expanded={isOpen}>
        {isOpen ? openIcon : icon}
      </Fab>

      {isOpen && (
        <div
          className={cn(
            'absolute flex gap-2',
            directionClasses[direction],
            'animate-in fade-in-0 zoom-in-95'
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

SpeedDial.displayName = 'SpeedDial';

export interface SpeedDialActionProps {
  /**
   * Icon
   */
  icon: React.ReactNode;
  /**
   * Tooltip text
   */
  tooltipTitle?: string;
  /**
   * Callback when clicked
   */
  onClick?: () => void;
}

export const SpeedDialAction: React.FC<SpeedDialActionProps> = ({ icon, tooltipTitle, onClick }) => {
  return (
    <div className="flex items-center gap-2">
      {tooltipTitle && (
        <span className="px-2 py-1 text-sm bg-gray-900 text-white rounded whitespace-nowrap">
          {tooltipTitle}
        </span>
      )}
      <Fab size="sm" onClick={onClick} color="secondary">
        {icon}
      </Fab>
    </div>
  );
};

SpeedDialAction.displayName = 'SpeedDialAction';
