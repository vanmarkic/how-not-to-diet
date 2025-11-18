/**
 * Usage Examples for the Food Science Menu Planning Schema
 *
 * This file demonstrates how to use the type definitions and work with the data model.
 */

import type {
  Food,
  FoodRelationship,
  Meal,
  DayMenu,
  WeeklyMenu,
  MealScore,
  FoodSuggestion,
  MenuGenerationParams,
  DataMaps,
  FoodCategory,
  MealType,
  RelationshipType,
} from '../types/schema';

// ============================================================================
// EXAMPLE 1: Building Data Maps for Efficient Querying
// ============================================================================

function buildDataMaps(
  foods: Food[],
  relationships: FoodRelationship[]
): DataMaps {
  const foodsById = new Map(foods.map(f => [f.id, f]));

  const relationshipsByFromFood = new Map<string, FoodRelationship[]>();
  const relationshipsByToFood = new Map<string, FoodRelationship[]>();

  for (const rel of relationships) {
    // Index by fromFood
    if (!relationshipsByFromFood.has(rel.fromFoodId)) {
      relationshipsByFromFood.set(rel.fromFoodId, []);
    }
    relationshipsByFromFood.get(rel.fromFoodId)!.push(rel);

    // Index by toFood
    if (!relationshipsByToFood.has(rel.toFoodId)) {
      relationshipsByToFood.set(rel.toFoodId, []);
    }
    relationshipsByToFood.get(rel.toFoodId)!.push(rel);
  }

  const foodsByCategory = new Map<FoodCategory, Food[]>();
  for (const food of foods) {
    if (!foodsByCategory.has(food.category)) {
      foodsByCategory.set(food.category, []);
    }
    foodsByCategory.get(food.category)!.push(food);
  }

  return {
    foodsById,
    relationshipsByFromFood,
    relationshipsByToFood,
    foodsByCategory,
  };
}

// ============================================================================
// EXAMPLE 2: Finding Relationships Between Two Foods
// ============================================================================

function getRelationshipsBetween(
  food1Id: string,
  food2Id: string,
  relationships: FoodRelationship[]
): FoodRelationship[] {
  const results: FoodRelationship[] = [];

  for (const rel of relationships) {
    // Direct relationship (food1 -> food2)
    if (rel.fromFoodId === food1Id && rel.toFoodId === food2Id) {
      results.push(rel);
    }

    // Reverse relationship if bidirectional (food2 -> food1)
    if (
      rel.isBidirectional &&
      rel.fromFoodId === food2Id &&
      rel.toFoodId === food1Id
    ) {
      results.push(rel);
    }
  }

  return results;
}

// ============================================================================
// EXAMPLE 3: Calculating Meal Score
// ============================================================================

function calculateMealScore(
  meal: Meal,
  relationships: FoodRelationship[]
): MealScore {
  let synergyScore = 0;
  let conflictScore = 0;
  const relationshipScores: MealScore['relationshipScores'] = [];

  // Check all pairs of foods in the meal
  for (let i = 0; i < meal.foodIds.length; i++) {
    for (let j = i + 1; j < meal.foodIds.length; j++) {
      const food1 = meal.foodIds[i];
      const food2 = meal.foodIds[j];

      const rels = getRelationshipsBetween(food1, food2, relationships);

      for (const rel of rels) {
        relationshipScores.push({
          fromFoodId: rel.fromFoodId,
          toFoodId: rel.toFoodId,
          score: rel.score,
          type: rel.type,
        });

        if (rel.type === RelationshipType.SYNERGY) {
          synergyScore += rel.score;
        } else if (rel.type === RelationshipType.CONFLICT) {
          conflictScore += rel.score; // Already negative
        }
      }
    }
  }

  return {
    mealId: meal.id,
    synergyScore,
    conflictScore,
    netScore: synergyScore + conflictScore,
    relationshipScores,
  };
}

// ============================================================================
// EXAMPLE 4: Generating Food Suggestions
// ============================================================================

