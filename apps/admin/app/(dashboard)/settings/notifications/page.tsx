export default function NotificationsSettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Notification Settings</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
        <div className="space-y-6">
          {/* Email Notifications */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Email Notifications</h3>
            <div className="space-y-3">
              {[
                { label: 'New user registration', description: 'Get notified when a new user signs up' },
                { label: 'Order updates', description: 'Receive updates about order status changes' },
                { label: 'Invoice payments', description: 'Get notified when invoices are paid' },
                { label: 'System alerts', description: 'Important system notifications and alerts' }
              ].map((item, i) => (
                <label key={i} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={i < 2}
                    className="mt-1 h-4 w-4 text-primary-main border-gray-300 rounded focus:ring-primary-main"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Push Notifications</h3>
            <div className="space-y-3">
              {[
                { label: 'Desktop notifications', description: 'Show desktop notifications for important events' },
                { label: 'Sound alerts', description: 'Play sound for critical notifications' }
              ].map((item, i) => (
                <label key={i} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={i === 0}
                    className="mt-1 h-4 w-4 text-primary-main border-gray-300 rounded focus:ring-primary-main"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t border-gray-200">
            <button className="bg-primary-main text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
