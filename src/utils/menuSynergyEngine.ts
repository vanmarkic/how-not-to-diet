/**
 * Menu Builder Synergy Engine
 *
 * Calculates food suggestions based on synergies within a single meal.
 * Implements the design specified in docs/plans/2025-01-19-menu-builder-design.md
 */

// ============================================================================
// Types
// ============================================================================

export interface Food {
  id: string;
  name: string;
  categories: string[];
  properties: string[];
  benefits: string | string[];
  synergies: string[];
  conflicts?: string[];
  timing: string[];
  amount: string;
  sources: {
    pages: number[];
    quotes: string[];
  };
}

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export type SuggestionCategory = 'excellent' | 'good' | 'neutral';

export interface SynergyBreakdown {
  withFood: string;
  score: number;
}

export interface RankedSuggestion {
  food: Food;
  synergyScore: number;
  category: SuggestionCategory;
  breakdown: SynergyBreakdown[];
}

// ============================================================================
// Core Engine Functions
// ============================================================================

/**
 * Load all foods from the aggregated bundle
 */
export async function loadFoodsBundle(): Promise<Food[]> {
  try {
    const response = await fetch('/how-not-to-diet/foods-bundle.json');
    const data = await response.json();
    return data.foods || [];
  } catch (error) {
    console.error('Failed to load foods bundle:', error);
    return [];
  }
}

/**
 * Build a synergy lookup map for O(1) access
 *
 * Map structure: foodName (lowercase) -> Set<foodName (lowercase)>
 * This allows fast checking if food A synergizes with food B
 */
export function buildSynergyMap(foods: Food[]): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();

  for (const food of foods) {
    const foodNameLower = food.name.toLowerCase();
    const synergies = new Set<string>();

    // Add all synergies (normalized to lowercase)
    for (const synergy of food.synergies) {
      synergies.add(synergy.toLowerCase());
    }

    map.set(foodNameLower, synergies);
  }

  return map;
}

/**
 * Get synergy score between two foods
 *
 * Bidirectional check: A synergizes with B OR B synergizes with A
 * Default score is 10 for an explicit synergy match
 */
export function getSynergyScore(
  foodA: Food,
  foodB: Food,
  synergyMap: Map<string, Set<string>>
): number {
  const nameA = foodA.name.toLowerCase();
  const nameB = foodB.name.toLowerCase();

  const synergiesA = synergyMap.get(nameA) || new Set();
  const synergiesB = synergyMap.get(nameB) || new Set();

  // Check if foodA lists foodB as a synergy (exact match)
  if (synergiesA.has(nameB)) {
    return 10;
  }

  // Check if foodB lists foodA as a synergy (exact match)
  if (synergiesB.has(nameA)) {
    return 10;
  }

  // Check for partial matches in synergies (e.g., "vegetables" matches "bean sprouts")
  for (const synergy of synergiesA) {
    // Check if synergy string contains the other food's name
    if (nameB.includes(synergy) || synergy.includes(nameB)) {
      return 8;
    }

    // Check category matches (e.g., "vegetables" synergy + foodB is in vegetables category)
    if (foodB.categories.some(cat => cat.includes(synergy) || synergy.includes(cat))) {
      return 6;
    }
  }

  for (const synergy of synergiesB) {
    if (nameA.includes(synergy) || synergy.includes(nameA)) {
      return 8;
    }

    if (foodA.categories.some(cat => cat.includes(synergy) || synergy.includes(cat))) {
      return 6;
    }
  }

  // No synergy found
  return 0;
}

/**
 * Calculate synergy suggestions for a meal
 *
 * @param selectedFoodIds - IDs of foods already in the meal
 * @param mealType - breakfast, lunch, or dinner
 * @param allFoods - Complete list of available foods
 * @param synergyMap - Pre-built synergy lookup map
 * @returns Ranked suggestions with scores and categories
 */
