export interface Recipe {
  id: string;
  name: string;
  description: string;
  servings: number;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  ingredients: Ingredient[];
  instructions: string[];
  nutrition?: NutritionInfo;
  tags: string[];
  category: RecipeCategory;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number; // grams
  carbohydrates: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sodium?: number; // mg
}

export type RecipeCategory =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack'
  | 'dessert'
  | 'beverage';

export interface DayMenu {
  day: Weekday;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
  snacks?: Recipe[];
}

export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface WeeklyMenu {
  id: string;
  name: string;
  week: number;
  year: number;
  days: DayMenu[];
}

export interface ShoppingListItem {
  ingredient: string;
  amount: number;
  unit: string;
  category?: string;
}

// Food synergy types
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

export interface Food {
  id: string;
  name: string;
  categories: FoodCategory[];
  properties: string[];
  benefits: string;
  synergies: string[];
  conflicts: string[];
  timing: MealTiming[];
  amount: string;
  sources: {
    pages: number[];
    quotes: string[];
  };
}

export interface FoodSynergyScore {
  food1: string;
  food2: string;
  score: number;
  reasons: string[];
  categoryMatches: FoodCategory[];
}

export interface MealSynergyAnalysis {
  totalScore: number;
  foodsIncluded: string[];
  synergyPairs: FoodSynergyScore[];
  categoryBalance: Record<FoodCategory, number>;
  timingOptimal: boolean;
  recommendations: string[];
}

export interface WeeklyMenuWithSynergies extends WeeklyMenu {
  synergyScore: number;
  dailyAnalysis: {
    day: Weekday;
    score: number;
    analysis: MealSynergyAnalysis;
  }[];
}
