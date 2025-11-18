/**
 * Food Synergy Scoring Algorithm
 *
 * Suggests foods that pair well with user's selected foods based on
 * nutritional and flavor synergies.
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Meal timing context for filtering suggestions
 */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'any';

/**
 * A food item in the database
 */
export interface Food {
  id: string;
  name: string;
  category: string;
  allowedMealTypes: MealType[];
  // Future: nutritionalInfo, imageUrl, etc.
}

/**
 * A synergy relationship between two foods
 *
 * Scores indicate how well foods work together:
 * - Positive: beneficial combination (nutritional synergy, flavor pairing)
 * - Negative: conflict (nutrient competition, poor pairing)
 * - Zero: neutral/no known interaction
 */
export interface FoodSynergy {
  foodId1: string;  // Always the smaller ID (normalized)
  foodId2: string;  // Always the larger ID (normalized)
  score: number;
  reason?: string;  // Optional explanation for UI display
}

/**
 * Options for configuring suggestion algorithm
 */
export interface SuggestionOptions {
  /**
   * Maximum number of suggestions to return
   * @default 10
   */
  limit?: number;

  /**
   * Filter suggestions by meal type
   * @default undefined (no filtering)
   */
  mealContext?: MealType;

  /**
   * Minimum score threshold (exclude suggestions below this)
   * @default undefined (show all, even negative scores)
   */
  minScore?: number;

  /**
   * Food IDs to exclude from suggestions (e.g., allergies, dislikes)
   * @default []
   */
  excludeFoodIds?: string[];
}

/**
 * A suggested food with its calculated synergy score
 */
export interface FoodSuggestion {
  food: Food;
  totalScore: number;
  /**
   * Individual synergy contributions from each selected food
   * Useful for explaining why this food was suggested
   */
  synergyBreakdown: Array<{
    selectedFood: Food;
    score: number;
    reason?: string;
  }>;
}

// ============================================================================
// Core Algorithm Functions
// ============================================================================

/**
 * Calculate the total synergy score for a candidate food given selected foods
 *
 * @param candidateFood - The food to score
 * @param selectedFoods - Foods the user has already selected
 * @param synergies - All available synergy relationships
 * @returns Total synergy score (sum of all pairwise synergies)
 *
 * @example
 * ```ts
 * const score = calculateSynergyScore(
 *   walnuts,
 *   [spinach, blueberries],
 *   allSynergies
 * );
 * // Returns: 8 (if synergy(walnuts, spinach) = 5, synergy(walnuts, blueberries) = 3)
 * ```
 */
export function calculateSynergyScore(
  candidateFood: Food,
  selectedFoods: Food[],
  synergies: FoodSynergy[]
): number {
  // Create a lookup map for fast synergy access
  const synergyMap = buildSynergyMap(synergies);

  let totalScore = 0;

  for (const selectedFood of selectedFoods) {
    const synergyScore = getSynergyBetweenFoods(
      candidateFood.id,
      selectedFood.id,
      synergyMap
    );
    totalScore += synergyScore;
  }

  return totalScore;
}

/**
 * Calculate synergy score with detailed breakdown
 *
 * @param candidateFood - The food to score
 * @param selectedFoods - Foods the user has already selected
 * @param synergies - All available synergy relationships
 * @returns Object with total score and breakdown by selected food
 */
export function calculateSynergyScoreWithBreakdown(
  candidateFood: Food,
  selectedFoods: Food[],
  synergies: FoodSynergy[]
): {
  totalScore: number;
  breakdown: Array<{ selectedFood: Food; score: number; reason?: string }>;
} {
  const synergyMap = buildSynergyMap(synergies);
  let totalScore = 0;
  const breakdown: Array<{ selectedFood: Food; score: number; reason?: string }> = [];

  for (const selectedFood of selectedFoods) {
    const synergyEntry = getSynergyEntryBetweenFoods(
      candidateFood.id,
      selectedFood.id,
      synergyMap
    );

    const score = synergyEntry?.score ?? 0;
    totalScore += score;

    breakdown.push({
      selectedFood,
      score,
      reason: synergyEntry?.reason,
    });
  }

  return { totalScore, breakdown };
}

