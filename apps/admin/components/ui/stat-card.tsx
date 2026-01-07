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
} from "@/components/ui/dropdown-menu"

const statCardVariants = cva(
  "relative overflow-hidden rounded-[1.5rem] p-6 transition-all duration-300 flex flex-col justify-between",
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
}

export function StatCard({
  className,
  variant,
  title,
  value,
  icon: Icon,
  trend,
  // trendLabel, // unused
  subtitle,
  menuAction,
  chart,
  iconClassName,
  valueClassName,
  ...props
}: StatCardProps) {
  const isPositiveTrend = trend !== undefined && trend >= 0;

  return (
    <div className={cn(statCardVariants({ variant }), className)} {...props}>
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
          <span className="font-semibold text-base md:text-lg text-foreground/90 tracking-tight">
            {title}
          </span>
        </div>
        
        {menuAction ? (
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
            <h3 className={cn("text-4xl font-bold font-display tracking-wide text-foreground", valueClassName)}>
                {value}
            </h3>
            
            <div className="flex items-center gap-2">
                {trend !== undefined && (
                    <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold tracking-tight",
                        isPositiveTrend 
                            ? "text-emerald-700 bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400" 
                            : "text-rose-700 bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400"
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
          <p className="text-sm font-medium tracking-wide text-muted-foreground/90">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
