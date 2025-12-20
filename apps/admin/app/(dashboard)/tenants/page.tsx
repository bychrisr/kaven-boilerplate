export default function TenantsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tenants</h1>
        <button className="bg-primary-main text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors">
          + Add Tenant
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <input
          type="text"
          placeholder="Search tenants..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Users</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">Tenant {i}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  tenant-{i}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {i * 10} users
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-success-light text-success-dark">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  2025-01-{10 + i}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button className="text-primary-main hover:text-primary-dark mr-3">Edit</button>
                  <button className="text-error-main hover:text-error-dark">Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
