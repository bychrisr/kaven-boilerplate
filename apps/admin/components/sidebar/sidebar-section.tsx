import * as React from 'react';
import { cn } from '@/lib/utils';

interface SidebarSectionProps {
  title: string;
  collapsed?: boolean;
  children: React.ReactNode;
}

export function SidebarSection({
  title,
  collapsed = false,
  children,
}: SidebarSectionProps) {
  return (
    <div className="mb-6">
      {!collapsed && (
        <h6 className="px-3 mb-2 text-xs font-semibold text-[#919EAB] uppercase tracking-wider">
          {title}
        </h6>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
}
