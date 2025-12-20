export default function UserCardsPage() {
  const users = [1, 2, 3, 4, 5, 6];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Users - Card View</h1>
        <button className="bg-primary-main text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors">
          + Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="h-16 w-16 bg-primary-main rounded-full flex items-center justify-center text-white text-xl font-bold">
                U{i}
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-gray-900">User {i}</h3>
                <p className="text-sm text-gray-600">user{i}@example.com</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Role:</span>
                <span className="px-2 py-0.5 bg-primary-light text-primary-dark rounded text-xs font-medium">
                  USER
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="px-2 py-0.5 bg-success-light text-success-dark rounded text-xs font-medium">
                  Active
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Joined:</span>
                <span className="text-gray-900">2025-01-{10 + i}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 text-sm text-primary-main border border-primary-main px-3 py-1.5 rounded hover:bg-primary-light transition-colors">
                View
              </button>
              <button className="flex-1 text-sm text-gray-700 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