/**
 * Get top N food suggestions based on synergy with selected foods
 *
 * @param selectedFoods - Foods the user has already selected
 * @param allFoods - Complete database of available foods
 * @param synergies - All available synergy relationships
 * @param options - Configuration options for filtering and limiting results
 * @returns Ranked list of food suggestions with scores
 *
 * @example
 * ```ts
 * const suggestions = getTopSuggestions(
 *   [spinach, blueberries],
 *   foodDatabase,
 *   synergyDatabase,
 *   { limit: 5, mealContext: 'breakfast' }
 * );
 * // Returns top 5 breakfast foods that pair well with spinach and blueberries
 * ```
 */
export function getTopSuggestions(
  selectedFoods: Food[],
  allFoods: Food[],
  synergies: FoodSynergy[],
  options: SuggestionOptions = {}
): FoodSuggestion[] {
  const {
    limit = 10,
    mealContext,
    minScore,
    excludeFoodIds = [],
  } = options;

  // Handle edge case: no selected foods
  if (selectedFoods.length === 0) {
    // Return empty array or could return popular "starter" foods
    // For MVP, just return empty
    return [];
  }

  // Step 1: Filter candidates
  const selectedFoodIds = new Set(selectedFoods.map(f => f.id));
  const excludedIds = new Set(excludeFoodIds);

  const candidates = allFoods.filter(food => {
    // Exclude already-selected foods
    if (selectedFoodIds.has(food.id)) {
      return false;
    }

    // Exclude explicitly excluded foods
    if (excludedIds.has(food.id)) {
      return false;
    }

    // Apply meal timing constraint if specified
    if (mealContext && mealContext !== 'any') {
      if (!food.allowedMealTypes.includes(mealContext) &&
          !food.allowedMealTypes.includes('any')) {
        return false;
      }
    }

    return true;
  });

  // Step 2: Score each candidate
  const scoredCandidates: FoodSuggestion[] = candidates.map(candidate => {
    const { totalScore, breakdown } = calculateSynergyScoreWithBreakdown(
      candidate,
      selectedFoods,
      synergies
    );

    return {
      food: candidate,
      totalScore,
      synergyBreakdown: breakdown,
    };
  });

  // Step 3: Apply minimum score threshold if specified
  const filteredCandidates = minScore !== undefined
    ? scoredCandidates.filter(s => s.totalScore >= minScore)
    : scoredCandidates;

  // Step 4: Rank by score (descending) and limit results
  const rankedSuggestions = filteredCandidates
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit);

  return rankedSuggestions;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Build a lookup map for fast synergy access
 *
 * Map structure: "foodId1:foodId2" -> FoodSynergy
 * IDs are sorted to ensure consistent lookup regardless of order
 */
function buildSynergyMap(synergies: FoodSynergy[]): Map<string, FoodSynergy> {
  const map = new Map<string, FoodSynergy>();

  for (const synergy of synergies) {
    const key = getSynergyKey(synergy.foodId1, synergy.foodId2);
    map.set(key, synergy);
  }

  return map;
}

/**
 * Get synergy score between two foods (returns 0 if no relationship defined)
 */
function getSynergyBetweenFoods(
  foodId1: string,
  foodId2: string,
  synergyMap: Map<string, FoodSynergy>
): number {
  const entry = getSynergyEntryBetweenFoods(foodId1, foodId2, synergyMap);
  return entry?.score ?? 0;
}

/**
 * Get full synergy entry between two foods (returns undefined if no relationship)
 */
function getSynergyEntryBetweenFoods(
  foodId1: string,
  foodId2: string,
  synergyMap: Map<string, FoodSynergy>
): FoodSynergy | undefined {
  const key = getSynergyKey(foodId1, foodId2);
  return synergyMap.get(key);
}

/**
 * Create normalized synergy lookup key
 * Ensures consistent lookup regardless of parameter order
 */
