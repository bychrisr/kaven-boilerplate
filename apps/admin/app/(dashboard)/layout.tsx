import { ReactNode } from 'react';
import { DashboardLayoutClient } from './layout-client';

/**
 * Dashboard Layout (Server Component)
 * 
 * Este layout é mantido como Server Component para habilitar SSR.
 * Toda a lógica de estado, providers e interatividade foi movida
 * para o DashboardLayoutClient.
 * 
 * @see /docs/design-system/architecture.md - Server vs Client Components
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
