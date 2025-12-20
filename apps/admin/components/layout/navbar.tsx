'use client';

import { Menu, Search, Bell, User } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {/* Hamburger Menu */}
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>

        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="h-6 w-6 text-gray-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-error-main rounded-full" />
        </button>

        {/* User Menu */}
        <button className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <div className="h-8 w-8 bg-primary-main rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@kaven.com</p>
          </div>
        </button>
      </div>
    </header>
  );
}
