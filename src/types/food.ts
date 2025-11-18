export interface Food {
  id: string;
  name: string;
  categories: string[];
  properties: string[];
  benefits: string;
  synergies: string[];
  conflicts: string[];
  timing: string[];
  amount: string;
  sources: {
    pages: number[];
    quotes: string[];
  };
}

export interface FoodDatabase {
  extraction_metadata: {
    extraction_date: string;
    source_document: string;
    focus_areas: string[];
  };
  extraction_index: Array<{
    food: string;
    pages: number[];
  }>;
  foods: Food[];
}

export interface SynergyScore {
  foodId: string;
  foodName: string;
  score: number;
  reasons: string[];
}

export interface MealSuggestion {
  foods: Food[];
  synergyScore: number;
  benefits: string[];
  timing: string;
}