function generateSuggestions(
  selectedFoodIds: string[],
  allFoods: Food[],
  relationships: FoodRelationship[],
  maxSuggestions: number = 10
): FoodSuggestion[] {
  const suggestions: FoodSuggestion[] = [];
  const selectedSet = new Set(selectedFoodIds);

  // Consider each unselected food
  for (const food of allFoods) {
    if (selectedSet.has(food.id)) continue;

    let compatibilityScore = 0;
    const synergies: FoodSuggestion['synergies'] = [];
    const conflicts: FoodSuggestion['conflicts'] = [];

    // Check relationships with each selected food
    for (const selectedId of selectedFoodIds) {
      const rels = getRelationshipsBetween(food.id, selectedId, relationships);

      for (const rel of rels) {
        if (rel.type === RelationshipType.SYNERGY) {
          compatibilityScore += rel.score;
          const selectedFood = allFoods.find(f => f.id === selectedId);
          if (selectedFood) {
            synergies.push({
              withFoodId: selectedId,
              withFoodName: selectedFood.name,
              score: rel.score,
              rationale: rel.rationale,
            });
          }
        } else if (rel.type === RelationshipType.CONFLICT) {
          compatibilityScore += rel.score; // Negative
          const selectedFood = allFoods.find(f => f.id === selectedId);
          if (selectedFood) {
            conflicts.push({
              withFoodId: selectedId,
              withFoodName: selectedFood.name,
              score: rel.score,
              rationale: rel.rationale,
            });
          }
        }
      }
    }

    // Generate reason text
    let reason = '';
    if (synergies.length > 0) {
      reason = `${synergies.length} synergies found`;
      if (synergies.length === 1) {
        reason = `Strong synergy with ${synergies[0].withFoodName}`;
      }
    }
    if (conflicts.length > 0) {
      reason += reason ? ` (${conflicts.length} conflicts)` : `${conflicts.length} conflicts detected`;
    }
    if (!reason) {
      reason = 'Neutral compatibility';
    }

    suggestions.push({
      food,
      compatibilityScore,
      synergies,
      conflicts: conflicts.length > 0 ? conflicts : undefined,
      reason,
    });
  }

  // Sort by compatibility score (highest first) and return top N
  return suggestions
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    .slice(0, maxSuggestions);
}

// ============================================================================
// EXAMPLE 5: Creating a Meal with Score Calculation
// ============================================================================

function createOptimizedMeal(
  mealType: MealType,
  initialFoodIds: string[],
  allFoods: Food[],
  relationships: FoodRelationship[],
  targetScore: number = 200
): { meal: Meal; score: MealScore; suggestions: FoodSuggestion[] } {
  const mealId = `meal-${Date.now()}`;
  const selectedFoodIds = [...initialFoodIds];

  // Create initial meal
  let meal: Meal = {
    id: mealId,
    type: mealType,
    foodIds: selectedFoodIds,
  };

  // Calculate initial score
  let score = calculateMealScore(meal, relationships);

  // Generate suggestions to improve score
  const suggestions = generateSuggestions(
    selectedFoodIds,
    allFoods,
    relationships,
    5
  );

  // Optionally auto-add top suggestion if score is below target
  if (score.netScore < targetScore && suggestions.length > 0 && suggestions[0].compatibilityScore > 0) {
    selectedFoodIds.push(suggestions[0].food.id);
    meal = {
      ...meal,
      foodIds: selectedFoodIds,
    };
    score = calculateMealScore(meal, relationships);
  }

  return { meal, score, suggestions };
}

// ============================================================================
// EXAMPLE 6: Building a Daily Menu
// ============================================================================

function createDayMenu(
  date: string,
  allFoods: Food[],
  relationships: FoodRelationship[]
): DayMenu {
  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay();

  // Create breakfast
  const breakfast = createOptimizedMeal(
    MealType.BREAKFAST,
    ['blueberries-001', 'walnuts-001'],
    allFoods,
    relationships
  );

  // Create lunch
  const lunch = createOptimizedMeal(
    MealType.LUNCH,
    ['kale-001', 'quinoa-001', 'lemon-001'],
    allFoods,
    relationships
  );

  // Create dinner
  const dinner = createOptimizedMeal(
    MealType.DINNER,
    ['broccoli-001', 'black-beans-001', 'turmeric-001', 'black-pepper-001'],
    allFoods,
    relationships
  );

  const dailyScore =
    breakfast.score.netScore +
    lunch.score.netScore +
    dinner.score.netScore;

  return {
    id: `day-${date}`,
    date,
    dayOfWeek,
    meals: {
      breakfast: breakfast.meal,
      lunch: lunch.meal,
      dinner: dinner.meal,
    },
    dailyScore,
    isLocked: false,
  };
}

