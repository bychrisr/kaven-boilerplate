import { useSettings } from '@/stores/settings.store';

// Facade hook to sync Sidebar state with Settings Store (Single Source of Truth)
export const useSidebar = () => {
  const { themeLayout, setThemeLayout } = useSettings();

  const isCollapsed = themeLayout === 'mini';

  const toggle = () => {
    setThemeLayout(isCollapsed ? 'vertical' : 'mini');
  };

  const collapse = () => {
    setThemeLayout('mini');
  };

  const expand = () => {
    setThemeLayout('vertical');
  };

  return {
    isCollapsed,
    toggle,
    collapse,
    expand,
  };
};
