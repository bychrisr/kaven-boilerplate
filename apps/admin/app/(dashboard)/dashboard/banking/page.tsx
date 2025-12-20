export default function BankingDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Banking Dashboard</h1>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">MRR</p>
          <p className="text-3xl font-bold text-gray-900">$12,450</p>
          <p className="text-sm text-success-main mt-2">+23.1% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">ARR</p>
          <p className="text-3xl font-bold text-gray-900">$149,400</p>
          <p className="text-sm text-success-main mt-2">+18.5% from last year</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Churn Rate</p>
          <p className="text-3xl font-bold text-gray-900">2.3%</p>
          <p className="text-sm text-success-main mt-2">-0.5% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">ARPU</p>
          <p className="text-3xl font-bold text-gray-900">$89</p>
          <p className="text-sm text-success-main mt-2">+5.2% from last month</p>
        </div>
      </div>

      {/* Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue by Plan</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Bar Chart (Recharts)</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Subscription Status</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Donut Chart (Recharts)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
