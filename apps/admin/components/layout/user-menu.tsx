'use client';

import { useRouter } from 'next/navigation';
import { Home, User, Settings, LogOut, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
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
        <div 
            className={cn(
            "w-10 h-10 rounded-full p-[2px] cursor-pointer transition-transform hover:scale-105",
            "bg-gradient-to-tr from-yellow-400 to-orange-500", // Minimals gradient ring
            "data-[state=open]:scale-105 data-[state=open]:ring-2 data-[state=open]:ring-primary/20"
            )}
        >
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden border-2 border-background">
                <Avatar className="w-full h-full">
                    {avatarUrl ? (
                      <AvatarImage 
                          src={avatarUrl} 
                          alt={user?.name || 'User'} 
                      />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
            </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        sideOffset={8}
        className="w-80 p-0 border-white/5 bg-[#212B36] text-white rounded-2xl backdrop-blur-xl shadow-2xl"
      >
          {/* Header */}
          <div className="flex flex-col items-center justify-center p-6 border-b border-dashed border-white/10 relative">
             <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-primary-dark">
                    <div className="w-full h-full rounded-full bg-[#212B36] p-1">
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

             <h6 className="text-lg font-bold text-white mb-1">{user?.name || 'Jaydon Frankie'}</h6>
             <p className="text-sm text-gray-400">{user?.email || 'demo@minimals.cc'}</p>
          </div>

          {/* Menu Items */}
          <div className="p-4 space-y-1">
            {menuItems.map((item) => (
                <DropdownMenuItem
                    key={item.label}
                    onClick={() => router.push(item.href)}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm text-gray-300 focus:text-white focus:bg-white/5 cursor-pointer group outline-none"
                >
                    <item.icon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
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
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500/10 to-red-500/20 text-red-500 font-bold hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 border border-red-500/20 cursor-pointer"
             >
                <LogOut className="w-4 h-4" />
                Logout
             </button>
          </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
