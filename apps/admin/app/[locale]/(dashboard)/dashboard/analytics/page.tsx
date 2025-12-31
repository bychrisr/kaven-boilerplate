export default function AnalyticsDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Page Views</p>
          <p className="text-3xl font-bold text-gray-900">45,231</p>
          <p className="text-sm text-success-main mt-2">+18.2% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Unique Visitors</p>
          <p className="text-3xl font-bold text-gray-900">12,456</p>
          <p className="text-sm text-success-main mt-2">+12.5% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Bounce Rate</p>
          <p className="text-3xl font-bold text-gray-900">32.4%</p>
          <p className="text-sm text-error-main mt-2">+2.1% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Avg. Session</p>
          <p className="text-3xl font-bold text-gray-900">4m 23s</p>
          <p className="text-sm text-success-main mt-2">+8.7% from last month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Traffic Sources</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Donut Chart (Recharts)</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">User Growth</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Area Chart (Recharts)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