// ============================================================================
// EXAMPLE 7: Generating a Weekly Menu
// ============================================================================

function generateWeeklyMenu(
  params: MenuGenerationParams,
  allFoods: Food[],
  relationships: FoodRelationship[]
): WeeklyMenu {
  const startDate = new Date(params.startDate);
  const days: DayMenu[] = [];
  const numberOfDays = params.numberOfDays ?? 7;

  // Generate each day
  for (let i = 0; i < numberOfDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateString = currentDate.toISOString().split('T')[0];

    const dayMenu = createDayMenu(dateString, allFoods, relationships);
    days.push(dayMenu);
  }

  // Calculate weekly score
  const weeklyScore = days.reduce((sum, day) => sum + (day.dailyScore ?? 0), 0);

  // Calculate end date
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + numberOfDays - 1);

  return {
    id: `menu-${params.startDate}`,
    name: `Menu for ${params.startDate}`,
    startDate: params.startDate,
    endDate: endDate.toISOString().split('T')[0],
    days,
    weeklyScore,
    preferences: params.preferences,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isArchived: false,
  };
}

// ============================================================================
// EXAMPLE 8: Analyzing Food Frequency in a Weekly Menu
// ============================================================================

function analyzeFoodFrequency(menu: WeeklyMenu, foodsById: Map<string, Food>) {
  const frequency = new Map<string, number>();

  // Count occurrences of each food
  for (const day of menu.days) {
    const allMeals = [
      day.meals.breakfast,
      day.meals.lunch,
      day.meals.dinner,
      ...(day.meals.snacks ?? []),
    ].filter(Boolean) as Meal[];

    for (const meal of allMeals) {
      for (const foodId of meal.foodIds) {
        frequency.set(foodId, (frequency.get(foodId) ?? 0) + 1);
      }
    }
  }

  // Convert to sorted array
  return Array.from(frequency.entries())
    .map(([foodId, count]) => ({
      foodId,
      foodName: foodsById.get(foodId)?.name ?? 'Unknown',
      occurrences: count,
    }))
    .sort((a, b) => b.occurrences - a.occurrences);
}

// ============================================================================
// EXAMPLE 9: Finding Missing Categories
// ============================================================================

function findMissingCategories(
  menu: WeeklyMenu,
  foodsById: Map<string, Food>
): FoodCategory[] {
  const presentCategories = new Set<FoodCategory>();

  // Collect all categories present in the menu
  for (const day of menu.days) {
    const allMeals = [
      day.meals.breakfast,
      day.meals.lunch,
      day.meals.dinner,
      ...(day.meals.snacks ?? []),
    ].filter(Boolean) as Meal[];

    for (const meal of allMeals) {
      for (const foodId of meal.foodIds) {
        const food = foodsById.get(foodId);
        if (food) {
          presentCategories.add(food.category);
          food.secondaryCategories?.forEach(cat => presentCategories.add(cat));
        }
      }
    }
  }

  // Find missing important categories
  const allCategories = Object.values(FoodCategory);
  return allCategories.filter(cat => !presentCategories.has(cat));
}

// ============================================================================
// EXAMPLE 10: Complete Usage Example
// ============================================================================

