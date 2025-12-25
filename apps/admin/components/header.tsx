'use client';

import { Search, Bell, Settings, Menu, Command } from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { useSettings } from '@/stores/settings.store';
import { TenantSwitcher } from '@/components/layout/tenant-switcher';
import { UserMenu } from '@/components/layout/user-menu';
import { cn } from '@/lib/utils';

export function Header() {
  const { toggleSidebar } = useUIStore();
  const { theme } = useSettings();

  return (
    <header 
        className={cn(
            "sticky top-0 z-30 flex h-[72px] items-center justify-between px-4 md:px-6 transition-colors duration-300",
            // Glassmorphism effect with semantic tokens
            "backdrop-blur-xl bg-background/80 border-b border-border text-foreground"
        )}
    >
      <div className="flex items-center gap-4">
        {/* Stylized Hamburger */}
        <button onClick={toggleSidebar} className="lg:hidden p-1 hover:bg-accent rounded-full text-muted-foreground hover:text-foreground transition-colors">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 7H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M5 17H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
             </svg>
        </button>
        
        {/* Tenant Switcher */}
        <TenantSwitcher />
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search */}
        <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline-flex text-xs font-bold border border-border rounded px-1.5 py-0.5 items-center gap-1 text-muted-foreground">
                <Command className="w-3 h-3" /> K
            </span>
        </button>

        {/* Language (Mock - UK Flag) */}
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors">
            <img 
                src="https://flagcdn.com/w40/gb.png" 
                alt="English" 
                width={20} 
                height={15} 
                className="rounded-sm object-cover"
            />
        </button>

        {/* Notifications */}
        <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors group">
            <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full ring-2 ring-background" />
        </button>

        {/* Settings (Drawer Trigger) */}
        <button 
            onClick={() => window.dispatchEvent(new Event('open-settings-drawer'))}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors animate-spin-slow group"
        >
            <Settings className={cn(
                "w-5 h-5 text-muted-foreground transition-transform group-hover:rotate-90 group-hover:text-foreground",
                theme === 'dark' ? "text-primary" : ""
            )} />
        </button>

        {/* User Profile */}
        <UserMenu />
      </div>
    </header>
  );
}
