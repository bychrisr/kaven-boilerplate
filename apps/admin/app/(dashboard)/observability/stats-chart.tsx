'use client';

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { LucideIcon } from 'lucide-react';

interface StatsChartProps {
  title: string;
  data: { time: string; value: number }[];
  value: string | number;
  icon: LucideIcon;
  color?: string;
  loading?: boolean;
}

export function StatsChart({
  title,
  data,
  value,
  icon: Icon,
  color = '#3B82F6',
  loading,
}: Readonly<StatsChartProps>) {
  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="rounded-full bg-blue-50 p-3">
            <Icon className="h-6 w-6 text-blue-400" />
          </div>
        </div>
        <div className="mt-4 h-20 animate-pulse rounded bg-gray-50" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className="rounded-full bg-blue-50 p-3">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="mt-4 h-20">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
                      <span className="text-sm font-semibold text-gray-900">
                        {payload[0].value}
                      </span>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill="transparent"
              strokeWidth={2.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
