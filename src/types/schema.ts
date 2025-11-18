/**
 * Food Science Menu Planning Application - Complete Type Schema
 *
 * This schema supports evidence-based meal planning with:
 * - Food data from "How Not to Diet" cookbook
 * - Synergy scoring algorithms
 * - Weekly menu planning
 * - Page source tracking for scientific evidence
 *
 * Aligned with:
 * - extracted-foods.json structure
 * - suggestions.ts algorithm types
 * - index.ts existing types
 */

// ============================================================================
// CORE DATA TYPES (from extracted-foods.json)
// ============================================================================

/**
 * Food categories based on "How Not to Diet" focus areas
 * Matches extracted-foods.json structure
 */
export type FoodCategory =
  | 'rich-in-legumes'
  | 'high-fiber'
  | 'anti-inflammatory'
  | 'low-glycemic'
  | 'rich-in-vegetables'
  | 'cruciferous'
  | 'greens'
  | 'rich-in-whole-grains'
  | 'high-water-rich'
  | 'rich-in-fruits'
  | 'herbs-and-spices'
  | 'appetite-suppression'
  | 'weight-loss-booster';

/**
 * Meal timing recommendations for optimal food consumption
 * Matches extracted-foods.json timing field
 */
export type MealTiming =
  | 'any-meal'
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snacks'
  | 'earlier-in-meal'
  | 'with-each-meal'
  | 'particularly-effective-in-soups'
  | 'in-cooking'
  | 'daily'
  | 'can-sprinkle-on-meals';

/**
 * Source information tracking page references from scientific literature
 */
export interface FoodSource {
  /** Page numbers where this food is discussed */
  pages: number[];

  /** Direct quotes from source material */
  quotes: string[];
}

/**
 * Complete food definition with properties, benefits, and scientific backing
 * Matches extracted-foods.json food structure
 */
export interface Food {
  /** Unique identifier (e.g., "food-1") */
  id: string;

  /** Display name (e.g., "Beans (Legumes)") */
  name: string;

  /** Categories this food belongs to */
  categories: FoodCategory[];

  /** List of key properties and characteristics */
  properties: string[];

  /** Detailed description of health benefits */
  benefits: string;

  /**
   * Foods that pair well with this one
   * Can be specific food names or general categories
   */
  synergies: string[];

  /**
   * Foods that conflict or should be avoided with this one
   */
  conflicts: string[];

  /** Recommended timing for consuming this food */
  timing: MealTiming[];

  /** Recommended serving amount (e.g., "3 servings daily") */
  amount: string;

  /** Source references from scientific literature */
  sources: FoodSource;
}

/**
 * Metadata about food extraction process
 */
export interface ExtractionMetadata {
  /** Date when data was extracted */
  extraction_date: string;

  /** Source document name */
  source_document: string;

  /** Key nutritional focus areas from the source */
  focus_areas: string[];
}

/**
 * Index entry mapping food names to page references
 */
export interface ExtractionIndexEntry {
  /** Food name */
  food: string;

  /** Page numbers where this food appears */
  pages: number[];
}

/**
 * Complete food database structure (matches extracted-foods.json)
 */
export interface FoodDatabase {
  /** Metadata about the extraction */
  extraction_metadata: ExtractionMetadata;

  /** Index of foods and their page references */
  extraction_index: ExtractionIndexEntry[];

  /** Complete food entries */
  foods: Food[];
}

// ============================================================================
// SUGGESTION ALGORITHM TYPES (from suggestions.ts)
// ============================================================================

/**
 * Meal type for filtering suggestions
 * Used by the suggestion algorithm
 */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'any';

/**
 * Simplified food type used by the suggestion algorithm
 * Lighter version optimized for scoring
 */
export interface SuggestionFood {
  id: string;
  name: string;
  category: string;
  allowedMealTypes: MealType[];
}

/**
 * Normalized synergy relationship between two foods
 * Used by the suggestion algorithm for scoring
 */
export interface FoodSynergy {
  /** First food ID (always the smaller ID lexicographically) */
  foodId1: string;

  /** Second food ID (always the larger ID lexicographically) */
  foodId2: string;

