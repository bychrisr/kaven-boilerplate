import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"

const statCardVariants = cva(
  "relative rounded-[1.5rem] p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground shadow-sm hover:shadow-md border border-border/50",
        outline: "bg-background/50 backdrop-blur-md border-2 border-primary dark:border-primary/80 shadow-none",
        ghost: "bg-transparent border-none shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

import { InfoTooltip } from './info-tooltip';
import { SpotlightCard } from './spotlight-card';

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: number;
  trendLabel?: string;
  subtitle?: string;
  menuAction?: React.ReactNode;
  chart?: React.ReactNode;
  iconClassName?: string;
  valueClassName?: string;
  tooltip?: string;
  spotlightColor?: string;
}

export function StatCard({
  className,
  variant,
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  menuAction,
  chart,
  iconClassName,
  valueClassName,
  tooltip,
  spotlightColor,
  ...props
}: StatCardProps) {
  const isPositiveTrend = trend !== undefined && trend >= 0;

  const content = (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={cn(
              "p-2.5 rounded-full flex items-center justify-center transition-colors",
              variant === 'outline' 
                ? "bg-primary/10 text-primary"
                : "bg-primary/10 text-primary",
              iconClassName
            )}>
              <Icon className="h-5 w-5" />
            </div>
          )}
          <span className="font-display font-bold text-base md:text-lg text-foreground/90 tracking-tight">
            {title}
          </span>
        </div>
        
        {tooltip ? (
          <div className="-mr-2 p-2">
            <InfoTooltip content={tooltip} />
          </div>
        ) : menuAction ? (
          menuAction
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground/60 hover:text-foreground transition-colors -mr-2 p-2 outline-none">
                 <MoreHorizontal className="h-6 w-6" />
                 <span className="sr-only">Open menu</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Download Report</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Remove Widget</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 mt-auto">
        <div className="flex items-center justify-between">
            <h3 className={cn("text-4xl font-extrabold font-mono tracking-tight text-foreground", valueClassName)}>
                {value}
            </h3>
            
            <div className="flex items-center gap-2">
                {trend !== undefined && (
                    <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold tracking-tight",
                        isPositiveTrend 
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-transparent dark:border-emerald-500/20" 
                            : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-500 border-transparent dark:border-red-500/20"
                    )}>
                        <span>{Math.abs(trend)}%</span>
                        {isPositiveTrend ? <ArrowUp className="h-3.5 w-3.5 stroke-[3]" /> : <ArrowDown className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                )}
                 {chart && (
                    <div className="h-10 w-24 ml-2">
                        {chart}
                    </div>
                )}
            </div>
        </div>

        {subtitle && (
          <p className="text-sm font-medium text-muted-foreground/90 font-body">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );

  if (variant === 'outline') {
    return (
      <SpotlightCard 
        className={cn("p-6 flex flex-col justify-between", className)} 
        spotlightColor={spotlightColor}
        {...props}
      >
        {content}
      </SpotlightCard>
    );
  }

  return (
    <div className={cn(statCardVariants({ variant }), className)} {...props}>
      {content}
    </div>
  );
}
