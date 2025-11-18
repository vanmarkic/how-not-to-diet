import type { DayMenu, Recipe, ShoppingListItem } from '../types/index';

/**
 * Format time in minutes to human readable format
 */
export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Calculate total nutrition for a day
 */
export function calculateDayNutrition(dayMenu: DayMenu) {
  const meals = [
    dayMenu.breakfast,
    dayMenu.lunch,
    dayMenu.dinner,
    ...(dayMenu.snacks || [])
  ].filter((meal): meal is Recipe => meal !== undefined);

  return meals.reduce((total, meal) => {
    if (!meal.nutrition) return total;

    return {
      calories: total.calories + meal.nutrition.calories,
      protein: total.protein + meal.nutrition.protein,
      carbohydrates: total.carbohydrates + meal.nutrition.carbohydrates,
      fat: total.fat + meal.nutrition.fat,
      fiber: total.fiber + meal.nutrition.fiber,
    };
  }, {
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
  });
}

/**
 * Generate shopping list from recipes
 */
export function generateShoppingList(recipes: Recipe[]): ShoppingListItem[] {
  const ingredientMap = new Map<string, ShoppingListItem>();

  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      const key = `${ingredient.name}-${ingredient.unit}`;

      if (ingredientMap.has(key)) {
        const existing = ingredientMap.get(key)!;
        existing.amount += ingredient.amount;
      } else {
        ingredientMap.set(key, {
          ingredient: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
        });
      }
    });
  });

  return Array.from(ingredientMap.values()).sort((a, b) =>
    a.ingredient.localeCompare(b.ingredient)
  );
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
