/**
 * Users Loading State
 * Skeleton loader for users page
 */

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="mt-2 h-4 w-64 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Toolbar Skeleton */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="flex gap-4">
          <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
          <div className="w-40 h-10 bg-gray-200 rounded animate-pulse" />
          <div className="w-40 h-10 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 space-y-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