  /**
   * Synergy score:
   * - Positive: beneficial combination
   * - Negative: conflict/poor pairing
   * - Zero: neutral/no known interaction
   */
  score: number;

  /** Optional explanation for the synergy */
  reason?: string;
}

/**
 * Options for configuring the suggestion algorithm
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
 * A suggested food with calculated synergy score
 */
export interface FoodSuggestion {
  /** The suggested food */
  food: SuggestionFood;

  /** Total synergy score across all selected foods */
  totalScore: number;

  /**
   * Breakdown showing contribution from each selected food
   * Useful for explaining why this food was suggested
   */
  synergyBreakdown: Array<{
    selectedFood: SuggestionFood;
    score: number;
    reason?: string;
  }>;
}

// ============================================================================
// SYNERGY ANALYSIS TYPES (from index.ts)
// ============================================================================

/**
 * Detailed synergy analysis for a specific food pairing
 */
export interface FoodSynergyScore {
  /** First food name */
  food1: string;

  /** Second food name */
  food2: string;

  /** Calculated synergy score */
  score: number;

  /** Reasons for this synergy rating */
  reasons: string[];

  /** Categories that both foods share */
  categoryMatches: FoodCategory[];
}

/**
 * Comprehensive synergy analysis for a meal
 */
export interface MealSynergyAnalysis {
  /** Overall synergy score for the meal */
  totalScore: number;

  /** List of foods included in the meal */
  foodsIncluded: string[];

  /** Individual synergy pairs that contribute to the score */
  synergyPairs: FoodSynergyScore[];

  /**
   * Category distribution showing how many foods from each category
   * Useful for ensuring balanced nutrition
   */
  categoryBalance: Record<FoodCategory, number>;

  /** Whether meal timing is optimal for the included foods */
  timingOptimal: boolean;

  /** Actionable recommendations for improving the meal */
  recommendations: string[];
}

// ============================================================================
// RECIPE TYPES (from index.ts)
// ============================================================================

/**
 * Recipe category (broader than meal type)
 */
export type RecipeCategory =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack'
  | 'dessert'
  | 'beverage';

/**
 * Recipe ingredient specification
 */
export interface Ingredient {
  /** Ingredient name */
  name: string;

  /** Quantity amount */
  amount: number;

  /** Unit of measurement (e.g., "cup", "tbsp", "g") */
  unit: string;

  /** Optional preparation notes */
  notes?: string;
}

/**
 * Nutritional information per serving
 */
export interface NutritionInfo {
  /** Calories per serving */
  calories: number;

  /** Protein in grams */
  protein: number;

  /** Carbohydrates in grams */
  carbohydrates: number;

  /** Fat in grams */
  fat: number;

  /** Fiber in grams */
  fiber: number;

  /** Sodium in milligrams (optional) */
  sodium?: number;
}

/**
 * Complete recipe definition
 */
export interface Recipe {
  /** Unique recipe identifier */
  id: string;

  /** Recipe name */
  name: string;

  /** Brief description */
  description: string;

  /** Number of servings */
  servings: number;

  /** Preparation time in minutes */
  prepTime: number;

  /** Cooking time in minutes */
  cookTime: number;

  /** List of ingredients */
  ingredients: Ingredient[];

  /** Step-by-step instructions */
  instructions: string[];

  /** Nutritional information (optional) */
  nutrition?: NutritionInfo;

  /** Tags for categorization and search */
  tags: string[];

  /** Primary category */
  category: RecipeCategory;

  /**
   * Foods featured in this recipe (references to Food IDs)
   * Used for synergy analysis
   */
  featuredFoods?: string[];
}

// ============================================================================
// MENU PLANNING TYPES (from index.ts)
// ============================================================================

/**
 * Days of the week
 */
export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

/**
 * Daily menu plan with all meals
 */
export interface DayMenu {
  /** Day of the week */
  day: Weekday;

  /** Breakfast recipe (optional) */
  breakfast?: Recipe;

  /** Lunch recipe (optional) */
  lunch?: Recipe;

  /** Dinner recipe (optional) */
  dinner?: Recipe;

