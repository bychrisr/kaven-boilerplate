'use client';

import { useRouter } from 'next/navigation';
import { Home, User, Settings, LogOut, CreditCard } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Gerar iniciais do nome
  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  // URL do avatar com fallback
  const avatarUrl = user?.avatar 
    ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:8000${user.avatar}`)
    : undefined;

  const menuItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Profile', icon: User, href: '/profile' },
    { label: 'Settings', icon: Settings, href: '/settings' },
    { label: 'Billing', icon: CreditCard, href: '/billing' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full outline-none transition-transform hover:scale-105 active:scale-95">
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
        className="w-80 p-0 border-border bg-popover text-popover-foreground rounded-2xl backdrop-blur-xl shadow-2xl"
      >
          {/* Header */}
          <div className="flex flex-col items-center justify-center p-6 border-b border-dashed border-border relative">
             <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full p-1 bg-primary">
                    <div className="w-full h-full rounded-full bg-popover p-1">
                        <Avatar className="w-full h-full">
                            {avatarUrl ? (
                              <AvatarImage 
                                  src={avatarUrl} 
                                  alt={user?.name || 'User'}
                              />
                            ) : null}
                            <AvatarFallback className="bg-primary/10 text-primary text-2xl">{initials}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
             </div>

             <h6 className="text-lg font-bold text-foreground mb-1">{user?.name || 'Jaydon Frankie'}</h6>
             <p className="text-sm text-muted-foreground">{user?.email || 'demo@minimals.cc'}</p>
          </div>

          {/* Menu Items */}
          <div className="p-4 space-y-1">
            {menuItems.map((item) => (
                <DropdownMenuItem
                    key={item.label}
                    onClick={() => router.push(item.href)}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm text-foreground/90 focus:text-accent-foreground focus:bg-accent cursor-pointer group outline-none"
                >
                    <item.icon className="w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors" />
                    <span className="font-medium">{item.label}</span>
                    {item.label === 'Billing' && (
                        <span className="ml-auto bg-error-main/20 text-error-main text-xs font-bold px-1.5 py-0.5 rounded">
                            2
                        </span>
                    )}
                </DropdownMenuItem>
            ))}
          </div>

          {/* Logout Button */}
          <div className="p-4 pt-0">
             <button
                onClick={handleLogout}
                className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 border border-red-500/20 cursor-pointer"
             >
                <LogOut className="w-4 h-4" />
                Logout
             </button>
          </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
