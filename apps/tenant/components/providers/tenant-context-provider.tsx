'use client';

import { useEffect } from 'react';
import { useTenantStore } from '@/lib/store/tenant-store';
import { useSpaceStore } from '@/lib/store/space-store';
import { useAuthStore } from '@/stores/auth.store';

export function TenantContextProvider({ children }: { children: React.ReactNode }) {
  const { setTenant, setLoading: setTenantLoading } = useTenantStore();
  const { setSpaces, setActiveSpace, setLoading: setSpaceLoading, activeSpaceId } = useSpaceStore();
  const { user } = useAuthStore();

  useEffect(() => {
    async function initContext() {
      if (!user) return;

      try {
        setTenantLoading(true);
        setSpaceLoading(true);

        // 1. Fetch Tenant Info (Mocked for Phase 2 or fetch from API)
        // In real multi-tenant, we fetch based on domain or user's tenantId
        // For now, we use the user's tenant link or just mock "Kaven HQ"
        setTenant({
          id: user.tenantId || 'default-tenant-id',
          name: 'Kaven HQ', // TODO: Fetch real name
          slug: 'kaven-hq',
          plan: 'enterprise'
        });

        // 2. Fetch Spaces (from API where we seeded them)
        // We reuse the Admin API route /api/spaces or similar
        // Since we are running on port 3001 but API is 8000, we need to proxy or hit 8000
        // config.ts logic uses http://localhost:8000
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/spaces`, {
             headers: {
                 'Authorization': `Bearer ${localStorage.getItem('access_token')}`
             }
        });
        
        if (response.ok) {
            const data = await response.json();
            // Data format from API? Assuming { data: Space[] } or Space[]
            const spaces = Array.isArray(data) ? data : data.data || [];
            
            // Map API space to Store Space (ensure fields match)
            const mapped = spaces.map((s: { id: string; code: string; name: string; icon: string; color: string }) => ({
                id: s.id,
                code: s.code,
                name: s.name,
                icon: s.icon,
                color: s.color,
                isActive: true
            }));
            
            setSpaces(mapped);

            // Set default active space if none allowed or invalid
            if (mapped.length > 0 && !activeSpaceId) {
                 // Default to first one or 'ADMIN' if exists?
                 setActiveSpace(mapped[0].id);
            }
        }

      } catch (error) {
        console.error('Failed to init tenant context:', error);
      } finally {
        setTenantLoading(false);
        setSpaceLoading(false);
      }
    }

    initContext();
  }, [user, setTenant, setSpaces, setActiveSpace, setTenantLoading, setSpaceLoading, activeSpaceId]);

  return <>{children}</>;
}
