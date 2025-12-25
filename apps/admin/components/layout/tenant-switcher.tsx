import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { useTenant } from '@/hooks/use-tenant';
import { useSpaces } from '@/hooks/use-spaces';
import { useAuthStore } from '@/stores/auth.store';
import { useClickOutside } from '@/hooks/use-click-outside';
import { cn } from '@/lib/utils';

export function TenantSwitcher() {
  const { tenant } = useTenant();
  const { user } = useAuthStore();
  const { currentSpace, availableSpaces, setCurrentSpace } = useSpaces();
  const [isOpen, setIsOpen] = useState(false);
  
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  if (!tenant || !currentSpace) {
    return (
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-main to-primary-dark animate-pulse" />
        <div className="flex flex-col gap-1">
          <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
          <div className="h-2 w-12 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const role = user?.role || 'USER';

  return (
    <div className="relative hidden md:block" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-accent transition-colors"
      >
        {/* Tenant Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-main to-primary-dark flex items-center justify-center text-white text-xs font-bold">
          {tenant.name[0]}
        </div>
        
        {/* Tenant Info */}
        <div className="flex flex-col items-start">
          <span className="text-sm font-semibold leading-tight text-foreground">
            {currentSpace.name}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium uppercase">
            {role}
          </span>
        </div>
        
        {/* Chevron */}
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground ml-1 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-card text-card-foreground border border-border rounded-lg shadow-2xl z-50 overflow-hidden">
          {/* Spaces List */}
          <div className="p-2">
            {availableSpaces.map((space) => {
              const isActive = currentSpace.id === space.id;
              
              return (
                <button
                  key={space.id}
                  onClick={() => {
                    setCurrentSpace(space);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left",
                    isActive 
                      ? "bg-primary-main/10 text-primary-main" 
                      : "hover:bg-accent hover:text-accent-foreground text-foreground"
                  )}
                >
                  {/* Space Avatar */}
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                    isActive 
                      ? "bg-gradient-to-tr from-primary-main to-primary-dark text-white"
                      : "bg-muted text-foreground"
                  )}>
                    {space.name[0]}
                  </div>
                  
                    {/* Space Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate leading-none">
                      {space.name.toUpperCase()}
                    </div>
                  </div>
                  
                  {/* Role Badge */}
                  <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border uppercase">
                    {role}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Create Workspace */}
          <div className="p-2">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors text-left">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Create workspace</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
