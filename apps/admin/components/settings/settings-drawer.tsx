'use client';

import { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { useSettings, ThemeLayout, ThemeMode, ThemeContrast } from '@/stores/settings.store';
import { cn } from '@/lib/utils';


export function SettingsDrawer() {
  const [open, setOpen] = useState(false);
  
  const {
    theme,
    setTheme,
    themeLayout,
    setThemeLayout,

    themeStretch,
    setThemeStretch,
    themeContrast,
    setThemeContrast,
    onResetSetting,
  } = useSettings();

  const toggleDrawer = () => setOpen(!open);
  const closeDrawer = () => setOpen(false);

  return (
    <>
      {/* Trigger Button - now integrated in Header preferably, but keeping a floating one for dev/audit if needed, 
          or just this component acting as the logic carrier for the Header button if we connect it differently.
          For now, we export this and put it in layout. 
      */}
      
      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity" 
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-[280px] bg-white dark:bg-[#1C252E] shadow-2xl transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-gray-700",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-dashed border-gray-200 dark:border-gray-700">
          <div className="font-bold text-lg">Settings</div>
          <div className="flex items-center gap-2">
            <button 
                onClick={onResetSetting}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Reset"
            >
                <RefreshCw className="w-4 h-4 text-gray-500" />
            </button>
            <button 
                onClick={closeDrawer}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-8 overflow-y-auto h-[calc(100vh-64px)]">
          {/* Mode */}
          <div className="space-y-3">
             <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mode</div>
             <div className="grid grid-cols-2 gap-3">
                {['light', 'dark'].map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setTheme(mode as ThemeMode)}
                        className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                            theme === mode 
                                ? "border-primary-main bg-primary-main/5 text-primary-main" 
                                : "border-transparent bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                    >
                        {mode === 'light' ? <span className="text-xl">☀️</span> : <span className="text-xl">🌙</span>}
                        <span className="mt-2 text-xs font-medium capitalize">{mode}</span>
                    </button>
                ))}
             </div>
          </div>

          {/* Contrast */}
          <div className="space-y-3">
             <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Contrast</div>
             <div className="grid grid-cols-2 gap-3">
                {['default', 'bold'].map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setThemeContrast(mode as ThemeContrast)}
                        className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
                            themeContrast === mode 
                                ? "border-primary-main bg-primary-main/5 text-primary-main" 
                                : "border-transparent bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                    >
                        <div className={cn("w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 mb-2", mode === 'bold' ? "bg-gray-900 border-none" : "bg-transparent")} />
                        <span className="mt-2 text-xs font-medium capitalize">{mode}</span>
                    </button>
                ))}
             </div>
          </div>

          {/* Layout */}
          <div className="space-y-3">
             <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Layout</div>
             <div className="grid grid-cols-3 gap-2">
                {['vertical', 'horizontal', 'mini'].map((layout) => (
                    <button
                        key={layout}
                        onClick={() => setThemeLayout(layout as ThemeLayout)}
                        className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all",
                            themeLayout === layout
                                ? "border-primary-main bg-primary-main/5 text-primary-main" 
                                : "border-transparent bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                    >
                        {/* Mock Icons for Layouts */}
                        <div className="w-full h-8 bg-current opacity-20 rounded mb-1 relative">
                            {layout === 'vertical' && <div className="absolute left-0 top-0 w-1/3 h-full bg-current opacity-40 rounded-l" />}
                            {layout === 'horizontal' && <div className="absolute left-0 top-0 w-full h-1/3 bg-current opacity-40 rounded-t" />}
                            {layout === 'mini' && <div className="absolute left-0 top-0 w-1/6 h-full bg-current opacity-40 rounded-l" />}
                        </div>
                        <span className="text-[10px] font-medium capitalize">{layout}</span>
                    </button>
                ))}
             </div>
          </div>



           {/* Stretch */}
           <div className="space-y-3">
             <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Stretch</div>
             <div className="flex items-center justify-between p-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500">
                <span className="text-sm font-medium">Full Width</span>
                <button
                    onClick={() => setThemeStretch(!themeStretch)}
                    className={cn(
                        "w-10 h-6 rounded-full transition-colors relative",
                        themeStretch ? "bg-primary-main" : "bg-gray-400"
                    )}
                >
                    <div className={cn(
                        "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                        themeStretch ? "translate-x-4" : "translate-x-0"
                    )} />
                </button>
             </div>
          </div>

        </div>
      </div>
      
      {/* Expose method to trigger via Header */}
      {/* 
          In a real app, we might use a separate global UI store for opening this drawer, 
          or pass the trigger down. For now, since header uses settings store, 
          we might need to add `toggleSettingsDrawer` to the settings store OR 
          just render the button using a Portal or global context.
          
          Simplified for Boilerplate: We'll make this component accept a 'trigger' prop 
          or just mount it in the layout and use a global event/store. 
          Actually, let's keep it simple: Add `settingsOpen` to the `useSettings` store? 
          No, that mixes UI state with Preference state. 
          
          Let's add `settingsOpen` to `useUIStore` or just keep it local here 
          and have the Gear icon in Header set a global state?
          
          Better: The `Header` has the gear icon. 
          Let's use the existing `onResetSetting` loop? No.
          
          The best 'Minimals' way is a global UI state.
      */}
      <SettingsDrawerTrigger onClick={toggleDrawer} />
    </>
  );
}

// Separate trigger component to place in Header if needed, 
// or just export the Open function via Context? 
// For simplicity in this step, let's export a Helper component
// that injects the Drawer into the layout, and assumes the Header 
// will trigger it via a Custom Event or Shared State.
// 
// Let's modify `ui.store.ts` to include `settingsPanelOpen`.
function SettingsDrawerTrigger({ onClick }: { onClick: () => void }) {
    // This is a invisible listener component if we wanted to use an event bus
    // OR we can just instruct the user to put the button in the header.
    // 
    // Wait, the Header ALREADY has a Settings button that calls `toggleTheme`.
    // We should change that button to open this drawer instead!
    
    // We'll create a simple event listener for now to avoid refactoring the whole store hierarchy just for a drawer open
    useEffect(() => {
        const handleOpenSettings = () => onClick();
        window.addEventListener('open-settings-drawer', handleOpenSettings);
        return () => window.removeEventListener('open-settings-drawer', handleOpenSettings);
    }, [onClick]);
    
    return null;
}

// Helper to trigger it from anywhere
export const openSettingsDrawer = () => {
    window.dispatchEvent(new Event('open-settings-drawer'));
};
