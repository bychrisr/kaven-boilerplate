import * as React from 'react';
import { Tooltip } from './tooltip';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoTooltipProps {
  content: string;
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, className }) => {
  return (
    <Tooltip content={content} position="top">
      <button
        type="button"
        className="inline-flex items-center justify-center p-0 border-0 bg-transparent hover:bg-transparent focus:outline-none cursor-help"
        aria-label="Informação"
      >
        <Info className={cn('h-4 w-4 text-muted-foreground hover:text-foreground transition-colors', className)} />
      </button>
    </Tooltip>
  );
};

InfoTooltip.displayName = 'InfoTooltip';
