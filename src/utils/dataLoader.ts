import type { Recipe, WeeklyMenu, Food, FoodCategory, MealTiming } from '../types/index';

/**
 * Raw extracted food data structure from JSON file
 */
interface ExtractedFoodData {
  extraction_metadata: {
    extraction_date: string;
    focus_areas: string[];
  };
  extraction_index: Array<{
    food: string;
    pages: number[];
  }>;
  foods: Food[];
}

// ============================================================================
// Recipe Data Loaders
// ============================================================================

/**
 * Load recipes from JSON file
 */
export async function loadRecipes(): Promise<Recipe[]> {
  try {
    const recipesModule = await import('@data/recipes.json');
    return recipesModule.default as Recipe[];
  } catch (error) {
    console.error('Error loading recipes:', error);
    return [];
  }
}

/**
 * Load a specific recipe by ID
 */
export async function loadRecipeById(id: string): Promise<Recipe | null> {
  const recipes = await loadRecipes();
  return recipes.find(recipe => recipe.id === id) || null;
}

/**
 * Load recipes by category
 */
export async function loadRecipesByCategory(category: string): Promise<Recipe[]> {
  const recipes = await loadRecipes();
  return recipes.filter(recipe => recipe.category === category);
}

/**
 * Search recipes by query string
 */
export async function searchRecipes(query: string): Promise<Recipe[]> {
  const recipes = await loadRecipes();
  const lowerQuery = query.toLowerCase();

  return recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(lowerQuery) ||
    recipe.description.toLowerCase().includes(lowerQuery) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// ============================================================================
// Weekly Menu Data Loaders
// ============================================================================

/**
 * Load weekly menus from JSON file
 */
export async function loadWeeklyMenus(): Promise<WeeklyMenu[]> {
  try {
    const menusModule = await import('@data/weekly-menus.json');
    return menusModule.default as unknown as WeeklyMenu[];
  } catch (error) {
    console.error('Error loading weekly menus:', error);
    return [];
  }
}

/**
 * Load a specific weekly menu by ID
 */
export async function loadWeeklyMenuById(id: string): Promise<WeeklyMenu | null> {
  const menus = await loadWeeklyMenus();
  return menus.find(menu => menu.id === id) || null;
}

// ============================================================================
// Food Data Loaders
// ============================================================================

/**
 * Load all extracted foods from JSON file
 *
 * @returns Array of Food objects with all nutritional data and synergies
 * @throws Never throws - returns empty array on error
 *
 * @example
 * ```ts
 * const foods = await loadFoods();
 * console.log(foods.length); // 10 foods from extracted data
 * ```
 */
export async function loadFoods(): Promise<Food[]> {
  try {
    const foodsModule = await import('../../data/extracted-foods.json');
    return foodsModule.default.foods as Food[];
  } catch (error) {
    console.error('Error loading foods:', error);
    return [];
  }
}

/**
 * Load a specific food by ID
 *
 * @param id - The food ID to search for (e.g., "food-1")
 * @returns The food object or null if not found
 *
 * @example
 * ```ts
 * const kale = await loadFoodById('food-2');
 * console.log(kale?.name); // "Kale"
 * ```
 */
export async function loadFoodById(id: string): Promise<Food | null> {
  const foods = await loadFoods();
  return foods.find(food => food.id === id) || null;
}

/**
 * Load foods filtered by category
 *
 * @param category - The food category to filter by
 * @returns Array of foods matching the category
 *
 * @example
 * ```ts
 * const cruciferous = await loadFoodsByCategory('cruciferous');
 * // Returns: [Kale, Cabbage]
 * ```
 */
export async function loadFoodsByCategory(category: FoodCategory): Promise<Food[]> {
  const foods = await loadFoods();
  return foods.filter(food => food.categories.includes(category));
}

/**
 * Load foods filtered by meal timing
 *
 * @param timing - The meal timing to filter by
 * @returns Array of foods matching the timing
 *
 * @example
 * ```ts
 * const breakfastFoods = await loadFoodsByTiming('breakfast');
 * // Returns: [Oat Groats, Flaxseeds, Berries, ...]
 * ```
 */
export async function loadFoodsByTiming(timing: MealTiming): Promise<Food[]> {
  const foods = await loadFoods();
  return foods.filter(food => food.timing.includes(timing));
}

/**
 * Load the complete extracted food data including metadata
 *
 * @returns Complete data structure with metadata, index, and foods
 *
 * @example
 * ```ts
 * const data = await loadExtractedFoodData();
 * console.log(data.extraction_metadata.extraction_date);
 * console.log(data.foods.length);
 * ```
 */
export async function loadExtractedFoodData(): Promise<ExtractedFoodData | null> {
  try {
    const foodsModule = await import('../../data/extracted-foods.json');
    return foodsModule.default as ExtractedFoodData;
  } catch (error) {
    console.error('Error loading extracted food data:', error);
    return null;
  }
}
