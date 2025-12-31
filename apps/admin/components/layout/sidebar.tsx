'use client';

import { Link, usePathname } from '@/i18n/routing';
import { Logo } from '@/components/logo';
import { Scrollbar } from '@/components/scrollbar/scrollbar';
import { cn } from '@/lib/utils';

import { useSpaces } from '@/hooks/use-spaces';
import { SPACES } from '@/config/spaces';
import {

  ChevronDown,
  ChevronRight,
  ChevronLeft,
  LucideIcon
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useSidebar } from '@/hooks/use-sidebar';
import { useUIStore } from '@/stores/ui.store';

interface NavigationChild {
  name: string;
  href: string;
  external?: boolean;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  children?: NavigationChild[];
}



export function Sidebar() {
  const pathname = usePathname();

  const { currentSpace } = useSpaces();
  const { isCollapsed, toggle } = useSidebar();
  const { sidebarOpen: isMobileOpen, setSidebarOpen } = useUIStore();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Derive navigation sections based on current space
  const navSections = useMemo(() => {
    let spaceId = currentSpace?.id || 'ADMIN';
    if ((spaceId as string) === 'ARCHITECT') spaceId = 'ADMIN';
    
    const config = SPACES[spaceId];
    
    if (!config) return [];

    return config.navSections.map(section => ({
      title: section.title,
      items: section.items.map(item => ({
        name: item.label,
        href: item.href,
        icon: item.icon,
        children: item.children?.map(child => ({
          name: child.label,
          href: child.href,
          external: child.external
        }))
      }))
    }));
  }, [currentSpace]);

  // Expand all sections when navSections changes (e.g. switching spaces)
  useEffect(() => {
    if (navSections.length > 0) {
      setExpandedSections(navSections.map(section => section.title));
    }
  }, [navSections]);

  // Save expanded sections to localStorage
  useEffect(() => {
    if (expandedSections.length > 0) {
      localStorage.setItem('sidebar-expanded-sections', JSON.stringify(expandedSections));
    }
  }, [expandedSections]);

  // Close mobile sidebar on path change
  useEffect(() => {
    if (isMobileOpen) {
      setSidebarOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleExpand = (name: string) => {
    if (isCollapsed) return;
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const toggleSection = (sectionTitle: string) => {
    if (isCollapsed) return;
    setExpandedSections((prev) =>
      prev.includes(sectionTitle)
        ? prev.filter((title) => title !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };


  const renderNavItem = (item: NavigationItem) => {
    const isActive =
      pathname === item.href || item.children?.some((child) => pathname === child.href);
    const isExpanded = expandedItems.includes(item.name);
    const Icon = item.icon;

    if (item.children) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleExpand(item.name)}
            data-tooltip={isCollapsed ? item.name : undefined}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors min-h-[44px]',
              // Typography & Colors match reference
              isActive || (isExpanded && !isCollapsed)
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground font-medium',
              isCollapsed && 'justify-center px-2'
            )}
          >
            <div className={cn("flex items-center gap-4 min-w-0", isCollapsed ? "gap-0" : "")}>
              <Icon className="h-6 w-6 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={cn('h-4 w-4 transition-transform flex-shrink-0', isExpanded && 'rotate-180')}
              />
            )}
          </button>
          {isExpanded && !isCollapsed && (
            <div className="mt-1 space-y-1">
              {item.children.map((child) => {
                const isChildActive = pathname === child.href;
                return (
                    <Link
                    key={child.href}
                    href={child.href}
                    target={child.external ? '_blank' : undefined}
                    rel={child.external ? 'noopener noreferrer' : undefined}
                    className={cn(
                        'flex items-center gap-2 py-2 text-sm rounded-lg transition-colors relative min-h-[36px]',
                        isChildActive
                        ? 'text-foreground font-semibold'
                        : 'text-sidebar-foreground/70 hover:text-foreground font-medium'
                    )}
                    >
                    <div className="w-[24px] flex justify-center flex-shrink-0">
                       <span className={cn(
                           "flex-shrink-0 rounded-full transition-all bg-current",
                           isChildActive ? "w-2 h-2 scale-100 bg-primary" : "w-1 h-1 bg-sidebar-foreground/40 group-hover:bg-foreground"
                       )} />
                    </div>
                    <span className="truncate">{child.name}</span>
                    </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        data-tooltip={isCollapsed ? item.name : undefined}
        className={cn(
          'flex items-center gap-4 px-3 py-2.5 text-sm rounded-lg transition-colors min-h-[44px]',
           isActive
            ? 'bg-primary/10 text-primary font-semibold'
            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground font-medium',
           isCollapsed && 'justify-center px-2 gap-0'
        )}
      >
        <Icon className="h-6 w-6 flex-shrink-0" />
        {!isCollapsed && <span className="truncate">{item.name}</span>}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 z-40 lg:hidden w-full h-full cursor-default focus:outline-none backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-[200] h-screen bg-sidebar/60 backdrop-blur-xl border-r border-border transition-all duration-300',
          'flex flex-col', // Flexbox container
          isCollapsed ? 'w-[88px]' : 'w-[280px]',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Toggle Button */}
        <button
            onClick={toggle}
            className="hidden lg:flex absolute top-8 -right-3 w-6 h-6 bg-sidebar border border-border rounded-full items-center justify-center text-muted-foreground hover:text-foreground z-[201] cursor-pointer shadow-md transition-transform hover:scale-110"
        >
             {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* Logo - Fixo no topo */}
        <div className={cn("h-20 flex items-center px-6 min-h-[80px] shrink-0", isCollapsed ? "justify-center px-0" : "")}>
          <Logo size={isCollapsed ? "small" : "medium"} />
        </div>

        {/* Scrollbar - Área scrollável com flex-1 */}
        <div className="flex-1 min-h-0">
          <Scrollbar>
            <div className="flex flex-col">



            {/* Navigation */}
            <nav className={cn("px-4 pb-4 flex-1", isCollapsed ? "space-y-4" : "space-y-6")}>
              {navSections.map((section) => {
                const isSectionExpanded = expandedSections.includes(section.title);
                
                return (
                  <div key={section.title}>
                    {!isCollapsed && (
                      <button
                        onClick={() => toggleSection(section.title)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 mb-2",
                          "text-[11px] font-bold text-muted-foreground uppercase tracking-wider",
                          "hover:text-foreground transition-colors cursor-pointer"
                        )}
                      >
                        <ChevronDown
                          className={cn(
                            "h-3 w-3 transition-transform duration-300",
                            isSectionExpanded ? "rotate-0" : "-rotate-90"
                          )}
                        />
                        <span>{section.title}</span>
                      </button>
                    )}
                    
                    {/* Items da seção com transição suave */}
                    <div
                      className={cn(
                        "space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
                        isSectionExpanded 
                          ? "max-h-[1000px] opacity-100" 
                          : "max-h-0 opacity-0"
                      )}
                    >
                      {section.items.map((item) => renderNavItem(item))}
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
        </Scrollbar>
        </div>
      </aside>
    </>
  );
}
