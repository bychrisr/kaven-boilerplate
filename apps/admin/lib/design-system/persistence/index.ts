/**
 * Design System Persistence Layer
 * Handles DB + localStorage cache with auto-sync
 */

import type { UserCustomization } from '../core/types';

const CACHE_KEY = 'kaven-design-system-cache';
const CACHE_VERSION_KEY = 'kaven-design-system-version';

// ============================================
// LOCALSTORAGE CACHE
// ============================================

export function getCachedCustomization(): UserCustomization | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const customization = JSON.parse(cached) as UserCustomization;
    
    // Convert date strings back to Date objects
    if (customization.createdAt) {
      customization.createdAt = new Date(customization.createdAt);
    }
    if (customization.updatedAt) {
      customization.updatedAt = new Date(customization.updatedAt);
    }

    return customization;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

export function setCachedCustomization(customization: UserCustomization): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(customization));
    localStorage.setItem(CACHE_VERSION_KEY, customization.updatedAt?.toISOString() || new Date().toISOString());
  } catch (error) {
    console.error('Error writing cache:', error);
  }
}

export function clearCachedCustomization(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_VERSION_KEY);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

export function getCacheVersion(): string | null {
  return localStorage.getItem(CACHE_VERSION_KEY);
}

// ============================================
// DATABASE OPERATIONS
// ============================================

export async function loadCustomizationFromDB(userId?: string): Promise<UserCustomization | null> {
  try {
    const response = await fetch(`/api/design-system/customization${userId ? `?userId=${userId}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No customization found
      }
      throw new Error('Failed to load customization from database');
    }

    const data = await response.json();
    
    // Convert date strings to Date objects
    if (data.createdAt) data.createdAt = new Date(data.createdAt);
    if (data.updatedAt) data.updatedAt = new Date(data.updatedAt);

    return data as UserCustomization;
  } catch (error) {
    console.error('Error loading from database:', error);
    return null;
  }
}

export async function saveCustomizationToDB(customization: UserCustomization): Promise<UserCustomization | null> {
  try {
    const response = await fetch('/api/design-system/customization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customization),
    });

    if (!response.ok) {
      throw new Error('Failed to save customization to database');
    }

    const data = await response.json();
    
    // Convert date strings to Date objects
    if (data.createdAt) data.createdAt = new Date(data.createdAt);
    if (data.updatedAt) data.updatedAt = new Date(data.updatedAt);

    return data as UserCustomization;
  } catch (error) {
    console.error('Error saving to database:', error);
    return null;
  }
}

export async function deleteCustomizationFromDB(userId?: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/design-system/customization${userId ? `?userId=${userId}` : ''}`, {
      method: 'DELETE',
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting from database:', error);
    return false;
  }
}

// ============================================
// SYNC STRATEGY
// ============================================

export async function syncCustomization(userId?: string): Promise<UserCustomization | null> {
  // 1. Try to load from database
  const dbCustomization = await loadCustomizationFromDB(userId);
  
  // 2. Get cached version
  const cachedCustomization = getCachedCustomization();
  const cacheVersion = getCacheVersion();

  // 3. Determine which is newer
  if (!dbCustomization && !cachedCustomization) {
    return null; // No customization exists
  }

  if (!dbCustomization) {
    // Only cache exists, use it
    return cachedCustomization;
  }

  if (!cachedCustomization) {
    // Only DB exists, cache it and use it
    setCachedCustomization(dbCustomization);
    return dbCustomization;
  }

  // Both exist, compare versions
  const dbVersion = dbCustomization.updatedAt?.getTime() || 0;
  const cacheVersionTime = cacheVersion ? new Date(cacheVersion).getTime() : 0;

  if (dbVersion > cacheVersionTime) {
    // DB is newer, update cache
    setCachedCustomization(dbCustomization);
    return dbCustomization;
  } else {
    // Cache is newer or same, use cache
    return cachedCustomization;
  }
}

export async function saveAndSync(customization: UserCustomization): Promise<UserCustomization | null> {
  // 1. Save to database
  const saved = await saveCustomizationToDB(customization);
  
  if (saved) {
    // 2. Update cache with DB response (includes server timestamps)
    setCachedCustomization(saved);
    return saved;
  } else {
    // 3. Fallback: save to cache only
    const fallback = {
      ...customization,
      updatedAt: new Date(),
    };
    setCachedCustomization(fallback);
    return fallback;
  }
}

export async function resetAndSync(userId?: string): Promise<void> {
  // 1. Delete from database
  await deleteCustomizationFromDB(userId);
  
  // 2. Clear cache
  clearCachedCustomization();
}
