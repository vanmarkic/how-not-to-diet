/**
 * Meal Ideas Storage - localStorage for Quick Meal Ideas
 *
 * Simple storage for meal combinations discovered in synergies.
 * Compatible with WeeklyMenu format (uses food IDs).
 */

// ============================================================================
// Types
// ============================================================================

export interface MealIdea {
  id: string;
  name: string;
  foodIds: string[];  // Array of food IDs (compatible with WeeklyMenu)
  synergyScore?: number;
  timing?: string[];  // breakfast, lunch, dinner, etc.
  created: string;  // ISO timestamp
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = 'meal-ideas';

// ============================================================================
// Storage Operations
// ============================================================================

/**
 * Get all saved meal ideas
 */
export function getMealIdeas(): MealIdea[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('[MealIdeas] Failed to load meal ideas:', error);
    return [];
  }
}

/**
 * Save a new meal idea
 */
export function saveMealIdea(idea: Omit<MealIdea, 'id' | 'created'>): MealIdea {
  const mealIdea: MealIdea = {
    ...idea,
    id: generateId(),
    created: new Date().toISOString(),
  };

  const ideas = getMealIdeas();
  ideas.unshift(mealIdea);  // Add to beginning (most recent first)

  // Keep only last 50 meal ideas (Pareto - most recent are most useful)
  const trimmed = ideas.slice(0, 50);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return mealIdea;
  } catch (error) {
    console.error('[MealIdeas] Failed to save meal idea:', error);
    throw error;
  }
}

/**
 * Delete a meal idea by ID
 */
export function deleteMealIdea(id: string): void {
  const ideas = getMealIdeas();
  const filtered = ideas.filter(idea => idea.id !== id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('[MealIdeas] Failed to delete meal idea:', error);
  }
}

/**
 * Clear all meal ideas
 */
export function clearMealIdeas(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('[MealIdeas] Failed to clear meal ideas:', error);
  }
}

/**
 * Get meal idea by ID
 */
export function getMealIdea(id: string): MealIdea | null {
  const ideas = getMealIdeas();
  return ideas.find(idea => idea.id === id) || null;
}

// ============================================================================
// Helpers
// ============================================================================

function generateId(): string {
  return `meal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
