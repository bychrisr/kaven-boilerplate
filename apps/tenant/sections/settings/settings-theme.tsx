/**
 * Settings Theme Tab
 * Theme customization settings
 */

'use client';

import { ThemeCustomizer } from '@/components/settings/theme-customizer';

export function SettingsTheme() {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Personalização de Tema</h2>
      <p className="text-sm text-gray-600 mb-6">Personalize as cores e aparência do sistema</p>

      <ThemeCustomizer />
    </div>
  );
}
