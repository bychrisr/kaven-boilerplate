import * as React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar } from 'recharts';

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: number;
  trendLabel?: string;
  color?: 'primary' | 'blue' | 'yellow' | 'green' | 'red';
  chartData?: Array<{ v: number }>;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend = 0,
  trendLabel = 'últimos 7 dias',
  color = 'primary',
  chartData,
  loading = false,
  className,
  ...props
}: StatCardProps) {
  const colorStyles = {
    primary: { icon: 'text-primary', bg: 'bg-primary/10', fill: 'hsl(var(--primary))' },
    blue: { icon: 'text-blue-500', bg: 'bg-blue-500/10', fill: '#3B82F6' },
    yellow: { icon: 'text-yellow-500', bg: 'bg-yellow-500/10', fill: '#EAB308' },
    green: { icon: 'text-green-500', bg: 'bg-green-500/10', fill: '#22C55E' },
    red: { icon: 'text-destructive', bg: 'bg-destructive/10', fill: '#EF4444' },
  };

  const currentStyle = colorStyles[color];

  if (loading) {
    return (
      <div className={cn("rounded-2xl bg-card p-6 shadow-xl border border-border/50 animate-pulse", className)} {...props}>
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-full bg-muted" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
        <div className="h-8 w-24 bg-muted rounded mb-2" />
        <div className="h-4 w-40 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-card p-6 shadow-xl border border-border/50", className)} {...props}>
      <div className="flex items-center gap-4 mb-4">
        {Icon && (
          <div className={cn("p-3 rounded-full", currentStyle.bg)}>
            <Icon className={cn("h-6 w-6", currentStyle.icon)} />
          </div>
        )}
        <span className="text-sm font-bold text-foreground uppercase tracking-wider">
          {title}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-3xl font-bold text-foreground mb-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <span
              className={cn(
                "flex items-center font-semibold px-1.5 py-0.5 rounded",
                trend >= 0 ? "text-green-500 bg-green-500/10" : "text-destructive bg-destructive/10"
              )}
            >
              {trend >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {trend > 0 ? '+' : ''}{trend}%
            </span>
            <span className="text-muted-foreground">{trendLabel}</span>
          </div>
        </div>

        {chartData && (
          <div className="h-12 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <Bar dataKey="v" fill={currentStyle.fill} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
