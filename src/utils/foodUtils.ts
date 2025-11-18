/**
 * Food Utilities
 *
 * Utilities for working with food data including synergy analysis,
 * filtering, searching, and transformation functions.
 */

import type { Food, FoodCategory, MealTiming, FoodSynergyScore } from '../types/index';
import type { Food as SuggestionFood, FoodSynergy } from './suggestions';

// ============================================================================
// Synergy Relationship Building
// ============================================================================

/**
 * Build a synergy relationship map from food data
 *
 * Converts the string-based synergies in food data to scored relationships
 * that can be used by the suggestion algorithm.
 *
 * @param foods - Array of all foods with synergy data
 * @returns Array of FoodSynergy relationships with scores
 *
 * @example
 * ```ts
 * const foods = await loadFoods();
 * const synergies = buildSynergyMap(foods);
 * // Use synergies with suggestion algorithm
 * const suggestions = getTopSuggestions(selected, foods, synergies);
 * ```
 */
export function buildSynergyMap(foods: Food[]): FoodSynergy[] {
  const synergyMap: FoodSynergy[] = [];
  const processedPairs = new Set<string>();

  // Create a name-to-id lookup for synergy matching
  const foodNameToId = new Map<string, string>();
  const foodIdToName = new Map<string, string>();

  foods.forEach(food => {
    foodNameToId.set(food.name.toLowerCase(), food.id);
    foodIdToName.set(food.id, food.name);
  });

  foods.forEach(food => {
    // Process explicit synergies
    food.synergies.forEach(synergyName => {
      const synergyLower = synergyName.toLowerCase();

      // Try exact match first
      let partnerId = foodNameToId.get(synergyLower);

      // If no exact match, try partial matching
      if (!partnerId) {
        for (const [name, id] of Array.from(foodNameToId.entries())) {
          if (name.includes(synergyLower) || synergyLower.includes(name)) {
            partnerId = id;
            break;
          }
        }
      }

      if (partnerId && partnerId !== food.id) {
        const pairKey = [food.id, partnerId].sort().join(':');

        if (!processedPairs.has(pairKey)) {
          processedPairs.add(pairKey);

          // Normalize IDs (smaller first)
          const [foodId1, foodId2] = [food.id, partnerId].sort();

          synergyMap.push({
            foodId1,
            foodId2,
            score: 5, // Default positive synergy score
            reason: `Recommended pairing from ${foodIdToName.get(food.id)}`,
          });
        }
      }
    });

    // Process conflicts as negative synergies
    food.conflicts.forEach(conflictName => {
      const conflictLower = conflictName.toLowerCase();
      const partnerId = foodNameToId.get(conflictLower);

      if (partnerId && partnerId !== food.id) {
        const pairKey = [food.id, partnerId].sort().join(':');

        if (!processedPairs.has(pairKey)) {
          processedPairs.add(pairKey);

          const [foodId1, foodId2] = [food.id, partnerId].sort();

          synergyMap.push({
            foodId1,
            foodId2,
            score: -3, // Negative score for conflicts
            reason: `Avoid combining ${foodIdToName.get(food.id)} with ${conflictName}`,
          });
        }
      }
    });
  });

  // Add category-based synergies
  addCategoryBasedSynergies(foods, synergyMap, processedPairs, foodIdToName);

  return synergyMap;
}

/**
 * Add synergies based on shared food categories
 *
 * Foods in complementary categories get positive synergies.
 * Internal helper for buildSynergyMap.
 */
