import type { Recipe, Food, WeeklyMenu, DayMenu, Weekday } from '../types';
import { loadFoods } from './dataLoader';
import { analyzeDaySynergies, extractFoodNamesFromRecipe } from './synergyEngine';

/**
 * Score a recipe based on how many high-synergy foods it contains
 */
export async function scoreRecipeForSynergy(recipe: Recipe): Promise<number> {
  const foods = await loadFoods();
  const foodNames = extractFoodNamesFromRecipe(recipe, foods);
  const foodObjects = foods.filter(f => foodNames.includes(f.name));

  let score = 0;

  // Base score for each food
  score += foodObjects.length * 5;

  // Bonus for high-synergy foods
  for (const food of foodObjects) {
    score += food.synergies.length * 2;
    score += food.categories.length;
  }

  // Bonus for Daily Dozen foods
  const dailyDozenCategories = [
    'rich-in-legumes',
    'greens',
    'rich-in-whole-grains',
    'rich-in-fruits',
  ];

  for (const food of foodObjects) {
    for (const category of dailyDozenCategories) {
      if (food.categories.includes(category as any)) {
        score += 5;
      }
    }
  }

  return score;
}

/**
 * Generate complementary recipe recommendations for a given recipe
 */
export async function findComplementaryRecipes(
  baseRecipe: Recipe,
  allRecipes: Recipe[],
  limit: number = 3
): Promise<Array<{ recipe: Recipe; synergyScore: number }>> {
  const foods = await loadFoods();
  const baseFoodNames = extractFoodNamesFromRecipe(baseRecipe, foods);
  const baseFoods = foods.filter(f => baseFoodNames.includes(f.name));

  const results: Array<{ recipe: Recipe; synergyScore: number }> = [];

  for (const recipe of allRecipes) {
    if (recipe.id === baseRecipe.id) continue;

    const recipeFoodNames = extractFoodNamesFromRecipe(recipe, foods);
    const recipeFoods = foods.filter(f => recipeFoodNames.includes(f.name));

    let synergyScore = 0;

    // Check synergies between base foods and recipe foods
    for (const baseFood of baseFoods) {
      for (const recipeFood of recipeFoods) {
        // Check if they're in each other's synergy lists
        const baseSynergies = baseFood.synergies.map(s => s.toLowerCase());
        const recipeSynergies = recipeFood.synergies.map(s => s.toLowerCase());

        if (baseSynergies.some(s => recipeFood.name.toLowerCase().includes(s))) {
          synergyScore += 10;
        }

        if (recipeSynergies.some(s => baseFood.name.toLowerCase().includes(s))) {
          synergyScore += 10;
        }

        // Check for complementary categories
        const sharedCategories = baseFood.categories.filter(cat =>
          recipeFood.categories.includes(cat)
        );
        synergyScore += sharedCategories.length * 3;
      }
    }

    // Check for foods that complement the entire base set
    for (const recipeFood of recipeFoods) {
      if (!baseFoodNames.includes(recipeFood.name)) {
        // New food that complements multiple base foods
        let complementCount = 0;
        for (const baseFood of baseFoods) {
          const synergies = baseFood.synergies.map(s => s.toLowerCase());
          if (synergies.some(s => recipeFood.name.toLowerCase().includes(s))) {
            complementCount++;
          }
        }
        if (complementCount > 0) {
          synergyScore += complementCount * 5;
        }
      }
    }

    if (synergyScore > 0) {
      results.push({ recipe, synergyScore });
    }
  }

  // Sort by synergy score and return top matches
  return results
    .sort((a, b) => b.synergyScore - a.synergyScore)
    .slice(0, limit);
}

/**
 * Check if a day's menu meets Daily Dozen requirements
 */
