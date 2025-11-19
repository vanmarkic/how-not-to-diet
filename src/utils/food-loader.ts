/**
 * Food data loader utilities
 *
 * Provides functions to load food data from individual files (development)
 * or from the pre-built bundle (production).
 */

import { readFile } from 'fs/promises';
import { glob } from 'glob';

export interface Food {
  id: string;
  name: string;
  categories: string[];
  properties: string[];
  benefits: string;
  synergies: string[];
  conflicts: string[];
  timing: string[];
  amount: string;
  sources: {
    pages: number[];
    quotes: string[];
  };
}

export interface FoodIndex {
  extraction_metadata: {
    extraction_date: string;
    focus_areas: string[];
  };
  extraction_index: Array<{
    food: string;
    pages: number[];
  }>;
  schema_version?: string;
  total_foods?: number;
}

export interface FoodData {
  extraction_metadata: {
    extraction_date: string;
    focus_areas: string[];
  };
  extraction_index: Array<{
    food: string;
    pages: number[];
  }>;
  build_metadata?: {
    build_timestamp: string;
    total_foods: number;
    total_categories: number;
    builder_version: string;
  };
  categories?: string[];
  foods: Food[];
}

/**
 * Loads all food data from individual JSON files
 * Use this during development or in build scripts
 *
 * @returns Promise resolving to food data
 * @throws Error if files cannot be read or parsed
 */
export async function loadFoodsFromFiles(): Promise<FoodData> {
  try {
    // Read index/metadata
    const indexContent = await readFile('./data/index.json', 'utf-8');
    const index = JSON.parse(indexContent) as FoodIndex;

    // Read all food files
    const foodFiles = await glob('./data/foods/*.json');

    if (foodFiles.length === 0) {
      throw new Error('No food files found in data/foods/');
    }

    const foods: Food[] = await Promise.all(
      foodFiles.map(async (filepath) => {
        const content = await readFile(filepath, 'utf-8');
        return JSON.parse(content) as Food;
      })
    );

    // Sort by ID for consistency
    foods.sort((a, b) => a.id.localeCompare(b.id));

    return {
      extraction_metadata: index.extraction_metadata,
      extraction_index: index.extraction_index,
      foods
    };
  } catch (err) {
    throw new Error(`Failed to load foods from files: ${(err as Error).message}`);
  }
}

/**
 * Loads pre-aggregated food bundle
 * Use this in production/runtime
 *
 * @returns Promise resolving to food data
 * @throws Error if bundle cannot be read or parsed
 */
export async function loadFoodBundle(): Promise<FoodData> {
  try {
    const content = await readFile('./dist/foods-bundle.json', 'utf-8');
    return JSON.parse(content) as FoodData;
  } catch (err) {
    throw new Error(`Failed to load food bundle: ${(err as Error).message}`);
  }
}

/**
 * Auto-detects which loader to use based on environment
 * Falls back to bundle if individual files are not available
 *
 * @returns Promise resolving to food data
 */
export async function loadFoods(): Promise<FoodData> {
  // In Astro SSG, we should always use the bundle
  // But this provides flexibility for other use cases
  try {
    return await loadFoodBundle();
  } catch {
    // Fallback to individual files if bundle doesn't exist
    return await loadFoodsFromFiles();
  }
}

/**
 * Gets a specific food by ID
 *
 * @param id - Food ID (e.g., "food-1")
 * @returns Promise resolving to food object or undefined if not found
 */
export async function getFoodById(id: string): Promise<Food | undefined> {
  const data = await loadFoods();
  return data.foods.find(food => food.id === id);
}

/**
 * Gets foods by category
 *
 * @param category - Category name (e.g., "anti-inflammatory")
 * @returns Promise resolving to array of matching foods
 */
export async function getFoodsByCategory(category: string): Promise<Food[]> {
  const data = await loadFoods();
  return data.foods.filter(food =>
    food.categories.includes(category)
  );
}

/**
 * Gets all unique categories from food data
 *
 * @returns Promise resolving to sorted array of category names
 */
export async function getAllCategories(): Promise<string[]> {
  const data = await loadFoods();
  const categories = new Set<string>();

  data.foods.forEach(food => {
    food.categories.forEach(cat => categories.add(cat));
  });

  return Array.from(categories).sort();
}

/**
 * Searches foods by name (case-insensitive)
 *
 * @param query - Search query
 * @returns Promise resolving to array of matching foods
 */
export async function searchFoods(query: string): Promise<Food[]> {
  const data = await loadFoods();
  const lowerQuery = query.toLowerCase();

  return data.foods.filter(food =>
    food.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Gets foods with synergies to a specific food
 *
 * @param foodName - Name of the food to find synergies for
 * @returns Promise resolving to array of foods that synergize
 */
export async function getFoodSynergies(foodName: string): Promise<Food[]> {
  const data = await loadFoods();
  const targetFood = data.foods.find(f =>
    f.name.toLowerCase() === foodName.toLowerCase()
  );

  if (!targetFood || !targetFood.synergies.length) {
    return [];
  }

  // Find foods whose names match the synergy tags
  const synergySet = new Set(targetFood.synergies.map(s => s.toLowerCase()));

  return data.foods.filter(food =>
    food.name !== targetFood.name &&
    synergySet.has(food.name.toLowerCase())
  );
}