function addCategoryBasedSynergies(
  foods: Food[],
  synergyMap: FoodSynergy[],
  processedPairs: Set<string>,
  foodIdToName: Map<string, string>
): void {
  // Category compatibility rules
  const categoryPairs: Record<FoodCategory, FoodCategory[]> = {
    'rich-in-legumes': ['rich-in-vegetables', 'greens', 'rich-in-whole-grains'],
    'rich-in-vegetables': ['rich-in-legumes', 'rich-in-fruits', 'greens'],
    'greens': ['rich-in-legumes', 'rich-in-vegetables', 'rich-in-fruits'],
    'rich-in-fruits': ['rich-in-vegetables', 'greens', 'rich-in-whole-grains'],
    'rich-in-whole-grains': ['rich-in-legumes', 'rich-in-fruits'],
    'anti-inflammatory': ['anti-inflammatory', 'high-fiber'],
    'high-fiber': ['anti-inflammatory', 'low-glycemic'],
    'low-glycemic': ['high-fiber', 'anti-inflammatory'],
    'herbs-and-spices': ['rich-in-vegetables', 'rich-in-legumes'],
    'appetite-suppression': ['high-fiber', 'low-glycemic'],
    'weight-loss-booster': ['appetite-suppression', 'low-glycemic'],
    'cruciferous': ['greens', 'rich-in-vegetables'],
    'high-water-rich': ['rich-in-vegetables', 'rich-in-fruits'],
  };

  for (let i = 0; i < foods.length; i++) {
    for (let j = i + 1; j < foods.length; j++) {
      const food1 = foods[i];
      const food2 = foods[j];
      const pairKey = [food1.id, food2.id].sort().join(':');

      // Skip if already processed
      if (processedPairs.has(pairKey)) {
        continue;
      }

      // Check for category matches
      let categoryScore = 0;
      const matchingCategories: FoodCategory[] = [];

      food1.categories.forEach(cat1 => {
        const compatibleCategories = categoryPairs[cat1] || [];
        food2.categories.forEach(cat2 => {
          if (compatibleCategories.includes(cat2)) {
            categoryScore += 2;
            matchingCategories.push(cat1);
          }
        });
      });

      if (categoryScore > 0) {
        processedPairs.add(pairKey);
        const [foodId1, foodId2] = [food1.id, food2.id].sort();

        synergyMap.push({
          foodId1,
          foodId2,
          score: categoryScore,
          reason: `Complementary nutritional profiles (${matchingCategories.join(', ')})`,
        });
      }
    }
  }
}

/**
 * Calculate detailed synergy score between foods
 *
 * @param food1 - First food
 * @param food2 - Second food
 * @param allFoods - Complete food database for lookup
 * @returns Detailed synergy score with breakdown
 *
 * @example
 * ```ts
 * const kale = await loadFoodById('food-2');
 * const beans = await loadFoodById('food-1');
 * const score = calculateFoodSynergyScore(kale, beans, allFoods);
 * console.log(score.score); // 7
 * console.log(score.reasons); // ["Recommended pairing", "Category match: anti-inflammatory"]
 * ```
 */
export function calculateFoodSynergyScore(
  food1: Food,
  food2: Food,
  allFoods: Food[]
): FoodSynergyScore {
  const synergies = buildSynergyMap(allFoods);
  const pairKey = [food1.id, food2.id].sort().join(':');

  let score = 0;
  const reasons: string[] = [];
  const categoryMatches: FoodCategory[] = [];

  // Find synergy in map
  const synergy = synergies.find(s =>
    [s.foodId1, s.foodId2].sort().join(':') === pairKey
  );

  if (synergy) {
    score = synergy.score;
    if (synergy.reason) {
      reasons.push(synergy.reason);
    }
  }

  // Find category overlaps
  const sharedCategories = food1.categories.filter(cat =>
    food2.categories.includes(cat)
  );

  sharedCategories.forEach(cat => {
    categoryMatches.push(cat);
    reasons.push(`Both are ${cat}`);
  });

  return {
    food1: food1.name,
    food2: food2.name,
    score,
    reasons,
    categoryMatches,
  };
}

// ============================================================================
// Food Filtering and Search
// ============================================================================

/**
 * Filter foods by multiple criteria
 *
 * @param foods - Array of foods to filter
 * @param options - Filter criteria
 * @returns Filtered array of foods
 *
 * @example
 * ```ts
 * const filtered = filterFoods(allFoods, {
 *   categories: ['anti-inflammatory'],
 *   timing: ['breakfast'],
 *   searchQuery: 'oat'
 * });
 * ```
 */
export function filterFoods(
  foods: Food[],
  options: {
    categories?: FoodCategory[];
    timing?: MealTiming[];
    searchQuery?: string;
    excludeIds?: string[];
  }
): Food[] {
  let filtered = foods;

  // Filter by categories (OR logic - match any category)
  if (options.categories && options.categories.length > 0) {
    filtered = filtered.filter(food =>
      options.categories!.some(cat => food.categories.includes(cat))
    );
  }

  // Filter by timing (OR logic - match any timing)
  if (options.timing && options.timing.length > 0) {
    filtered = filtered.filter(food =>
      options.timing!.some(time => food.timing.includes(time))
    );
  }

  // Filter by search query
  if (options.searchQuery) {
    const query = options.searchQuery.toLowerCase();
    filtered = filtered.filter(food =>
      food.name.toLowerCase().includes(query) ||
      food.benefits.toLowerCase().includes(query) ||
      food.properties.some(prop => prop.toLowerCase().includes(query))
    );
  }

  // Exclude specific IDs
  if (options.excludeIds && options.excludeIds.length > 0) {
    const excludeSet = new Set(options.excludeIds);
    filtered = filtered.filter(food => !excludeSet.has(food.id));
  }

  return filtered;
}

