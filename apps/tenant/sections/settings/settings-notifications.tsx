/**
 * Settings Notifications Tab
 * Notification preferences
 */

'use client';

import { useTranslations } from 'next-intl';

export function SettingsNotifications() {
  const t = useTranslations('Settings');

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">{t('notifications.title')}</h2>
      <p className="text-sm text-gray-600 mb-6">{t('notifications.description')}</p>

      <div className="space-y-6">
        {/* Email Notifications */}
        <div>
          <h3 className="text-lg font-medium mb-4">{t('notifications.email')}</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
              <div>
                <p className="font-medium text-sm">{t('notifications.newUsers')}</p>
                <p className="text-xs text-gray-500">
                  {t('notifications.newUsersDesc')}
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
              <div>
                <p className="font-medium text-sm">{t('notifications.newOrders')}</p>
                <p className="text-xs text-gray-500">
                  {t('notifications.newOrdersDesc')}
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
              <div>
                <p className="font-medium text-sm">{t('notifications.systemUpdates')}</p>
                <p className="text-xs text-gray-500">
                  {t('notifications.systemUpdatesDesc')}
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="pt-6 border-t">
          <h3 className="text-lg font-medium mb-4">{t('notifications.push')}</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
              <div>
                <p className="font-medium text-sm">{t('notifications.realTime')}</p>
                <p className="text-xs text-gray-500">
                  {t('notifications.realTimeDesc')}
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
              <div>
                <p className="font-medium text-sm">{t('notifications.reminders')}</p>
                <p className="text-xs text-gray-500">{t('notifications.remindersDesc')}</p>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {t('actions.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
