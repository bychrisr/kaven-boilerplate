/**
 * Settings General Tab
 * General application settings
 */

'use client';

import { useTranslations } from 'next-intl';

export function SettingsGeneral() {
  const t = useTranslations('Settings');

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">{t('general.title')}</h2>

      <div className="space-y-6">
        {/* App Name */}
        <div>
          <label htmlFor="app-name" className="block text-sm font-medium text-gray-700 mb-2">
            {t('general.appName')}
          </label>
          <input
            id="app-name"
            type="text"
            defaultValue="Kaven Admin"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Language */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
            {t('general.language')}
          </label>
          <select
            id="language"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="pt-BR"
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
            <option value="es-ES">Español</option>
          </select>
        </div>

        {/* Timezone */}
        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
            {t('general.timezone')}
          </label>
          <select
            id="timezone"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="America/Sao_Paulo"
          >
            <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
            <option value="America/New_York">New York (GMT-5)</option>
            <option value="Europe/London">London (GMT+0)</option>
          </select>
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
