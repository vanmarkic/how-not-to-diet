/**
 * Menu Storage - localStorage Operations
 *
 * Handles transparent localStorage persistence for weekly menus.
 * Implements auto-save, restore, and snapshot functionality.
 */

// ============================================================================
// Types
// ============================================================================

export interface MealFoods {
  breakfast: string[];  // food IDs
  lunch: string[];
  dinner: string[];
}

export interface WeeklyMenu {
  weekOf: string;  // ISO date (YYYY-MM-DD)
  meals: {
    monday: MealFoods;
    tuesday: MealFoods;
    wednesday: MealFoods;
    thursday: MealFoods;
    friday: MealFoods;
    saturday: MealFoods;
    sunday: MealFoods;
  };
  lastModified: string;  // ISO timestamp
}

export interface MenuSnapshot extends WeeklyMenu {
  name: string;
  created: string;
  totalSynergyScore: number;
}

export interface StorageData {
  current: WeeklyMenu | null;
  library: MenuSnapshot[];
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY_CURRENT = 'menu-current';
const STORAGE_KEY_LIBRARY = 'menu-library';
const AUTO_SAVE_DEBOUNCE_MS = 500;

// ============================================================================
// Auto-save State
// ============================================================================

let autoSaveTimeout: NodeJS.Timeout | null = null;

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Create an empty weekly menu
 */
export function createEmptyMenu(weekOf?: string): WeeklyMenu {
  const defaultWeekOf = weekOf || getStartOfWeek(new Date()).toISOString().split('T')[0];

  const emptyMealFoods: MealFoods = {
    breakfast: [],
    lunch: [],
    dinner: [],
  };

  return {
    weekOf: defaultWeekOf,
    meals: {
      monday: { ...emptyMealFoods },
      tuesday: { ...emptyMealFoods },
      wednesday: { ...emptyMealFoods },
      thursday: { ...emptyMealFoods },
      friday: { ...emptyMealFoods },
      saturday: { ...emptyMealFoods },
      sunday: { ...emptyMealFoods },
    },
    lastModified: new Date().toISOString(),
  };
}

/**
 * Auto-save menu to localStorage (debounced)
 *
 * Automatically saves after 500ms of inactivity
 */
export function autoSaveMenu(menu: WeeklyMenu): void {
  // Clear existing timeout
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }

  // Set new timeout
  autoSaveTimeout = setTimeout(() => {
    try {
      const updatedMenu = {
        ...menu,
        lastModified: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(updatedMenu));
      console.log('[MenuStorage] Auto-saved menu');
    } catch (error) {
      console.error('[MenuStorage] Failed to auto-save:', error);
      handleStorageError(error);
    }
  }, AUTO_SAVE_DEBOUNCE_MS);
}

/**
 * Restore menu from localStorage
 *
 * Returns null if no saved menu exists
 */
export function restoreMenu(): WeeklyMenu | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CURRENT);

    if (!stored) {
      console.log('[MenuStorage] No saved menu found');
      return null;
    }

    const menu = JSON.parse(stored) as WeeklyMenu;
    console.log('[MenuStorage] Restored menu from', menu.weekOf);
    return menu;
  } catch (error) {
    console.error('[MenuStorage] Failed to restore menu:', error);
    return null;
  }
}

/**
 * Snapshot current menu to library
 *
 * @param menu - Current menu to snapshot
 * @param name - Name for the snapshot
 * @param totalSynergyScore - Total synergy score for the menu
 */
export function snapshotMenu(
  menu: WeeklyMenu,
  name: string,
  totalSynergyScore: number
): void {
  try {
    const snapshot: MenuSnapshot = {
      ...menu,
      name,
      created: new Date().toISOString(),
      totalSynergyScore,
    };

    // Get existing library
    const library = getMenuLibrary();

    // Append new snapshot
    library.push(snapshot);

    // Save updated library
    localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(library));

    console.log('[MenuStorage] Saved snapshot:', name);
  } catch (error) {
    console.error('[MenuStorage] Failed to save snapshot:', error);
    handleStorageError(error);
  }
}

/**
 * Load a snapshot from library into current menu
 *
 * @param name - Name of the snapshot to load
 * @returns The loaded menu, or null if not found
 */
export function loadSnapshot(name: string): WeeklyMenu | null {
  try {
    const library = getMenuLibrary();
    const snapshot = library.find(s => s.name === name);

    if (!snapshot) {
      console.warn('[MenuStorage] Snapshot not found:', name);
      return null;
    }

    // Convert snapshot to menu (remove snapshot-specific fields)
    const menu: WeeklyMenu = {
      weekOf: snapshot.weekOf,
      meals: snapshot.meals,
      lastModified: new Date().toISOString(),
    };

    // Auto-save as current menu
    autoSaveMenu(menu);

    console.log('[MenuStorage] Loaded snapshot:', name);
    return menu;
  } catch (error) {
    console.error('[MenuStorage] Failed to load snapshot:', error);
    return null;
  }
}

/**
 * Get all snapshots from library
 */
export function getMenuLibrary(): MenuSnapshot[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_LIBRARY);

    if (!stored) {
      return [];
    }

    return JSON.parse(stored) as MenuSnapshot[];
  } catch (error) {
    console.error('[MenuStorage] Failed to load library:', error);
    return [];
  }
}

/**
 * Clear current menu (reset to empty)
 */
export function clearCurrentMenu(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_CURRENT);
    console.log('[MenuStorage] Cleared current menu');
  } catch (error) {
    console.error('[MenuStorage] Failed to clear menu:', error);
  }
}

/**
 * Export all menus (current + library) as JSON
 */
export function exportAllMenus(): StorageData {
  return {
    current: restoreMenu(),
    library: getMenuLibrary(),
  };
}

/**
 * Import menus from backup JSON
 *
 * @param json - JSON string containing backup data
 * @returns true if successful, false otherwise
 */
export function importBackup(json: string): boolean {
  try {
    const data = JSON.parse(json) as StorageData;

    // Validate structure
    if (!data.library || !Array.isArray(data.library)) {
      throw new Error('Invalid backup format: missing library array');
    }

    // Import library
    if (data.library.length > 0) {
      localStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(data.library));
      console.log('[MenuStorage] Imported', data.library.length, 'snapshots');
    }

    // Import current menu if exists
    if (data.current) {
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(data.current));
      console.log('[MenuStorage] Imported current menu');
    }

    return true;
  } catch (error) {
    console.error('[MenuStorage] Failed to import backup:', error);
    return false;
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get start of week (Monday) for a given date
 */
function getStartOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(date.setDate(diff));
}

/**
 * Handle localStorage errors (e.g., quota exceeded)
 */
function handleStorageError(error: any): void {
  if (error.name === 'QuotaExceededError') {
    console.error('[MenuStorage] localStorage quota exceeded!');
    console.error('Consider:');
    console.error('  1. Clearing old snapshots');
    console.error('  2. Exporting a backup and clearing storage');
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate storage usage
 */
export function getStorageUsage(): {
  current: number;
  library: number;
  total: number;
} {
  try {
    const currentData = localStorage.getItem(STORAGE_KEY_CURRENT) || '';
    const libraryData = localStorage.getItem(STORAGE_KEY_LIBRARY) || '';

    const currentSize = new Blob([currentData]).size;
    const librarySize = new Blob([libraryData]).size;

    return {
      current: currentSize,
      library: librarySize,
      total: currentSize + librarySize,
    };
  } catch (error) {
    console.error('[MenuStorage] Failed to calculate usage:', error);
    return { current: 0, library: 0, total: 0 };
  }
}

/**
 * Format storage size for display
 */
export function formatStorageSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}
