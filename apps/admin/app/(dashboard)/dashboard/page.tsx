import { Grid, Card, Typography, Chart, Badge } from '@/components';
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

  const chartData = [
    { label: 'Jan', value: 400 },
    { label: 'Feb', value: 300 },
    { label: 'Mar', value: 600 },
    { label: 'Apr', value: 800 },
    { label: 'May', value: 500 },
    { label: 'Jun', value: 900 },
  ];

  return (
    <div>
      <Typography variant="h3" className="mb-6">
        Dashboard
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={3} className="mb-6">
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card>
              <Card.Content>
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
              </Card.Content>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Chart Section */}
      <Card>
        <Card.Header>
          <Typography variant="h5">User Growth (30 days)</Typography>
        </Card.Header>
        <Card.Content>
          <Chart
            type="line"
            data={chartData}
            height={300}
            colors={['var(--primary-main)']}
          />
        </Card.Content>
      </Card>
    </div>
  );
}