/**
 * Search foods by text query
 *
 * Searches across name, benefits, and properties.
 *
 * @param foods - Array of foods to search
 * @param query - Search query string
 * @returns Foods matching the query
 *
 * @example
 * ```ts
 * const results = searchFoods(allFoods, 'anti-inflammatory');
 * ```
 */
export function searchFoods(foods: Food[], query: string): Food[] {
  return filterFoods(foods, { searchQuery: query });
}

/**
 * Get foods by category
 *
 * @param foods - Array of foods to filter
 * @param category - Category to filter by
 * @returns Foods in the specified category
 */
export function getFoodsByCategory(foods: Food[], category: FoodCategory): Food[] {
  return foods.filter(food => food.categories.includes(category));
}

/**
 * Get foods by meal timing
 *
 * @param foods - Array of foods to filter
 * @param timing - Meal timing to filter by
 * @returns Foods appropriate for the specified timing
 */
export function getFoodsByTiming(foods: Food[], timing: MealTiming): Food[] {
  return foods.filter(food => food.timing.includes(timing));
}

/**
 * Get food by ID with error handling
 *
 * @param foods - Array of foods to search
 * @param id - Food ID to find
 * @returns Food object or null if not found
 */
export function getFoodById(foods: Food[], id: string): Food | null {
  return foods.find(food => food.id === id) || null;
}

// ============================================================================
// Data Transformation Functions
// ============================================================================

/**
 * Convert Food to SuggestionFood format
 *
 * Transforms extracted food data to the format expected by the suggestion algorithm.
 *
 * @param food - Food from extracted data
 * @returns SuggestionFood compatible with the algorithm
 *
 * @example
 * ```ts
 * const extractedFood = await loadFoodById('food-1');
 * const suggestionFood = convertToSuggestionFood(extractedFood);
 * // Use with suggestion algorithm
 * const suggestions = getTopSuggestions([suggestionFood], ...);
 * ```
 */
export function convertToSuggestionFood(food: Food): SuggestionFood {
  // Map extracted food timing to allowed meal types
  const allowedMealTypes = food.timing
    .map(timing => mapTimingToMealType(timing))
    .filter((type): type is 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'any' =>
      type !== null
    );

  // Get primary category for the food
  const category = food.categories[0] || 'rich-in-vegetables';

  return {
    id: food.id,
    name: food.name,
    category,
    allowedMealTypes: allowedMealTypes.length > 0 ? allowedMealTypes : ['any'],
  };
}

/**
 * Convert multiple foods to SuggestionFood format
 *
 * @param foods - Array of foods to convert
 * @returns Array of SuggestionFood objects
 */
export function convertToSuggestionFoods(foods: Food[]): SuggestionFood[] {
  return foods.map(convertToSuggestionFood);
}

/**
 * Map MealTiming to MealType for suggestion algorithm
 *
 * Internal helper to convert timing strings to meal types.
 */
function mapTimingToMealType(
  timing: MealTiming
): 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'any' | null {
  switch (timing) {
    case 'breakfast':
      return 'breakfast';
    case 'lunch':
      return 'lunch';
    case 'dinner':
      return 'dinner';
    case 'snacks':
      return 'snack';
    case 'any-meal':
    case 'with-each-meal':
    case 'daily':
      return 'any';
    default:
      return null;
  }
}

// ============================================================================
// Formatting and Display Utilities
// ============================================================================

/**
 * Format food properties for display
 *
 * @param food - Food to format
 * @returns Formatted display object
 *
 * @example
 * ```ts
 * const display = formatFoodForDisplay(kale);
 * console.log(display.title); // "Kale"
 * console.log(display.categoryTags); // ["Cruciferous", "Greens", "Anti-Inflammatory"]
 * ```
 */
export function formatFoodForDisplay(food: Food): {
  title: string;
  subtitle: string;
  categoryTags: string[];
  timingInfo: string;
  servingInfo: string;
  benefits: string;
  keyProperties: string[];
  synergyPartners: string[];
} {
  return {
    title: food.name,
    subtitle: food.benefits.substring(0, 100) + (food.benefits.length > 100 ? '...' : ''),
    categoryTags: food.categories.map(formatCategoryName),
    timingInfo: formatTimingInfo(food.timing),
    servingInfo: food.amount,
    benefits: food.benefits,
    keyProperties: food.properties.slice(0, 3), // Top 3 properties
    synergyPartners: food.synergies.map(s => capitalizeWords(s)),
  };
}

/**
 * Format category name for display
 *
 * Converts kebab-case to Title Case
 *
 * @example
 * formatCategoryName('anti-inflammatory') // "Anti-Inflammatory"
 */
