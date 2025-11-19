import type {
  Food,
  FoodCategory,
  FoodSynergyScore,
  MealSynergyAnalysis,
  Recipe,
  RecipeCategory,
} from '../types/index';
import { loadFoods } from './dataLoader';

/**
 * Calculate synergy score between two foods
 */
export function calculateFoodSynergy(food1: Food, food2: Food): FoodSynergyScore {
  let score = 0;
  const reasons: string[] = [];
  const categoryMatches: FoodCategory[] = [];

  // Check for explicit synergy mentions
  const food1Synergies = food1.synergies.map(s => s.toLowerCase());
  const food2Synergies = food2.synergies.map(s => s.toLowerCase());

  if (food1Synergies.some(s => food2.name.toLowerCase().includes(s) || s.includes(food2.name.toLowerCase()))) {
    score += 10;
    reasons.push(`${food1.name} explicitly synergizes with ${food2.name}`);
  }

  if (food2Synergies.some(s => food1.name.toLowerCase().includes(s) || s.includes(food1.name.toLowerCase()))) {
    score += 10;
    reasons.push(`${food2.name} explicitly synergizes with ${food1.name}`);
  }

  // Check for category overlaps
  const sharedCategories = food1.categories.filter(cat =>
    food2.categories.includes(cat)
  );

  if (sharedCategories.length > 0) {
    score += sharedCategories.length * 3;
    categoryMatches.push(...sharedCategories);
    reasons.push(`Share ${sharedCategories.length} beneficial categories`);
  }

  // Check complementary categories
  const complementaryPairs: [FoodCategory, FoodCategory][] = [
    ['greens', 'rich-in-legumes'],
    ['greens', 'rich-in-whole-grains'],
    ['rich-in-legumes', 'rich-in-vegetables'],
    ['high-fiber', 'anti-inflammatory'],
    ['low-glycemic', 'high-fiber'],
    ['herbs-and-spices', 'rich-in-vegetables'],
    ['appetite-suppression', 'high-fiber'],
  ];

  for (const [cat1, cat2] of complementaryPairs) {
    if (
      (food1.categories.includes(cat1) && food2.categories.includes(cat2)) ||
      (food1.categories.includes(cat2) && food2.categories.includes(cat1))
    ) {
      score += 5;
      reasons.push(`Complementary: ${cat1} + ${cat2}`);
    }
  }

  // Check for timing compatibility
  const compatibleTimings = food1.timing.filter(t =>
    food2.timing.includes(t) && t !== 'any-meal'
  );

  if (compatibleTimings.length > 0) {
    score += compatibleTimings.length * 2;
    reasons.push(`Best consumed together at: ${compatibleTimings.join(', ')}`);
  }

  return {
    food1: food1.name,
    food2: food2.name,
    score,
    reasons,
    categoryMatches,
  };
}

/**
 * Extract food names from recipe ingredients
 */
export function extractFoodNamesFromRecipe(recipe: Recipe, foods: Food[]): string[] {
  const foundFoods: string[] = [];

  for (const ingredient of recipe.ingredients) {
    const ingredientName = ingredient.name.toLowerCase();

    for (const food of foods) {
      const foodName = food.name.toLowerCase();

      // Check if ingredient contains food name or vice versa
      if (
        ingredientName.includes(foodName) ||
        foodName.includes(ingredientName) ||
        food.properties.some(prop =>
          prop.toLowerCase().includes(ingredientName)
        )
      ) {
        if (!foundFoods.includes(food.name)) {
          foundFoods.push(food.name);
        }
      }
    }
  }

  return foundFoods;
}

/**
 * Analyze synergies in a meal (single recipe)
 */
