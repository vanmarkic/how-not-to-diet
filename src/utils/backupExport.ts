/**
 * Backup Export - Full Menu Backup Generation
 *
 * Handles export of all menus (current + library) to JSON file.
 */

import type { StorageData } from './menuStorage';
import { exportAllMenus } from './menuStorage';

// ============================================================================
// Export Functions
// ============================================================================

/**
 * Export all menus to a JSON Blob
 *
 * @returns Blob containing complete backup data
 */
export function exportAllMenusToBlob(): Blob {
  const data = exportAllMenus();

  const backupData = {
    exportDate: new Date().toISOString(),
    ...data,
  };

  const json = JSON.stringify(backupData, null, 2);
  return new Blob([json], { type: 'application/json' });
}

/**
 * Generate backup filename with current date
 *
 * Format: menus-backup-YYYY-MM-DD.json
 */
export function generateBackupFilename(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `menus-backup-${year}-${month}-${day}.json`;
}

/**
 * Download backup as file
 *
 * Creates a download link and triggers it automatically
 */
export function downloadBackup(): void {
  try {
    const blob = exportAllMenusToBlob();
    const url = URL.createObjectURL(blob);
    const filename = generateBackupFilename();

    // Create temporary download link
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('[BackupExport] Downloaded:', filename);
  } catch (error) {
    console.error('[BackupExport] Failed to download backup:', error);
    throw new Error('Failed to download backup. Please try again.');
  }
}

/**
 * Get backup data as JSON string
 *
 * Useful for programmatic access or testing
 */
export function getBackupJSON(): string {
  const data = exportAllMenus();

  const backupData = {
    exportDate: new Date().toISOString(),
    ...data,
  };

  return JSON.stringify(backupData, null, 2);
}

/**
 * Validate backup data structure
 *
 * @param json - JSON string to validate
 * @returns true if valid, false otherwise
 */
export function validateBackupJSON(json: string): boolean {
  try {
    const data = JSON.parse(json);

    // Check required fields
    if (!data.exportDate || !data.library) {
      return false;
    }

    // Validate library is array
    if (!Array.isArray(data.library)) {
      return false;
    }

    // Validate current menu if present
    if (data.current !== null && typeof data.current !== 'object') {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}