export function formatCategoryName(category: FoodCategory): string {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format timing information for display
 *
 * @example
 * formatTimingInfo(['breakfast', 'any-meal']) // "Breakfast, Anytime"
 */
export function formatTimingInfo(timing: MealTiming[]): string {
  if (timing.includes('any-meal')) {
    return 'Anytime';
  }

  return timing
    .map(t => {
      switch (t) {
        case 'breakfast': return 'Breakfast';
        case 'lunch': return 'Lunch';
        case 'dinner': return 'Dinner';
        case 'snacks': return 'Snacks';
        case 'with-each-meal': return 'With each meal';
        case 'earlier-in-meal': return 'Earlier in meal';
        case 'in-cooking': return 'In cooking';
        case 'daily': return 'Daily';
        default: return capitalizeWords(t.replace(/-/g, ' '));
      }
    })
    .join(', ');
}

/**
 * Capitalize words in a string
 */
function capitalizeWords(str: string): string {
  return str
    .split(/[\s-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get category color for UI theming
 *
 * @param category - Food category
 * @returns Tailwind color class or hex color
 *
 * @example
 * getCategoryColor('anti-inflammatory') // "bg-red-100"
 */
export function getCategoryColor(category: FoodCategory): string {
  const colorMap: Record<FoodCategory, string> = {
    'anti-inflammatory': 'bg-red-100',
    'high-fiber': 'bg-amber-100',
    'low-glycemic': 'bg-green-100',
    'rich-in-legumes': 'bg-yellow-100',
    'rich-in-vegetables': 'bg-green-200',
    'rich-in-fruits': 'bg-pink-100',
    'rich-in-whole-grains': 'bg-amber-200',
    'greens': 'bg-emerald-100',
    'cruciferous': 'bg-teal-100',
    'herbs-and-spices': 'bg-purple-100',
    'appetite-suppression': 'bg-blue-100',
    'weight-loss-booster': 'bg-indigo-100',
    'high-water-rich': 'bg-cyan-100',
  };

  return colorMap[category] || 'bg-gray-100';
}

// ============================================================================
// Statistical and Analysis Functions
// ============================================================================

/**
 * Get category distribution across foods
 *
 * @param foods - Array of foods to analyze
 * @returns Object mapping categories to food counts
 *
 * @example
 * ```ts
 * const distribution = getCategoryDistribution(allFoods);
 * console.log(distribution['anti-inflammatory']); // 8
 * ```
 */
export function getCategoryDistribution(foods: Food[]): Record<FoodCategory, number> {
  const distribution: Partial<Record<FoodCategory, number>> = {};

  foods.forEach(food => {
    food.categories.forEach(category => {
      distribution[category] = (distribution[category] || 0) + 1;
    });
  });

  return distribution as Record<FoodCategory, number>;
}

/**
 * Get most common synergy partners across all foods
 *
 * @param foods - Array of foods to analyze
 * @returns Array of [food name, mention count] sorted by frequency
 *
 * @example
 * ```ts
 * const partners = getTopSynergyPartners(allFoods, 5);
 * // [['vegetables', 12], ['beans', 8], ...]
 * ```
 */
export function getTopSynergyPartners(
  foods: Food[],
  limit: number = 10
): Array<[string, number]> {
  const partnerCounts = new Map<string, number>();

  foods.forEach(food => {
    food.synergies.forEach(partner => {
      const normalized = partner.toLowerCase();
      partnerCounts.set(normalized, (partnerCounts.get(normalized) || 0) + 1);
    });
  });

  return Array.from(partnerCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

/**
 * Check if two foods have a synergy relationship
 *
 * @param food1 - First food
 * @param food2 - Second food
 * @returns True if foods have synergy, false otherwise
 */
export function haveSynergy(food1: Food, food2: Food): boolean {
  const food2NameLower = food2.name.toLowerCase();
  const food1NameLower = food1.name.toLowerCase();

  return (
    food1.synergies.some(s => s.toLowerCase().includes(food2NameLower)) ||
    food2.synergies.some(s => s.toLowerCase().includes(food1NameLower))
  );
}

/**
 * Check if two foods have a conflict
 *
 * @param food1 - First food
 * @param food2 - Second food
 * @returns True if foods conflict, false otherwise
 */
export function haveConflict(food1: Food, food2: Food): boolean {
  const food2NameLower = food2.name.toLowerCase();
  const food1NameLower = food1.name.toLowerCase();

  return (
    food1.conflicts.some(c => c.toLowerCase().includes(food2NameLower)) ||
    food2.conflicts.some(c => c.toLowerCase().includes(food1NameLower))
  );
}