function getSynergyKey(foodId1: string, foodId2: string): string {
  // Sort IDs to ensure consistent key regardless of order
  return foodId1 < foodId2
    ? `${foodId1}:${foodId2}`
    : `${foodId2}:${foodId1}`;
}

// ============================================================================
// Utility Functions for Common Use Cases
// ============================================================================

/**
 * Check if a food is appropriate for a specific meal type
 */
export function isFoodAllowedForMeal(food: Food, mealType: MealType): boolean {
  return food.allowedMealTypes.includes(mealType) ||
         food.allowedMealTypes.includes('any');
}

/**
 * Get explanation for why a food was suggested
 * Returns human-readable summary of synergies
 */
export function getSuggestionExplanation(suggestion: FoodSuggestion): string {
  if (suggestion.synergyBreakdown.length === 0) {
    return `${suggestion.food.name} has a synergy score of ${suggestion.totalScore}.`;
  }

  const positivesynergies = suggestion.synergyBreakdown
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (positivesynergies.length === 0) {
    return `${suggestion.food.name} has no positive synergies with your selections.`;
  }

  const topSynergy = positivesynergies[0];
  const explanation = topSynergy.reason
    ? `${topSynergy.reason}`
    : `Pairs well with ${topSynergy.selectedFood.name}`;

  if (positivesynergies.length === 1) {
    return `${suggestion.food.name}: ${explanation} (+${topSynergy.score})`;
  }

  return `${suggestion.food.name}: ${explanation} (+${topSynergy.score}) and ${positivesynergies.length - 1} other pairing(s)`;
}

// ============================================================================
// Example Usage (for documentation/testing)
// ============================================================================

/**
 * Example demonstrating the algorithm with sample data
 *
 * This can be used for testing or as documentation
 */
export function runExampleCalculation(): void {
  // Sample foods
  const spinach: Food = {
    id: 'spinach',
    name: 'Spinach',
    category: 'leafy-greens',
    allowedMealTypes: ['breakfast', 'lunch', 'dinner', 'any'],
  };

  const blueberries: Food = {
    id: 'blueberries',
    name: 'Blueberries',
    category: 'berries',
    allowedMealTypes: ['breakfast', 'snack', 'any'],
  };

  const walnuts: Food = {
    id: 'walnuts',
    name: 'Walnuts',
    category: 'nuts',
    allowedMealTypes: ['breakfast', 'snack', 'any'],
  };

  const orange: Food = {
    id: 'orange',
    name: 'Orange',
    category: 'citrus',
    allowedMealTypes: ['breakfast', 'snack', 'any'],
  };

  // Sample synergies
  const synergies: FoodSynergy[] = [
    {
      foodId1: 'spinach',
      foodId2: 'walnuts',
      score: 5,
      reason: 'Omega-3s enhance iron absorption from leafy greens',
    },
    {
      foodId1: 'blueberries',
      foodId2: 'walnuts',
      score: 3,
      reason: 'Healthy fats help absorb antioxidants from berries',
    },
    {
      foodId1: 'orange',
      foodId2: 'spinach',
      score: 6,
      reason: 'Vitamin C significantly boosts iron absorption',
    },
    {
      foodId1: 'blueberries',
      foodId2: 'orange',
      score: 2,
      reason: 'Complementary antioxidants',
    },
  ];

  // Selected foods
  const selectedFoods = [spinach, blueberries];

  // Calculate score for walnuts
  const walnutScore = calculateSynergyScore(walnuts, selectedFoods, synergies);
  console.log(`Walnuts synergy score: ${walnutScore}`); // Expected: 8

  // Get top suggestions
  const suggestions = getTopSuggestions(
    selectedFoods,
    [walnuts, orange],
    synergies,
    { limit: 5, mealContext: 'breakfast' }
  );

  console.log('\nTop Suggestions:');
  suggestions.forEach((suggestion, index) => {
    console.log(`${index + 1}. ${suggestion.food.name} (Score: ${suggestion.totalScore})`);
    console.log(`   ${getSuggestionExplanation(suggestion)}`);
  });
}
