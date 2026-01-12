'use client';

import { Alert } from '@/components/ui/alert';

export default function AlertShowcase() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Alert Component</h2>
        <p className="text-gray-600 mb-6">
          Alerts display brief messages for the user without interrupting their use of the app.
        </p>
      </div>

      {/* Severities */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Severities</h3>
        <div className="space-y-4">
          <Alert severity="success" title="Success">
            This is a success alert — check it out!
          </Alert>

          <Alert severity="info" title="Info">
            This is an info alert — check it out!
          </Alert>

          <Alert severity="warning" title="Warning">
            This is a warning alert — check it out!
          </Alert>

          <Alert severity="error" title="Error">
            This is an error alert — check it out!
          </Alert>
        </div>
      </div>

      {/* Without Title */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Without Title</h3>
        <div className="space-y-4">
          <Alert severity="success">
            Your changes have been saved successfully.
          </Alert>

          <Alert severity="info">
            New updates are available. Please refresh the page.
          </Alert>

          <Alert severity="warning">
            Your session will expire in 5 minutes.
          </Alert>

          <Alert severity="error">
            An error occurred while processing your request.
          </Alert>
        </div>
      </div>

      {/* With Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">With Actions</h3>
        <div className="space-y-4">
          <Alert severity="success" title="Payment Successful">
            Your payment of $99.99 has been processed successfully.
            <div className="mt-3">
              <button className="text-sm font-medium text-success-dark hover:underline">
                View Receipt
              </button>
            </div>
          </Alert>

          <Alert severity="warning" title="Storage Almost Full">
            You are using 95% of your storage space. Consider upgrading your plan.
            <div className="mt-3 flex gap-2">
              <button className="text-sm font-medium text-warning-dark hover:underline">
                Upgrade Now
              </button>
              <button className="text-sm font-medium text-gray-600 hover:underline">
                Dismiss
              </button>
            </div>
          </Alert>
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Example</h3>
        <pre className="text-sm text-gray-800 overflow-x-auto">
          <code>{`import { Alert } from '@/components/ui/alert';

<Alert severity="success" title="Success">
  Your changes have been saved successfully.
</Alert>

<Alert severity="error" title="Error">
  An error occurred while processing your request.
</Alert>`}</code>
        </pre>
      </div>
    </div>
  );
}
