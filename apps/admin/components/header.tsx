'use client';

import { Search, Bell, Settings, Menu, ChevronDown, Command } from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { useSettings } from '@/stores/settings.store';
import { cn } from '@/lib/utils';

export function Header() {
  const { toggleSidebar } = useUIStore();
  const { theme } = useSettings();

  return (
    <header 
        className={cn(
            "sticky top-0 z-30 flex h-[72px] items-center justify-between px-6 transition-colors duration-300",
            // Glassmorphism effect
            "backdrop-blur-xl bg-opacity-80",
            theme === 'dark' ? "bg-[#1C252E]/80 text-white" : "bg-white/80 text-gray-900 border-b border-gray-100"
        )}
    >
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden p-1 hover:bg-gray-100/10 rounded-full">
            <Menu className="h-6 w-6" />
        </button>
        
        {/* Team Switcher (Mock) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-main to-primary-dark flex items-center justify-center text-white text-xs font-bold">
                K
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-semibold leading-tight">Team 1</span>
                <span className="text-[10px] text-gray-400 font-medium">Free</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search */}
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline-flex text-xs font-bold border border-gray-600 rounded px-1.5 py-0.5 items-center gap-1 text-gray-500">
                <Command className="w-3 h-3" /> K
            </span>
        </button>

        {/* Language (Mock - UK Flag) */}
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors">
            <img 
                src="https://flagcdn.com/w40/gb.png" 
                alt="English" 
                width={20} 
                height={15} 
                className="rounded-sm object-cover"
            />
        </button>

        {/* Notifications */}
        <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#1C252E]" />
        </button>

        {/* Settings (Drawer Trigger) */}
        <button 
            onClick={() => window.dispatchEvent(new Event('open-settings-drawer'))}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors animate-spin-slow group"
        >
            <Settings className={cn(
                "w-5 h-5 text-gray-400 transition-transform group-hover:rotate-90",
                theme === 'dark' ? "text-primary-main" : ""
            )} />
        </button>

        {/* User Profile */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 p-[2px] cursor-pointer hover:scale-105 transition-transform">
             <div className="w-full h-full rounded-full bg-[#1C252E] flex items-center justify-center overflow-hidden border-2 border-[#1C252E]">
                 <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                    alt="User" 
                    width={36} 
                    height={36}
                />
             </div>
        </div>
      </div>
    </header>
  );
}
