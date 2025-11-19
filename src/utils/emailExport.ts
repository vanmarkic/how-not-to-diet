/**
 * Email Export - Shopping List & Menu Email
 *
 * Generates shopping lists and mailto: links for emailing weekly menus.
 */

import type { WeeklyMenu } from './menuStorage';
import type { Food } from './menuSynergyEngine';

// ============================================================================
// Types
// ============================================================================

export interface GroupedIngredients {
  [category: string]: Array<{
    name: string;
    count: number;
  }>;
}

// ============================================================================
// Shopping List Generation
// ============================================================================

/**
 * Generate shopping list from weekly menu
 *
 * Groups foods by category and counts occurrences
 */
export function generateShoppingList(
  menu: WeeklyMenu,
  allFoods: Food[]
): GroupedIngredients {
  // Create food lookup map
  const foodMap = new Map<string, Food>();
  for (const food of allFoods) {
    foodMap.set(food.id, food);
  }

  // Count food occurrences
  const foodCounts = new Map<string, number>();

  // Iterate through all days and meals
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

  for (const day of days) {
    const dayMeals = menu.meals[day];

    for (const mealType of ['breakfast', 'lunch', 'dinner'] as const) {
      const foodIds = dayMeals[mealType];

      for (const foodId of foodIds) {
        foodCounts.set(foodId, (foodCounts.get(foodId) || 0) + 1);
      }
    }
  }

  // Group by primary category
  const grouped: GroupedIngredients = {};

  for (const [foodId, count] of foodCounts) {
    const food = foodMap.get(foodId);
    if (!food) continue;

    // Determine primary category for grouping
    const category = getPrimaryCategoryForGrouping(food);

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push({
      name: food.name,
      count,
    });
  }

  // Sort items within each category alphabetically
  for (const category in grouped) {
    grouped[category].sort((a, b) => a.name.localeCompare(b.name));
  }

  return grouped;
}

/**
 * Get primary category for grouping in shopping list
 */
function getPrimaryCategoryForGrouping(food: Food): string {
  // Priority order for category grouping
  const categoryPriority = [
    'rich-in-vegetables',
    'cruciferous',
    'greens',
    'rich-in-fruits',
    'berries',
    'rich-in-legumes',
    'rich-in-whole-grains',
    'nuts-and-seeds',
    'herbs-and-spices',
    'herbs-spices',
  ];

  for (const priority of categoryPriority) {
    if (food.categories.includes(priority)) {
      return formatCategoryName(priority);
    }
  }

  // Default to first category
  return food.categories.length > 0
    ? formatCategoryName(food.categories[0])
    : 'Other';
}

/**
 * Format category name for display
 */
function formatCategoryName(category: string): string {
  const categoryNames: Record<string, string> = {
    'rich-in-vegetables': 'VEGETABLES',
    'cruciferous': 'VEGETABLES',
    'greens': 'GREENS',
    'rich-in-fruits': 'FRUITS',
    'berries': 'FRUITS',
    'rich-in-legumes': 'LEGUMES',
    'rich-in-whole-grains': 'WHOLE GRAINS',
    'nuts-and-seeds': 'NUTS & SEEDS',
    'herbs-and-spices': 'HERBS & SPICES',
    'herbs-spices': 'HERBS & SPICES',
  };

  return categoryNames[category] || category.toUpperCase().replace(/-/g, ' ');
}

// ============================================================================
// Email Formatting
// ============================================================================

/**
 * Format email body with shopping list and menu preview
 */
export function formatEmailBody(
  menu: WeeklyMenu,
  shoppingList: GroupedIngredients
): string {
  let body = '';

  // Header
  const weekDate = new Date(menu.weekOf);
  const weekStr = weekDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  body += `=== SHOPPING LIST ===\n`;
  body += `Week of ${weekStr}\n\n`;

  // Shopping list grouped by category
  const categories = Object.keys(shoppingList).sort();

  for (const category of categories) {
    body += `${category}:\n`;

    for (const item of shoppingList[category]) {
      const countStr = item.count > 1 ? ` (${item.count}×)` : '';
      body += `  - ${item.name}${countStr}\n`;
    }

    body += '\n';
  }

  // Menu preview
  body += `\n=== WEEKLY MENU PREVIEW ===\n\n`;

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ] as const;

  for (const { key, label } of days) {
    const dayMeals = menu.meals[key];
    body += `${label}:\n`;

    // Only show meals that have foods
    if (dayMeals.breakfast.length > 0) {
      body += `  Breakfast: ${dayMeals.breakfast.length} items\n`;
    }
    if (dayMeals.lunch.length > 0) {
      body += `  Lunch: ${dayMeals.lunch.length} items\n`;
    }
    if (dayMeals.dinner.length > 0) {
      body += `  Dinner: ${dayMeals.dinner.length} items\n`;
    }

    body += '\n';
  }

  return body;
}

/**
 * Open email client with pre-filled content
 *
 * Uses mailto: protocol to open default email client
 */
export function openEmailClient(
  menu: WeeklyMenu,
  allFoods: Food[]
): void {
  const shoppingList = generateShoppingList(menu, allFoods);
  const body = formatEmailBody(menu, shoppingList);

  const weekDate = new Date(menu.weekOf);
  const weekStr = weekDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const subject = `Weekly Menu Shopping List - Week of ${weekStr}`;

  // Create mailto: URL
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Open email client
  window.location.href = mailtoUrl;

  console.log('[EmailExport] Opened email client');
}

/**
 * Use Web Share API if available (mobile-friendly)
 *
 * Falls back to mailto: if Web Share API is not supported
 */
export async function shareMenu(
  menu: WeeklyMenu,
  allFoods: Food[]
): Promise<void> {
  const shoppingList = generateShoppingList(menu, allFoods);
  const body = formatEmailBody(menu, shoppingList);

  const weekDate = new Date(menu.weekOf);
  const weekStr = weekDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const title = `Weekly Menu Shopping List - Week of ${weekStr}`;

  // Try Web Share API first (better for mobile)
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text: body,
      });

      console.log('[EmailExport] Shared via Web Share API');
      return;
    } catch (error) {
      // User cancelled or error occurred
      console.log('[EmailExport] Web Share cancelled or failed:', error);
    }
  }

  // Fallback to mailto:
  openEmailClient(menu, allFoods);
}
