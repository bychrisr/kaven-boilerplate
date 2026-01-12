/**
 * Settings Security Tab
 * Security and password settings
 */

'use client';

import { useTranslations } from 'next-intl';

export function SettingsSecurity() {
  const t = useTranslations('Settings');

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">{t('security.title')}</h2>

      <div className="space-y-6">
        {/* Change Password */}
        <div>
          <h3 className="text-lg font-medium mb-4">{t('security.changePassword')}</h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="current-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t('security.currentPassword')}
              </label>
              <input
                id="current-password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t('security.newPassword')}
              </label>
              <input
                id="new-password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t('security.confirmPassword')}
              </label>
              <input
                id="confirm-password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="pt-6 border-t">
          <h3 className="text-lg font-medium mb-2">{t('security.2fa')}</h3>
          <p className="text-sm text-gray-600 mb-4">
            {t('security.2faDescription')}
          </p>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            {t('security.enable2fa')}
          </button>
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
