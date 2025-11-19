/**
 * Single source of truth for URL path generation
 * Handles base path for GitHub Pages deployment
 */

/**
 * Get the base URL for the application
 * In production (GitHub Pages): '/how-not-to-diet/'
 * In development: '/'
 */
export function getBaseUrl(): string {
  return import.meta.env.BASE_URL;
}

/**
 * Create a full path with the base URL prepended
 * @param path - The path to append to base (without leading slash)
 * @returns Full path with base URL
 *
 * @example
 * getPath('planner') // returns '/how-not-to-diet/planner' in prod, '/planner' in dev
 * getPath('') // returns '/how-not-to-diet/' in prod, '/' in dev
 */
export function getPath(path: string = ''): string {
  const base = getBaseUrl();
  if (!path) return base;

  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Ensure base ends with / for proper concatenation
  const baseWithSlash = base.endsWith('/') ? base : `${base}/`;

  return `${baseWithSlash}${cleanPath}`;
}

/**
 * Create a path for an asset (favicon, images, etc.)
 * @param assetPath - Path to the asset (without leading slash)
 * @returns Full path to the asset
 */
export function getAssetPath(assetPath: string): string {
  return getPath(assetPath);
}