export async function checkDailyDozenCompliance(
  breakfast?: Recipe,
  lunch?: Recipe,
  dinner?: Recipe,
  snacks?: Recipe[]
): Promise<{
  compliant: boolean;
  missing: string[];
  present: string[];
}> {
  const foods = await loadFoods();
  const allRecipes = [breakfast, lunch, dinner, ...(snacks || [])].filter(
    (r): r is Recipe => r !== undefined
  );

  const allFoodNames = new Set<string>();
  for (const recipe of allRecipes) {
    const foodNames = extractFoodNamesFromRecipe(recipe, foods);
    foodNames.forEach(name => allFoodNames.add(name));
  }

  const foodObjects = foods.filter(f => allFoodNames.has(f.name));

  // Count categories
  const categoryCounts: Record<string, number> = {};
  for (const food of foodObjects) {
    for (const category of food.categories) {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }
  }

  const requirements = [
    { category: 'rich-in-legumes', needed: 3, name: 'Beans (3 servings)' },
    { category: 'greens', needed: 2, name: 'Greens (2 servings)' },
    { category: 'rich-in-whole-grains', needed: 3, name: 'Whole Grains (3 servings)' },
    { category: 'rich-in-fruits', needed: 1, name: 'Berries/Fruits (1 serving)' },
    { category: 'cruciferous', needed: 1, name: 'Cruciferous Vegetables (1 serving)' },
  ];

  const missing: string[] = [];
  const present: string[] = [];

  for (const req of requirements) {
    const count = categoryCounts[req.category] || 0;
    if (count < req.needed) {
      missing.push(`${req.name} - have ${count}, need ${req.needed}`);
    } else {
      present.push(req.name);
    }
  }

  return {
    compliant: missing.length === 0,
    missing,
    present,
  };
}

/**
 * Generate an optimized weekly menu based on available recipes and food synergies
 */
export async function generateOptimizedWeeklyMenu(
  recipes: Recipe[],
  week: number,
  year: number
): Promise<WeeklyMenu> {
  const days: Weekday[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  const breakfasts = recipes.filter(r => r.category === 'breakfast');
  const lunches = recipes.filter(r => r.category === 'lunch');
  const dinners = recipes.filter(r => r.category === 'dinner');

  const dayMenus: DayMenu[] = [];

  for (const day of days) {
    // For demonstration, rotate through available recipes
    const breakfastIndex = days.indexOf(day) % breakfasts.length;
    const lunchIndex = days.indexOf(day) % lunches.length;
    const dinnerIndex = days.indexOf(day) % dinners.length;

    const breakfast = breakfasts[breakfastIndex];
    const lunch = lunches[lunchIndex];
    const dinner = dinners[dinnerIndex];

    dayMenus.push({
      day,
      breakfast,
      lunch,
      dinner,
      snacks: [],
    });
  }

  return {
    id: `optimized-week-${week}-${year}`,
    name: `Optimized Menu - Week ${week}, ${year}`,
    week,
    year,
    days: dayMenus,
  };
}

/**
 * Suggest foods to add to a meal to improve synergies
 */
export async function suggestFoodsToAdd(
  currentFoods: string[],
  mealType: 'breakfast' | 'lunch' | 'dinner'
): Promise<Array<{ food: Food; reason: string; synergyBoost: number }>> {
  const foods = await loadFoods();
  const currentFoodObjects = foods.filter(f => currentFoods.includes(f.name));

  const suggestions: Array<{ food: Food; reason: string; synergyBoost: number }> = [];

  for (const food of foods) {
    if (currentFoods.includes(food.name)) continue;

    // Check if food is appropriate for this meal time
    if (!food.timing.includes('any-meal') && !food.timing.includes(mealType)) {
      continue;
    }

    let synergyBoost = 0;
    const reasons: string[] = [];

    // Check synergies with current foods
    for (const currentFood of currentFoodObjects) {
      const currentSynergies = currentFood.synergies.map(s => s.toLowerCase());
      const foodSynergies = food.synergies.map(s => s.toLowerCase());

      if (currentSynergies.some(s => food.name.toLowerCase().includes(s))) {
        synergyBoost += 10;
        reasons.push(`Synergizes with ${currentFood.name}`);
      }

      if (foodSynergies.some(s => currentFood.name.toLowerCase().includes(s))) {
        synergyBoost += 10;
        reasons.push(`Complements ${currentFood.name}`);
      }
    }

    // Check if it fills a missing category
    const currentCategories = new Set<string>();
    currentFoodObjects.forEach(f =>
      f.categories.forEach(cat => currentCategories.add(cat))
    );

    const newCategories = food.categories.filter(cat => !currentCategories.has(cat));
    if (newCategories.length > 0) {
      synergyBoost += newCategories.length * 5;
      reasons.push(`Adds new categories: ${newCategories.join(', ')}`);
    }

    if (synergyBoost > 0) {
      suggestions.push({
        food,
        reason: reasons.join('; '),
        synergyBoost,
      });
    }
  }

  return suggestions.sort((a, b) => b.synergyBoost - a.synergyBoost).slice(0, 5);
}