  /** Snack recipes (optional, can be multiple) */
  snacks?: Recipe[];
}

/**
 * Weekly menu plan
 */
export interface WeeklyMenu {
  /** Unique menu identifier */
  id: string;

  /** Menu name/title */
  name: string;

  /** Week number in the year */
  week: number;

  /** Year */
  year: number;

  /** Daily menus (one for each day) */
  days: DayMenu[];
}

/**
 * Weekly menu with synergy scoring
 */
export interface WeeklyMenuWithSynergies extends WeeklyMenu {
  /** Overall synergy score for the week */
  synergyScore: number;

  /** Per-day synergy analysis */
  dailyAnalysis: {
    day: Weekday;
    score: number;
    analysis: MealSynergyAnalysis;
  }[];
}

/**
 * Shopping list item aggregated from recipes
 */
export interface ShoppingListItem {
  /** Ingredient name */
  ingredient: string;

  /** Total amount needed */
  amount: number;

  /** Unit of measurement */
  unit: string;

  /** Optional category for organization (e.g., "produce", "grains") */
  category?: string;
}

// ============================================================================
// USER PREFERENCES TYPES
// ============================================================================

/**
 * Dietary restrictions and preferences
 */
export interface DietaryPreferences {
  /** Allergies (food IDs to exclude) */
  allergies: string[];

  /** Dislikes (food IDs to avoid) */
  dislikes: string[];

  /** Preferred categories to emphasize */
  preferredCategories: FoodCategory[];

  /** Categories to avoid */
  avoidCategories: FoodCategory[];

  /** Daily calorie target (optional) */
  calorieTarget?: number;

  /** Specific nutrition goals (optional) */
  nutritionGoals?: Partial<NutritionInfo>;
}

/**
 * User profile for personalized menu planning
 */
export interface UserProfile {
  /** User identifier */
  id: string;

  /** Display name */
  name: string;

  /** Dietary preferences */
  preferences: DietaryPreferences;

  /** Saved weekly menus */
  savedMenus: string[]; // Array of WeeklyMenu IDs
}

// ============================================================================
// TRANSFORMATION & UTILITY TYPES
// ============================================================================

/**
 * Convert full Food to SuggestionFood
 */
export type FoodToSuggestionFood = (food: Food) => SuggestionFood;

/**
 * Convert synergy array from Food to FoodSynergy array
 */
export type BuildSynergiesFromFoods = (foods: Food[]) => FoodSynergy[];

/**
 * Validation result for food data
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;

  /** Validation errors (if any) */
  errors: string[];

  /** Warnings that don't prevent usage */
  warnings: string[];
}

/**
 * Food database validator function type
 */
export type ValidateFoodDatabase = (db: FoodDatabase) => ValidationResult;

// ============================================================================
// TYPE COLLECTIONS FOR EXPORT
// ============================================================================

/**
 * All food-related types
 */
export type FoodTypes = {
  Food: Food;
  FoodCategory: FoodCategory;
  FoodSource: FoodSource;
  FoodDatabase: FoodDatabase;
  ExtractionMetadata: ExtractionMetadata;
  ExtractionIndexEntry: ExtractionIndexEntry;
};

/**
 * All synergy-related types
 */
export type SynergyTypes = {
  FoodSynergy: FoodSynergy;
  FoodSynergyScore: FoodSynergyScore;
  MealSynergyAnalysis: MealSynergyAnalysis;
};

/**
 * All meal planning types
 */
export type MealPlanningTypes = {
  Recipe: Recipe;
  Ingredient: Ingredient;
  NutritionInfo: NutritionInfo;
  DayMenu: DayMenu;
  WeeklyMenu: WeeklyMenu;
  WeeklyMenuWithSynergies: WeeklyMenuWithSynergies;
  ShoppingListItem: ShoppingListItem;
  MealType: MealType;
  Weekday: Weekday;
  RecipeCategory: RecipeCategory;
};

/**
 * All suggestion algorithm types
 */
export type SuggestionTypes = {
  SuggestionFood: SuggestionFood;
  SuggestionOptions: SuggestionOptions;
  FoodSuggestion: FoodSuggestion;
};
