'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Loader2, Save, Bell, Mail } from 'lucide-react';

export default function NotificationsSettingsPage() {
  const t = useTranslations('Settings.notifications');
  const tActions = useTranslations('Settings.actions');
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    emailRegisters: true,
    emailOrders: true,
    emailInvoices: true,
    emailSystem: false,
    pushDesktop: true,
    pushSound: false,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulating API call since we don't have a specific endpoint yet
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success(tActions('save') || 'Preferences saved!');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('title')}</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
        <div className="space-y-8">
          {/* Email Notifications */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-gray-500" />
              {t('email')}
            </h3>
            <div className="space-y-3">
              <ToggleOption
                label={t('newUsers')}
                description={t('newUsersDesc')}
                checked={preferences.emailRegisters}
                onChange={() => handleToggle('emailRegisters')}
              />
              <ToggleOption
                label={t('newOrders')}
                description={t('newOrdersDesc')}
                checked={preferences.emailOrders}
                onChange={() => handleToggle('emailOrders')}
              />
              <ToggleOption
                label="Invoice Payments" 
                description="Get notified when an invoice is paid."
                checked={preferences.emailInvoices}
                onChange={() => handleToggle('emailInvoices')}
              />
              <ToggleOption
                label={t('systemUpdates')}
                description={t('systemUpdatesDesc')}
                checked={preferences.emailSystem}
                onChange={() => handleToggle('emailSystem')}
              />
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Push Notifications */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-gray-500" />
              {t('push')}
            </h3>
            <div className="space-y-3">
              <ToggleOption
                label={t('realTime')}
                description={t('realTimeDesc')}
                checked={preferences.pushDesktop}
                onChange={() => handleToggle('pushDesktop')}
              />
              <ToggleOption
                label="Sound Alerts"
                description="Play a sound when a critical notification arrives."
                checked={preferences.pushSound}
                onChange={() => handleToggle('pushSound')}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 bg-primary-main text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? 'Saving...' : tActions('save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleOption({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
      <div className="relative flex items-center mt-1">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <div className="h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-main peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-main/20"></div>
      </div>
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </label>
  );
}