export function demonstrateCompleteWorkflow() {
  // Assume we have loaded data
  const foods: Food[] = []; // Load from JSON
  const relationships: FoodRelationship[] = []; // Load from JSON

  // 1. Build efficient lookup maps
  const dataMaps = buildDataMaps(foods, relationships);

  // 2. User starts building a meal
  const selectedFoodIds = ['kale-001', 'black-beans-001'];

  // 3. Get suggestions for what to add
  const suggestions = generateSuggestions(
    selectedFoodIds,
    foods,
    relationships,
    5
  );

  console.log('Top suggestions:', suggestions.slice(0, 3).map(s => ({
    name: s.food.name,
    score: s.compatibilityScore,
    reason: s.reason,
  })));

  // 4. Add suggested food (lemon for vitamin C + iron synergy)
  selectedFoodIds.push('lemon-001');

  // 5. Create the meal
  const meal: Meal = {
    id: 'meal-example',
    type: MealType.LUNCH,
    foodIds: selectedFoodIds,
    name: 'Iron-Rich Power Lunch',
  };

  // 6. Calculate score
  const mealScore = calculateMealScore(meal, relationships);
  console.log('Meal score:', mealScore);

  // 7. Generate weekly menu
  const menuParams: MenuGenerationParams = {
    startDate: '2025-11-18',
    numberOfDays: 7,
    seedFoodIds: ['kale-001', 'broccoli-001', 'blueberries-001'],
    preferences: {
      preferredFoodIds: ['turmeric-001', 'black-pepper-001'],
      varietyTarget: 80,
      preferSeasonal: true,
    },
    minMealScore: 150,
  };

  const weeklyMenu = generateWeeklyMenu(menuParams, foods, relationships);
  console.log('Weekly menu generated:', {
    weeklyScore: weeklyMenu.weeklyScore,
    numberOfDays: weeklyMenu.days.length,
  });

  // 8. Analyze the menu
  const foodFreq = analyzeFoodFrequency(weeklyMenu, dataMaps.foodsById);
  console.log('Most used foods:', foodFreq.slice(0, 5));

  const missingCategories = findMissingCategories(weeklyMenu, dataMaps.foodsById);
  console.log('Missing categories:', missingCategories);

  return {
    meal,
    mealScore,
    suggestions,
    weeklyMenu,
    analysis: {
      foodFrequency: foodFreq,
      missingCategories,
    },
  };
}

// ============================================================================
// EXAMPLE 11: Validation Functions
// ============================================================================

export function validateFood(food: Partial<Food>): string[] {
  const errors: string[] = [];

  if (!food.id || food.id.trim() === '') {
    errors.push('Food ID is required');
  }

  if (!food.name || food.name.trim() === '') {
    errors.push('Food name is required');
  }

  if (!food.category) {
    errors.push('Food category is required');
  }

  if (!food.servingAmount) {
    errors.push('Serving amount is required');
  } else if (food.servingAmount.value <= 0) {
    errors.push('Serving amount must be positive');
  }

  if (!food.timingRecommendations || food.timingRecommendations.length === 0) {
    errors.push('At least one timing recommendation is required');
  }

  return errors;
}

export function validateRelationship(
  relationship: Partial<FoodRelationship>,
  foodsById: Map<string, Food>
): string[] {
  const errors: string[] = [];

  if (!relationship.fromFoodId) {
    errors.push('fromFoodId is required');
  } else if (!foodsById.has(relationship.fromFoodId)) {
    errors.push(`Food ${relationship.fromFoodId} does not exist`);
  }

  if (!relationship.toFoodId) {
    errors.push('toFoodId is required');
  } else if (!foodsById.has(relationship.toFoodId)) {
    errors.push(`Food ${relationship.toFoodId} does not exist`);
  }

  if (relationship.fromFoodId === relationship.toFoodId) {
    errors.push('Cannot create relationship from food to itself');
  }

  if (relationship.type === RelationshipType.SYNERGY) {
    if (relationship.score === undefined || relationship.score < 1 || relationship.score > 100) {
      errors.push('Synergy score must be between 1 and 100');
    }
  } else if (relationship.type === RelationshipType.CONFLICT) {
    if (relationship.score === undefined || relationship.score < -100 || relationship.score > -1) {
      errors.push('Conflict score must be between -100 and -1');
    }
  } else if (relationship.type === RelationshipType.NEUTRAL) {
    if (relationship.score !== 0) {
      errors.push('Neutral relationship score must be 0');
    }
  }

  if (relationship.evidenceStrength !== undefined) {
    if (![1, 2, 3, 4, 5].includes(relationship.evidenceStrength)) {
      errors.push('Evidence strength must be 1, 2, 3, 4, or 5');
    }
  }

  return errors;
}
