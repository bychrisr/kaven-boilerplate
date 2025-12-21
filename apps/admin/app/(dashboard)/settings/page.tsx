'use client';

import { useState } from 'react';
import { User, Bell, Lock, Settings } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-light text-primary-dark'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {tabs.find((t) => t.id === activeTab)?.label} Settings
            </h2>

            {activeTab === 'general' && (
              <div className="space-y-4">
                {/* Site Name */}
                <div>
                  <label htmlFor="site-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Site Name
                  </label>
                  <input
                    id="site-name"
                    type="text"
                    defaultValue="Kaven Boilerplate"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main"
                  />
                </div>

                {/* Site URL */}
                <div>
                  <label htmlFor="site-url" className="block text-sm font-medium text-gray-700 mb-1">
                    Site URL
                  </label>
                  <input
                    id="site-url"
                    type="url"
                    defaultValue="https://kaven.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main"
                  />
                </div>

                {/* Theme */}
                <div>
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                    Theme
                  </label>
                  <select id="theme" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                  <button className="bg-primary-main text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="text-center py-10 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Profile settings content would go here.</p>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="text-center py-10 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Notification settings content would go here.</p>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="text-center py-10 text-gray-500">
                <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Security settings content would go here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
