import type { FoodDatabase, Food } from '../types/food';

/**
 * Load food synergies database from JSON file
 */
export async function loadFoodDatabase(): Promise<FoodDatabase | null> {
  try {
    const foodsModule = await import('@data/extracted-foods.json');
    return foodsModule.default as FoodDatabase;
  } catch (error) {
    console.error('Error loading food database:', error);
    return null;
  }
}

/**
 * Load all foods
 */
export async function loadFoods(): Promise<Food[]> {
  const db = await loadFoodDatabase();
  return db?.foods || [];
}

/**
 * Load a specific food by ID
 */
export async function loadFoodById(id: string): Promise<Food | null> {
  const foods = await loadFoods();
  return foods.find(food => food.id === id) || null;
}

/**
 * Load foods by category
 */
export async function loadFoodsByCategory(category: string): Promise<Food[]> {
  const foods = await loadFoods();
  return foods.filter(food => food.categories.includes(category));
}

/**
 * Search foods by name or property
 */
export async function searchFoods(query: string): Promise<Food[]> {
  const foods = await loadFoods();
  const lowerQuery = query.toLowerCase();

  return foods.filter(food =>
    food.name.toLowerCase().includes(lowerQuery) ||
    food.properties.some(prop => prop.toLowerCase().includes(lowerQuery)) ||
    food.categories.some(cat => cat.toLowerCase().includes(lowerQuery))
  );
}
