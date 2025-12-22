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
          <div className="rounded-full bg-gray-100 p-3">
            <Icon className="h-6 w-6 text-gray-400" />
          </div>
        </div>
        <div className="mt-4 h-20 animate-pulse rounded bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className="rounded-full bg-blue-100 p-3">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="mt-4 h-20">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-gray-500">
                            Valor
                          </span>
                          <span className="font-bold text-gray-900">
                            {payload[0].value}
                          </span>
                        </div>
                      </div>
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
              fill={`url(#gradient-${title})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
