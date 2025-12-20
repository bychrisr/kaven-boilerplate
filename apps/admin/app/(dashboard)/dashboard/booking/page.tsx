export default function BookingDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Booking Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
          <p className="text-3xl font-bold text-gray-900">342</p>
          <p className="text-sm text-success-main mt-2">+15.3% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-3xl font-bold text-gray-900">28</p>
          <p className="text-sm text-warning-main mt-2">Requires attention</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Confirmed</p>
          <p className="text-3xl font-bold text-gray-900">298</p>
          <p className="text-sm text-success-main mt-2">87% of total</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Cancelled</p>
          <p className="text-3xl font-bold text-gray-900">16</p>
          <p className="text-sm text-error-main mt-2">4.7% cancellation rate</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Booking #{String(i).padStart(4, '0')}</p>
                <p className="text-sm text-gray-600">Customer {i} • 2025-02-{10 + i}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                i % 3 === 0 ? 'bg-success-light text-success-dark' :
                i % 3 === 1 ? 'bg-warning-light text-warning-dark' :
                'bg-secondary-light text-secondary-dark'
              }`}>
                {i % 3 === 0 ? 'Confirmed' : i % 3 === 1 ? 'Pending' : 'Completed'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
