'use client';

import { useRouter, usePathname } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { Home, User, Settings, LogOut, CreditCard, Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import { useSettings } from '@/stores/settings.store';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

export function UserMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale(); // Get current locale correctly
  const t = useTranslations('Common.menu');
  const tSettings = useTranslations('Settings');
  
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useSettings();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  // Generate initials
  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  // Avatar URL
  const avatarUrl = user?.avatar 
    ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:8000${user.avatar}`)
    : undefined;

  const menuItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: t('profile'), icon: User, href: '/profile' },
    { label: t('settings'), icon: Settings, href: '/settings' },
    { label: 'Billing', icon: CreditCard, href: '/billing' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full outline-none transition-transform hover:scale-105 active:scale-95 focus:ring-2 focus:ring-primary/20">
            <Avatar className="w-10 h-10 ring-2 ring-primary ring-offset-2 ring-offset-background cursor-pointer">
                {avatarUrl ? (
                  <AvatarImage 
                      src={avatarUrl} 
                      alt={user?.name || 'User'} 
                  />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary font-medium">{initials}</AvatarFallback>
            </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        sideOffset={8}
        className="w-64 p-2 border-border bg-popover text-popover-foreground rounded-xl backdrop-blur-xl shadow-2xl"
      >
          {/* Compact Header */}
          <DropdownMenuLabel className="font-normal px-2 py-1.5">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-foreground">{user?.name || 'User Name'}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email || 'user@example.com'}</p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-1 bg-border/50" />

          {/* Menu Items */}
          <DropdownMenuGroup>
            {menuItems.map((item) => (
                <DropdownMenuItem
                    key={item.label}
                    onClick={() => router.push(item.href)}
                    className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm cursor-pointer outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors"
                >
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    <span>{item.label}</span>
                    {item.label === 'Billing' && (
                        <span className="ml-auto bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            2
                        </span>
                    )}
                </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1 bg-border/50" />

          {/* Theme & Language Controls */}
          <div className="p-1 space-y-2">
             
             {/* Language Segmented Control */}
             <div className="flex items-center p-1 bg-muted/50 rounded-lg border border-border/50">
                <button
                   onClick={() => handleLanguageChange('en')}
                   className={cn(
                     "flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                     locale === 'en' 
                       ? "bg-background text-foreground shadow-sm ring-1 ring-border" 
                       : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                   )}
                >
                  <span className="text-base">🇺🇸</span>
                  <span>English</span>
                </button>
                <button
                   onClick={() => handleLanguageChange('pt')}
                   className={cn(
                     "flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                     locale === 'pt' 
                       ? "bg-background text-foreground shadow-sm ring-1 ring-border" 
                       : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                   )}
                >
                  <span className="text-base">🇧🇷</span>
                  <span>Português</span>
                </button>
             </div>

             {/* Theme Toggle */}
             <DropdownMenuItem
                onClick={toggleTheme}
                className="flex items-center justify-between px-2 py-2 rounded-lg text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
             >
                <div className="flex items-center gap-2">
                    {theme === 'dark' ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-muted-foreground" />}
                    <span>Theme</span>
                </div>
                {/* Visual Switch */}
                <div className={cn(
                    "w-9 h-5 rounded-full p-0.5 transition-colors duration-300 relative",
                    theme === 'dark' ? "bg-primary" : "bg-zinc-300 dark:bg-muted" // Darker grey for light mode visibility
                )}>
                    <div className={cn(
                        "w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm",
                        theme === 'dark' ? "translate-x-4" : "translate-x-0"
                    )} />
                </div>
             </DropdownMenuItem>

          </div>

          <DropdownMenuSeparator className="my-1 bg-border/50" />

          {/* Logout */}
          <DropdownMenuItem
             onClick={handleLogout}
             className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 focus:bg-red-50 dark:focus:bg-red-500/10 cursor-pointer"
          >
             <LogOut className="w-4 h-4" />
             <span>{t('logout')}</span>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