export async function analyzeMealSynergies(recipe: Recipe): Promise<MealSynergyAnalysis> {
  const foods = await loadFoods();
  const foodNames = extractFoodNamesFromRecipe(recipe, foods);
  const foodObjects = foods.filter(f => foodNames.includes(f.name));

  const synergyPairs: FoodSynergyScore[] = [];
  let totalScore = 0;

  // Calculate all pairwise synergies
  for (let i = 0; i < foodObjects.length; i++) {
    for (let j = i + 1; j < foodObjects.length; j++) {
      const synergy = calculateFoodSynergy(foodObjects[i], foodObjects[j]);
      if (synergy.score > 0) {
        synergyPairs.push(synergy);
        totalScore += synergy.score;
      }
    }
  }

  // Calculate category balance
  const categoryBalance: Record<FoodCategory, number> = {} as any;
  for (const food of foodObjects) {
    for (const category of food.categories) {
      categoryBalance[category] = (categoryBalance[category] || 0) + 1;
    }
  }

  // Check timing optimization
  const mealCategory = recipe.category;
  const timingOptimal = foodObjects.every(food => {
    if (food.timing.includes('any-meal')) return true;

    // Map recipe category to meal timing
    if (mealCategory === 'breakfast' && food.timing.includes('breakfast')) return true;
    if (mealCategory === 'lunch' && food.timing.includes('lunch')) return true;
    if (mealCategory === 'dinner' && food.timing.includes('dinner')) return true;
    if (mealCategory === 'snack' && food.timing.includes('snacks')) return true;

    return false;
  });

  // Generate recommendations
  const recommendations: string[] = [];

  if (!timingOptimal) {
    recommendations.push('Some foods might be more effective at different meal times');
  }

  if (Object.keys(categoryBalance).length < 3) {
    recommendations.push('Consider adding more diverse food categories for better synergy');
  }

  if (!categoryBalance['anti-inflammatory']) {
    recommendations.push('Add anti-inflammatory foods like turmeric, ginger, or greens');
  }

  if (!categoryBalance['high-fiber']) {
    recommendations.push('Include high-fiber foods like beans, oats, or flaxseeds');
  }

  return {
    totalScore,
    foodsIncluded: foodNames,
    synergyPairs,
    categoryBalance,
    timingOptimal,
    recommendations,
  };
}

/**
 * Analyze synergies for multiple meals in a day
 */
export async function analyzeDaySynergies(
  breakfast?: Recipe,
  lunch?: Recipe,
  dinner?: Recipe,
  snacks?: Recipe[]
): Promise<MealSynergyAnalysis> {
  const foods = await loadFoods();
  const allRecipes = [breakfast, lunch, dinner, ...(snacks || [])].filter(
    (r): r is Recipe => r !== undefined
  );

  // Collect all foods from all meals
  const allFoodNames = new Set<string>();
  for (const recipe of allRecipes) {
    const foodNames = extractFoodNamesFromRecipe(recipe, foods);
    foodNames.forEach(name => allFoodNames.add(name));
  }

  const foodObjects = foods.filter(f => allFoodNames.has(f.name));

  const synergyPairs: FoodSynergyScore[] = [];
  let totalScore = 0;

  // Calculate all pairwise synergies across the day
  for (let i = 0; i < foodObjects.length; i++) {
    for (let j = i + 1; j < foodObjects.length; j++) {
      const synergy = calculateFoodSynergy(foodObjects[i], foodObjects[j]);
      if (synergy.score > 0) {
        synergyPairs.push(synergy);
        totalScore += synergy.score;
      }
    }
  }

  // Calculate category balance
  const categoryBalance: Record<FoodCategory, number> = {} as any;
  for (const food of foodObjects) {
    for (const category of food.categories) {
      categoryBalance[category] = (categoryBalance[category] || 0) + 1;
    }
  }

  // Check Daily Dozen compliance
  const recommendations: string[] = [];

  if (!categoryBalance['rich-in-legumes'] || categoryBalance['rich-in-legumes'] < 3) {
    recommendations.push('Daily Dozen: Need 3 servings of beans/legumes');
  }

  if (!categoryBalance['greens'] || categoryBalance['greens'] < 2) {
    recommendations.push('Daily Dozen: Need 2 servings of greens');
  }

  if (!categoryBalance['rich-in-whole-grains'] || categoryBalance['rich-in-whole-grains'] < 3) {
    recommendations.push('Daily Dozen: Need 3 servings of whole grains');
  }

  if (!categoryBalance['rich-in-fruits']) {
    recommendations.push('Daily Dozen: Include berries or other fruits');
  }

  if (!categoryBalance['anti-inflammatory']) {
    recommendations.push('Add anti-inflammatory herbs and spices');
  }

  // Check for vinegar (21 Tweaks)
  const hasVinegar = foodObjects.some(f =>
    f.name.toLowerCase().includes('vinegar')
  );
  if (!hasVinegar) {
    recommendations.push('21 Tweaks: Add 2 tsp vinegar with each meal');
  }

  return {
    totalScore,
    foodsIncluded: Array.from(allFoodNames),
    synergyPairs,
    categoryBalance,
    timingOptimal: true, // Already distributed across meals
    recommendations,
  };
}

/**
 * Score a weekly menu based on food synergies
 */
export async function scoreWeeklyMenu(
  days: Array<{
    breakfast?: Recipe;
    lunch?: Recipe;
    dinner?: Recipe;
    snacks?: Recipe[];
  }>
): Promise<number> {
  let totalScore = 0;

  for (const day of days) {
    const analysis = await analyzeDaySynergies(
      day.breakfast,
      day.lunch,
      day.dinner,
      day.snacks
    );
    totalScore += analysis.totalScore;
  }

  return totalScore;
}
