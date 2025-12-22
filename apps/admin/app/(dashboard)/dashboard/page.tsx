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
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {kpiData.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold mb-2">{kpi.value}</p>
            <div className="flex items-center gap-1">
              <span className={kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                {kpi.change} from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">User Growth (30 days)</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-sm text-gray-500">
            Chart will be implemented with Recharts
          </p>
        </div>
      </div>
    </div>
  );
}
