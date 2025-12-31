export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="h-24 w-24 bg-warning-main rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="h-12 w-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Under Maintenance</h1>
        <p className="text-gray-600 mb-6">
          We&apos;re currently performing scheduled maintenance. We&apos;ll be back soon!
        </p>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Estimated time:</p>
          <p className="text-2xl font-bold text-gray-900">2 hours</p>
        </div>
      </div>
    </div>
  );
}
