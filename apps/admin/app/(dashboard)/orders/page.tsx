export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Orders</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search orders..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((i) => {
              const statuses = ['delivered', 'shipped', 'processing', 'pending'];
              const status = statuses[i % 4];
              const statusColors: Record<string, string> = {
                delivered: 'bg-success-light text-success-dark',
                shipped: 'bg-secondary-light text-secondary-dark',
                processing: 'bg-warning-light text-warning-dark',
                pending: 'bg-gray-200 text-gray-700'
              };

              return (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ORD-{String(i).padStart(5, '0')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Customer {i}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {i + 2} items
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${(i * 250).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status]}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    2025-01-{20 + i}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button className="text-primary-main hover:text-primary-dark">View</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
