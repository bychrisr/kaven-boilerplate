/**
 * Dashboard Widget Summary
 * KPI card component for dashboard
 */

'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

type DashboardWidgetSummaryProps = {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
};

const colorClasses = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    icon: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    icon: 'text-green-600',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    icon: 'text-purple-600',
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    icon: 'text-orange-600',
  },
};

export function DashboardWidgetSummary({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
}: DashboardWidgetSummaryProps) {
  const colors = colorClasses[color];
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`h-12 w-12 rounded-lg ${colors.bg} flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
        <div className={`flex items-center gap-1 ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendIcon className="h-4 w-4" />
          <span className="text-sm font-medium">{change}</span>
        </div>
      </div>
      
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
