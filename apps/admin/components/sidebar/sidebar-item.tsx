import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isCollapsed?: boolean;
  hasSubmenu?: boolean;
}

export function SidebarItem({
  icon: Icon,
  label,
  href,
  isCollapsed = false,
  hasSubmenu = false,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  const content = (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-[8px]',
        'transition-colors duration-200',
        'hover:bg-white/5',
        isActive && 'bg-[rgba(24,119,242,0.08)] text-[#1877F2]',
        !isActive && 'text-[#919EAB]',
        isCollapsed && 'justify-center px-2'
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {!isCollapsed && (
        <>
          <span className="flex-1 text-sm font-medium">{label}</span>
          {hasSubmenu && (
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip title={label} placement="right">
        {content}
      </Tooltip>
    );
  }

  return content;
}