export function calculateSuggestions(
  selectedFoodIds: string[],
  mealType: MealType,
  allFoods: Food[],
  synergyMap: Map<string, Set<string>>
): RankedSuggestion[] {
  // Handle edge case: no selected foods yet
  if (selectedFoodIds.length === 0) {
    // Return meal-appropriate foods, prioritizing meal-specific over any-meal
    const mealAppropriateFoods = filterByMealTiming(allFoods, mealType);

    const scoredFoods = mealAppropriateFoods.map(food => {
      let score = 0;
      const isMealSpecific = food.timing.includes(mealType);
      const isAnyMeal = food.timing.includes('any-meal');

      if (isMealSpecific && !isAnyMeal) {
        score = 15; // Meal-specific foods appear first
      } else if (isMealSpecific && isAnyMeal) {
        score = 8; // Both tagged foods appear second
      }
      // any-meal only foods get 0 (appear last)

      return {
        food,
        synergyScore: score,
        category: 'neutral' as SuggestionCategory,
        breakdown: [],
      };
    });

    return scoredFoods
      .sort((a, b) => b.synergyScore - a.synergyScore)
      .slice(0, 20); // Limit initial suggestions
  }

  // Step 1: Filter candidates
  const selectedFoodIdSet = new Set(selectedFoodIds);
  const selectedFoods = allFoods.filter(f => selectedFoodIdSet.has(f.id));

  const candidates = allFoods.filter(food => {
    // Exclude already-selected foods
    if (selectedFoodIdSet.has(food.id)) {
      return false;
    }

    // Apply meal timing constraint
    if (!isFoodAppropriateForMeal(food, mealType)) {
      return false;
    }

    return true;
  });

  // Step 2: Calculate synergy scores
  const scoredCandidates: RankedSuggestion[] = candidates.map(candidate => {
    let totalScore = 0;
    const breakdown: SynergyBreakdown[] = [];

    for (const selectedFood of selectedFoods) {
      const score = getSynergyScore(candidate, selectedFood, synergyMap);
      totalScore += score;

      if (score > 0) {
        breakdown.push({
          withFood: selectedFood.name,
          score,
        });
      }
    }

    // Boost score for meal-specific foods (prioritize over 'any-meal' foods)
    const isMealSpecific = candidate.timing.includes(mealType);
    const isAnyMeal = candidate.timing.includes('any-meal');

    if (isMealSpecific && !isAnyMeal) {
      // Meal-specific foods get a significant boost
      totalScore += 15;
    } else if (isMealSpecific && isAnyMeal) {
      // Foods tagged for both get a smaller boost
      totalScore += 8;
    }
    // any-meal only foods get no boost (appear last)

    // Apply category diversity penalty to avoid redundant suggestions
    // Count how many selected foods share categories with this candidate
    const categoryOverlap = new Set<string>();
    for (const selectedFood of selectedFoods) {
      for (const category of candidate.categories) {
        if (selectedFood.categories.includes(category)) {
          categoryOverlap.add(category);
        }
      }
    }

    // Heavy penalty for category redundancy
    // Examples: Don't suggest more beans if there are already beans,
    // don't suggest more greens if there are already greens, etc.
    const overlapCount = categoryOverlap.size;
    if (overlapCount > 0) {
      // Penalize based on how many category overlaps exist
      // 1 overlap = -12 points, 2 overlaps = -24 points, etc.
      totalScore -= overlapCount * 12;
    }

    return {
      food: candidate,
      synergyScore: totalScore,
      category: 'neutral' as SuggestionCategory, // Will categorize in next step
      breakdown,
    };
  });

  // Step 3: Rank and categorize
  const rankedSuggestions = scoredCandidates
    .sort((a, b) => b.synergyScore - a.synergyScore)
    .map((suggestion, index) => {
      let category: SuggestionCategory = 'neutral';

      if (index < 3 && suggestion.synergyScore >= 8) {
        category = 'excellent';
      } else if (index < 8 && suggestion.synergyScore >= 3) {
        category = 'good';
      }

      return {
        ...suggestion,
        category,
      };
    });

  return rankedSuggestions;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a food is appropriate for a specific meal type
 *
 * Foods with 'any-meal' timing are always appropriate
 * Otherwise, timing array must include the specific meal type
 */
export function isFoodAppropriateForMeal(food: Food, mealType: MealType): boolean {
  // 'any-meal' is always appropriate
  if (food.timing.includes('any-meal')) {
    return true;
  }

  // Check for explicit meal type
  return food.timing.includes(mealType);
}

/**
 * Filter foods by meal timing
 */
export function filterByMealTiming(foods: Food[], mealType: MealType): Food[] {
  return foods.filter(food => isFoodAppropriateForMeal(food, mealType));
}

/**
 * Get category display properties
 */
export function getCategoryDisplay(category: SuggestionCategory): {
  label: string;
  emoji: string;
  color: string;
} {
  switch (category) {
    case 'excellent':
      return {
        label: 'Excellent pairing',
        emoji: '⭐',
        color: 'green',
      };
    case 'good':
      return {
        label: 'Good pairing',
        emoji: '✓',
        color: 'blue',
      };
    case 'neutral':
      return {
        label: '',
        emoji: '',
        color: 'gray',
      };
  }
}

// ============================================================================
// Example Usage (for testing)
// ============================================================================

export async function runExample() {
  console.log('Loading foods bundle...');
  const foods = await loadFoodsBundle();
  console.log(`Loaded ${foods.length} foods`);

  const synergyMap = buildSynergyMap(foods);
  console.log(`Built synergy map with ${synergyMap.size} entries`);

  // Example: User selects "Oats" for breakfast
  const oats = foods.find(f => f.name.toLowerCase().includes('oat'));
  if (!oats) {
    console.log('Oats not found');
    return;
  }

  console.log(`\nSelected food: ${oats.name}`);
  console.log(`Synergies: ${oats.synergies.join(', ')}`);

  const suggestions = calculateSuggestions(
    [oats.id],
    'breakfast',
    foods,
    synergyMap
  );

  console.log(`\nTop 10 suggestions for breakfast with ${oats.name}:`);
  suggestions.slice(0, 10).forEach((suggestion, index) => {
    const display = getCategoryDisplay(suggestion.category);
    console.log(
      `${index + 1}. ${display.emoji} ${suggestion.food.name} (Score: ${suggestion.synergyScore})`
    );

    if (suggestion.breakdown.length > 0) {
      suggestion.breakdown.forEach(({ withFood, score }) => {
        console.log(`     +${score} with ${withFood}`);
      });
    }
  });
}
