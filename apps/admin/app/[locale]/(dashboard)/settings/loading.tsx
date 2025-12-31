/**
 * Settings Loading State
 * Skeleton loader for settings page
 */

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="mt-2 h-4 w-96 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-6">
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
