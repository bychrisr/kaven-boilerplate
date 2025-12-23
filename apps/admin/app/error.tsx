'use client';

export default function ServerErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-error-main">500</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">Server Error</h2>
        <p className="text-gray-600 mb-8">
          Something went wrong on our end. Please try again later.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/dashboard"
            className="inline-block bg-primary-main text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Go to Dashboard
          </a>
          <button
            onClick={() => window.location.reload()}
            className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}
