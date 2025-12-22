import { Card, Typography } from '@/components';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function DashboardPage() {
  // Mock data - replace with real data from API
  const kpiData = [
    {
      label: 'Total Users',
      value: '1,234',
      change: '+12.5%',
      trend: 'up' as const,
    },
    {
      label: 'Active Users',
      value: '892',
      change: '+8.2%',
      trend: 'up' as const,
    },
    {
      label: 'Revenue',
      value: '$45,231',
      change: '+23.1%',
      trend: 'up' as const,
    },
    {
      label: 'Growth',
      value: '18.2%',
      change: '-2.4%',
      trend: 'down' as const,
    },
  ];

  return (
    <div>
      <Typography variant="h3" className="mb-6">
        Dashboard
      </Typography>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {kpiData.map((kpi) => (
          <Card key={kpi.label}>
            <div className="p-6">
              <Typography variant="body2" color="secondary" className="mb-1">
                {kpi.label}
              </Typography>
              <Typography variant="h4" className="mb-2">
                {kpi.value}
              </Typography>
              <div className="flex items-center gap-1">
                {kpi.trend === 'up' ? (
                  <TrendingUp className="size-4 text-success-main" />
                ) : (
                  <TrendingDown className="size-4 text-error-main" />
                )}
                <Typography
                  variant="body2"
                  className={kpi.trend === 'up' ? 'text-success-main' : 'text-error-main'}
                >
                  {kpi.change} from last month
                </Typography>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <Card>
        <div className="p-6">
          <Typography variant="h5" className="mb-4">User Growth (30 days)</Typography>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <Typography variant="body2" color="secondary">
              Chart will be implemented with Recharts
            </Typography>
          </div>
        </div>
      </Card>
    </div>
  );
}
