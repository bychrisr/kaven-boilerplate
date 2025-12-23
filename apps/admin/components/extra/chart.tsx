import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartProps {
  /**
   * Chart type
   */
  type?: 'bar' | 'line' | 'pie';
  /**
   * Data
   */
  data: ChartDataPoint[];
  /**
   * Height
   */
  height?: number;
  /**
   * Show legend
   */
  showLegend?: boolean;
}

export const Chart: React.FC<ChartProps> = ({
  type = 'bar',
  data,
  height = 300,
  showLegend = true,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const colors = ['#1976d2', '#9c27b0', '#4caf50', '#ff9800', '#f44336', '#00bcd4'];

  const renderBar = () => (
    <div className="flex items-end justify-around h-full gap-2 px-4">
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * 100;
        const color = item.color || colors[index % colors.length];

        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="relative w-full flex items-end justify-center"
              style={{ height: '100%' }}
            >
              <div
                className="w-full rounded-t transition-all hover:opacity-80"
                style={{
                  height: `${barHeight}%`,
                  backgroundColor: color,
                  minHeight: '4px',
                }}
                title={`${item.label}: ${item.value}`}
              />
            </div>
            <div className="text-xs text-center text-text-secondary truncate w-full">
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderLine = () => {
    const points = data
      .map((item, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - (item.value / maxValue) * 100;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={colors[0]}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - (item.value / maxValue) * 100;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={colors[0]}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
    );
  };

  const renderPie = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {data.map((item, index) => {
          const percentage = item.value / total;
          const angle = percentage * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;

          const x1 = 50 + 40 * Math.cos(((startAngle - 90) * Math.PI) / 180);
          const y1 = 50 + 40 * Math.sin(((startAngle - 90) * Math.PI) / 180);
          const x2 = 50 + 40 * Math.cos(((endAngle - 90) * Math.PI) / 180);
          const y2 = 50 + 40 * Math.sin(((endAngle - 90) * Math.PI) / 180);

          const largeArc = angle > 180 ? 1 : 0;
          const color = item.color || colors[index % colors.length];

          currentAngle += angle;

          return (
            <path
              key={index}
              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={color}
              className="hover:opacity-80 transition-opacity"
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      <div style={{ height: `${height}px` }}>
        {type === 'bar' && renderBar()}
        {type === 'line' && renderLine()}
        {type === 'pie' && renderPie()}
      </div>

      {showLegend && (
        <div className="flex flex-wrap gap-4 justify-center">
          {data.map((item, index) => {
            const color = item.color || colors[index % colors.length];
            return (
              <div key={index} className="flex items-center gap-2">
                <div className="size-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-sm text-text-secondary">
                  {item.label}: {item.value}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

Chart.displayName = 'Chart';
