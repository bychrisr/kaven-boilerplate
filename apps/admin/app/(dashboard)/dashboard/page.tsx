export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* KPI Cards */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">1,234</p>
          <p className="text-sm text-success-main mt-2">+12.5% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Active Users</p>
          <p className="text-3xl font-bold text-gray-900">892</p>
          <p className="text-sm text-success-main mt-2">+8.2% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Revenue</p>
          <p className="text-3xl font-bold text-gray-900">$45,231</p>
          <p className="text-sm text-success-main mt-2">+23.1% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Growth</p>
          <p className="text-3xl font-bold text-gray-900">18.2%</p>
          <p className="text-sm text-error-main mt-2">-2.4% from last month</p>
        </div>
      </div>

      {/* Placeholder for charts */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">User Growth (30 days)</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">Chart will be implemented with Recharts</p>
        </div>
      </div>
    </div>
  );
}
