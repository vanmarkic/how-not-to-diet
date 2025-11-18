# Food Science Menu Planning - Data Schema Documentation

## Overview

This document describes the complete data model for the food science menu planning application. The schema is designed to support evidence-based meal planning with food synergies, conflicts, nutritional timing, and intelligent menu generation.

The schema aligns with:
- **extracted-foods.json**: Food database from "How Not to Diet" cookbook
- **suggestions.ts**: Synergy scoring algorithm implementation
- **index.ts**: Menu planning types

All types are defined in `/src/types/schema.ts`.

## Core Concepts

### 1. Foods (from extracted-foods.json)

Foods are the atomic units of the system, extracted from "How Not to Diet" cookbook with scientific evidence backing.

**Key Properties:**
- **Categories**: Multiple category classifications (e.g., 'rich-in-legumes', 'high-fiber', 'anti-inflammatory', 'cruciferous')
- **Properties**: List of key characteristics and nutritional highlights
- **Benefits**: Detailed description of health benefits
- **Synergies**: Foods or categories that pair well (as strings)
- **Conflicts**: Foods or categories to avoid combining
- **Timing**: Optimal consumption timing (e.g., 'breakfast', 'any-meal', 'earlier-in-meal', 'with-each-meal')
- **Amount**: Recommended serving amount as text (e.g., "3 servings daily", "1/4 teaspoon daily")
- **Sources**: Page references and direct quotes from scientific literature

**TypeScript Definition:**

```typescript
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
  sources: FoodSource;
}
```

**Real Example from Database:**

```json
{
  "id": "food-1",
  "name": "Beans (Legumes)",
  "categories": ["rich-in-legumes", "high-fiber", "anti-inflammatory", "low-glycemic"],
  "properties": [
    "Excellent source of vitamins, minerals, fiber and antioxidants",
    "Highest nutrition density - biggest bang for the buck",
    "Calories trapped within cell walls",
    "Part of Daily Dozen - 3 servings daily",
    "Includes beans, chickpeas, split peas, and lentils"
  ],
  "benefits": "Benefits excess body weight, insulin resistance, high cholesterol, inflammation, and oxidative stress. Makes them an important part of heart disease prevention and peripheral vascular disease prevention.",
  "synergies": ["vegetables", "whole-grains", "greens"],
  "conflicts": [],
  "timing": ["any-meal", "particularly-effective-in-soups"],
  "amount": "3 servings daily (Daily Dozen requirement)",
  "sources": {
    "pages": [15, 54, 94],
    "quotes": [
      "Legumes – beans, chickpeas, split peas, and lentils – are an excellent source of vitamins, minerals, fibre and antioxidants..."
    ]
  }
}
```

### 2. Food Categories

The schema uses categories from the "How Not to Diet" focus areas:

```typescript
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
```

### 3. Meal Timing

Timing recommendations guide when foods should be consumed for optimal benefits:

```typescript
export type MealTiming =
  | 'any-meal'
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snacks'
  | 'earlier-in-meal'       // e.g., greens before main course
  | 'with-each-meal'        // e.g., vinegar
  | 'particularly-effective-in-soups'
  | 'in-cooking'
  | 'daily'
  | 'can-sprinkle-on-meals';
```

### 4. Food Synergies (Normalized Relationships)

For the suggestion algorithm, synergies are normalized and scored:

**TypeScript Definition:**

```typescript
export interface FoodSynergy {
  foodId1: string;  // Always smaller ID lexicographically
  foodId2: string;  // Always larger ID lexicographically
  score: number;    // Positive = synergy, Negative = conflict, 0 = neutral
  reason?: string;  // Explanation
}
```

**Scoring System:**
- **Positive scores**: Beneficial combinations (higher = stronger synergy)
- **Negative scores**: Conflicts/poor pairings (lower = stronger conflict)
- **Zero**: Neutral/no known interaction

**Example:**

```json
{
  "foodId1": "food-2",
  "foodId2": "food-6",
  "score": 8,
  "reason": "Kale's fat-soluble nutrients are enhanced by healthy fats in flaxseeds"
}
```

### 5. Food Database Structure

The complete database follows this structure (matches extracted-foods.json):

```typescript
export interface FoodDatabase {
  extraction_metadata: ExtractionMetadata;
  extraction_index: ExtractionIndexEntry[];
  foods: Food[];
}
```

**Extraction Metadata:**

```json
{
  "extraction_date": "2025-11-18",
  "source_document": "The How Not to Diet Cookbook -- Michael Greger, MD",
  "focus_areas": [
    "Anti-inflammatory foods",
    "High fiber-rich foods",
    "High water-rich foods",
    "Low glycemic load",
    "Rich in fruits and vegetables",
    "Rich in legumes"
  ]
}
```

**Extraction Index** (for quick page lookup):

```json
[
  {"food": "Beans (Legumes)", "pages": [15, 54, 94]},
  {"food": "Kale", "pages": [13, 94]},
  {"food": "Turmeric", "pages": [100]}
]
```

### 6. Recipes

Recipes combine multiple foods with instructions:

```typescript
export interface Recipe {
  id: string;
  name: string;
  description: string;
  servings: number;
  prepTime: number;       // minutes
  cookTime: number;       // minutes
  ingredients: Ingredient[];
  instructions: string[];
  nutrition?: NutritionInfo;
  tags: string[];
  category: RecipeCategory;
  featuredFoods?: string[];  // Food IDs for synergy analysis
}
```

**Example:**

```json
{
  "id": "recipe-001",
  "name": "Power Greens Bowl",
  "description": "Nutrient-dense bowl with optimal food synergies",
  "servings": 2,
  "prepTime": 15,
  "cookTime": 25,
  "ingredients": [
    {"name": "Kale", "amount": 2, "unit": "cup", "notes": "chopped"},
    {"name": "Beans", "amount": 1, "unit": "cup", "notes": "cooked"},
    {"name": "Vinegar", "amount": 2, "unit": "tsp"}
  ],
  "instructions": [
    "Massage kale with vinegar",
    "Warm beans",
    "Combine and serve"
  ],
  "tags": ["anti-inflammatory", "high-fiber", "quick"],
  "category": "lunch",
  "featuredFoods": ["food-2", "food-1", "food-4"]
}
```

### 7. Daily Menu

Represents all meals for a single day:

```typescript
export interface DayMenu {
  day: Weekday;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
  snacks?: Recipe[];
}
```

**Example:**

```json
{
  "day": "monday",
  "breakfast": {
    "id": "recipe-oatmeal",
    "name": "Berry Oat Bowl",
    "featuredFoods": ["food-5", "food-6", "food-7"]
  },
  "lunch": {
    "id": "recipe-kale-bowl",
    "name": "Kale Power Bowl",
    "featuredFoods": ["food-2", "food-1", "food-4"]
  },
  "dinner": {
    "id": "recipe-lentil-soup",
    "name": "Anti-Inflammatory Lentil Soup",
    "featuredFoods": ["food-1", "food-9", "food-11"]
  },
  "snacks": [
    {
      "id": "recipe-fruit-snack",
      "name": "Berry Snack",
      "featuredFoods": ["food-7"]
    }
  ]
}
```

### 8. Weekly Menu

A complete 7-day meal plan:

```typescript
export interface WeeklyMenu {
  id: string;
  name: string;
  week: number;
  year: number;
  days: DayMenu[];  // 7 days
}
```

**With Synergy Scoring:**

```typescript
export interface WeeklyMenuWithSynergies extends WeeklyMenu {
  synergyScore: number;
  dailyAnalysis: {
    day: Weekday;
    score: number;
    analysis: MealSynergyAnalysis;
  }[];
}
```

**Example:**

```json
{
  "id": "menu-2025-w47",
  "name": "Week of November 18, 2025",
  "week": 47,
  "year": 2025,
  "days": [
    {"day": "monday", "breakfast": {...}, "lunch": {...}, "dinner": {...}},
    {"day": "tuesday", "breakfast": {...}, "lunch": {...}, "dinner": {...}},
    // ... 5 more days
  ],
  "synergyScore": 4580,
  "dailyAnalysis": [
    {
      "day": "monday",
      "score": 670,
      "analysis": {
        "totalScore": 670,
        "foodsIncluded": ["food-1", "food-2", "food-5", "food-7"],
        "categoryBalance": {
          "high-fiber": 4,
          "anti-inflammatory": 3,
          "greens": 1
        },
        "timingOptimal": true,
        "recommendations": ["Add more variety of herbs and spices"]
      }
    }
  ]
}
```

## How Synergies Work

### Normalized Storage

FoodSynergy objects use a normalized key approach to avoid duplicates:

- `foodId1` is always the lexicographically smaller ID
- `foodId2` is always the lexicographically larger ID
- This ensures only one entry per pair: `("food-1", "food-2")` not both `("food-1", "food-2")` and `("food-2", "food-1")`

### Building Synergies from Food Data

Foods in the database have `synergies` and `conflicts` as string arrays (food names or categories). These need to be converted to scored FoodSynergy objects:

```typescript
function buildSynergiesFromFoods(foods: Food[]): FoodSynergy[] {
  const synergies: FoodSynergy[] = [];

  for (const food of foods) {
    // Process synergies
    for (const synergyName of food.synergies) {
      const matchingFoods = findFoodsByNameOrCategory(synergyName, foods);
      for (const match of matchingFoods) {
        synergies.push(createNormalizedSynergy(food.id, match.id,
          calculateSynergyScore(food, match)));
      }
    }

    // Process conflicts (negative scores)
    for (const conflictName of food.conflicts) {
      const matchingFoods = findFoodsByNameOrCategory(conflictName, foods);
      for (const match of matchingFoods) {
        synergies.push(createNormalizedSynergy(food.id, match.id,
          -calculateConflictScore(food, match)));
      }
    }
  }

  return synergies;
}

function createNormalizedSynergy(id1: string, id2: string, score: number): FoodSynergy {
  return {
    foodId1: id1 < id2 ? id1 : id2,
    foodId2: id1 < id2 ? id2 : id1,
    score
  };
}
```

### Querying Synergies

The suggestion algorithm uses a normalized key lookup:

```typescript
function getSynergyKey(foodId1: string, foodId2: string): string {
  return foodId1 < foodId2
    ? `${foodId1}:${foodId2}`
    : `${foodId2}:${foodId1}`;
}

function getSynergyScore(food1: string, food2: string, synergyMap: Map<string, FoodSynergy>): number {
  const key = getSynergyKey(food1, food2);
  return synergyMap.get(key)?.score ?? 0;
}
```

## How Scoring Works

### Basic Synergy Scoring

The suggestion algorithm calculates synergy scores for food combinations:

```typescript
function calculateSynergyScore(
  candidateFood: SuggestionFood,
  selectedFoods: SuggestionFood[],
  synergies: FoodSynergy[]
): number {
  const synergyMap = buildSynergyMap(synergies);
  let totalScore = 0;

  for (const selectedFood of selectedFoods) {
    const score = getSynergyBetweenFoods(
      candidateFood.id,
      selectedFood.id,
      synergyMap
    );
    totalScore += score;
  }

  return totalScore;
}
```

### Meal Synergy Analysis

For complete meal analysis (using MealSynergyAnalysis type):

```typescript
function analyzeMealSynergies(
  recipe: Recipe,
  foods: Food[],
  synergies: FoodSynergy[]
): MealSynergyAnalysis {
  const foodsIncluded = recipe.featuredFoods || [];
  const synergyPairs: FoodSynergyScore[] = [];
  let totalScore = 0;

  // Check all pairs
  for (let i = 0; i < foodsIncluded.length; i++) {
    for (let j = i + 1; j < foodsIncluded.length; j++) {
      const synergy = findSynergy(foodsIncluded[i], foodsIncluded[j], synergies);
      if (synergy) {
        synergyPairs.push({
          food1: getFoodName(foodsIncluded[i], foods),
          food2: getFoodName(foodsIncluded[j], foods),
          score: synergy.score,
          reasons: [synergy.reason || 'Beneficial combination'],
          categoryMatches: findCategoryMatches(foodsIncluded[i], foodsIncluded[j], foods)
        });
        totalScore += synergy.score;
      }
    }
  }

  return {
    totalScore,
    foodsIncluded,
    synergyPairs,
    categoryBalance: calculateCategoryBalance(foodsIncluded, foods),
    timingOptimal: checkTimingOptimal(recipe, foods),
    recommendations: generateRecommendations(synergyPairs, totalScore)
  };
}
```

### Category Balance

Track how many foods from each category to ensure nutritional diversity:

```typescript
function calculateCategoryBalance(
  foodIds: string[],
  foods: Food[]
): Record<FoodCategory, number> {
  const balance: Record<FoodCategory, number> = {};

  for (const foodId of foodIds) {
    const food = foods.find(f => f.id === foodId);
    if (food) {
      for (const category of food.categories) {
        balance[category] = (balance[category] || 0) + 1;
      }
    }
  }

  return balance;
}
```

### Weekly Score Calculation

```typescript
weeklyScore = sum of all daily scores
dailyScore = sum of all meal scores for that day
mealScore = total synergy score (sum of all pairwise synergies)
```

## Suggestion Algorithm

When a user selects initial foods, the system suggests complementary foods:

### Algorithm Flow

1. **Get Selected Foods**: User's current meal selection
2. **Calculate Compatibility**: For each unselected food:
   - Calculate total synergy score with selected foods
   - Calculate total conflict score with selected foods
   - Net compatibility = synergies + conflicts
3. **Rank Suggestions**: Sort by compatibility score (highest first)
4. **Filter by Context**:
   - Match meal timing (breakfast suggestions for breakfast)
   - Respect dietary restrictions
   - Consider seasonal availability
5. **Return Top N**: Present top 5-10 suggestions with explanations

### Example Suggestion Response

```json
{
  "food": {
    "id": "garlic-001",
    "name": "Garlic",
    "category": "alliums"
  },
  "compatibilityScore": 95,
  "synergies": [
    {
      "withFoodId": "broccoli-001",
      "withFoodName": "Broccoli",
      "score": 60,
      "rationale": "Allicin in garlic enhances sulforaphane production in broccoli"
    },
    {
      "withFoodId": "tomato-001",
      "withFoodName": "Tomato",
      "score": 35,
      "rationale": "Complementary antioxidant profiles"
    }
  ],
  "conflicts": [],
  "reason": "Strong synergies with your selected cruciferous vegetables"
}
```

## Data Validation Rules

### Food Validation
- `id`: Must be unique, non-empty string
- `name`: Required, non-empty string
- `category`: Must be valid FoodCategory enum value
- `servingAmount.value`: Must be positive number
- `evidenceStrength`: If present, must be 1-5

### Relationship Validation
- `fromFoodId` and `toFoodId`: Must reference existing foods
- `fromFoodId !== toFoodId`: No self-relationships
- `score`:
  - If synergy: must be 1-100
  - If conflict: must be -100 to -1
  - If neutral: must be 0
- `evidenceStrength`: If present, must be 1-5

### Meal Validation
- `foodIds`: Must contain at least 1 food, maximum recommended 8-10
- All food IDs must reference existing foods
- `type`: Must be valid MealType enum value

### Weekly Menu Validation
- `days`: Must contain exactly 7 DayMenu objects
- `startDate` and `endDate`: Must be valid ISO 8601 dates, 7 days apart
- Each day must have `dayOfWeek` from 0-6

## Example Complete Dataset

### Foods

```json
{
  "foods": [
    {
      "id": "kale-001",
      "name": "Kale",
      "category": "leafy_greens",
      "secondaryCategories": ["cruciferous"],
      "timingRecommendations": ["lunch", "dinner", "anytime"],
      "servingAmount": { "value": 1, "unit": "cup" },
      "nutritionalHighlights": ["Vitamin K", "Vitamin A", "Calcium", "Iron"],
      "evidenceTags": ["anti-cancer", "bone-health", "anti-inflammatory"],
      "isStaple": true
    },
    {
      "id": "lemon-001",
      "name": "Lemon",
      "category": "other_fruits",
      "timingRecommendations": ["morning", "anytime"],
      "servingAmount": { "value": 1, "unit": "piece" },
      "nutritionalHighlights": ["Vitamin C", "Flavonoids"],
      "evidenceTags": ["immune-support", "alkalizing", "digestive-aid"]
    },
    {
      "id": "black-beans-001",
      "name": "Black Beans",
      "category": "legumes",
      "timingRecommendations": ["lunch", "dinner"],
      "servingAmount": { "value": 0.5, "unit": "cup" },
      "nutritionalHighlights": ["Protein", "Fiber", "Iron", "Folate"],
      "evidenceTags": ["heart-health", "blood-sugar-control", "satiety"],
      "isStaple": true
    },
    {
      "id": "turmeric-001",
      "name": "Turmeric",
      "category": "herbs_spices",
      "timingRecommendations": ["anytime"],
      "servingAmount": { "value": 1, "unit": "tsp" },
      "nutritionalHighlights": ["Curcumin"],
      "evidenceTags": ["anti-inflammatory", "antioxidant", "brain-health"]
    },
    {
      "id": "black-pepper-001",
      "name": "Black Pepper",
      "category": "herbs_spices",
      "timingRecommendations": ["anytime"],
      "servingAmount": { "value": 0.25, "unit": "tsp" },
      "nutritionalHighlights": ["Piperine"],
      "evidenceTags": ["bioavailability-enhancer"]
    }
  ]
}
```

### Relationships

```json
{
  "relationships": [
    {
      "id": "rel-kale-lemon",
      "fromFoodId": "kale-001",
      "toFoodId": "lemon-001",
      "type": "synergy",
      "score": 80,
      "rationale": "Vitamin C from lemon significantly increases iron absorption from kale (up to 6x increase)",
      "evidenceStrength": 5,
      "isBidirectional": false
    },
    {
      "id": "rel-turmeric-pepper",
      "fromFoodId": "turmeric-001",
      "toFoodId": "black-pepper-001",
      "type": "synergy",
      "score": 95,
      "rationale": "Piperine in black pepper increases curcumin absorption by 2000%",
      "evidenceStrength": 5,
      "sources": ["Planta Medica 1998"],
      "isBidirectional": false
    },
    {
      "id": "rel-beans-lemon",
      "fromFoodId": "black-beans-001",
      "toFoodId": "lemon-001",
      "type": "synergy",
      "score": 70,
      "rationale": "Vitamin C enhances non-heme iron absorption from beans",
      "evidenceStrength": 5,
      "isBidirectional": false
    }
  ]
}
```

### Complete Meal Example

```json
{
  "id": "meal-002",
  "type": "lunch",
  "name": "Power Greens Bowl",
  "foodIds": [
    "kale-001",
    "black-beans-001",
    "lemon-001",
    "turmeric-001",
    "black-pepper-001"
  ],
  "description": "Maximally optimized for nutrient absorption",
  "synergyScore": 245,
  "prepTimeMinutes": 10,
  "tags": ["high-iron", "anti-inflammatory", "quick-prep"]
}
```

**Score Breakdown**:
- Kale + Lemon: +80 (iron absorption)
- Turmeric + Black Pepper: +95 (curcumin absorption)
- Beans + Lemon: +70 (iron absorption)
- **Total: 245**

This meal is scientifically optimized - the vitamin C from lemon enhances iron absorption from both kale and beans, while black pepper massively increases the bioavailability of turmeric's curcumin.

## Usage Patterns

### Creating a New Food

```typescript
const newFood: Food = {
  id: generateId(),
  name: "Blueberries",
  category: FoodCategory.BERRIES,
  timingRecommendations: [TimingRecommendation.MORNING, TimingRecommendation.ANYTIME],
  servingAmount: { value: 1, unit: MeasurementUnit.CUPS },
  nutritionalHighlights: ["Anthocyanins", "Vitamin C", "Manganese"],
  evidenceTags: ["brain-health", "antioxidant", "anti-aging"],
  isStaple: true
};
```

### Building a Meal with Suggestions

```typescript
// 1. User selects initial food
const selectedFoodIds = ["quinoa-001"];

// 2. System generates suggestions
const suggestions = generateSuggestions(selectedFoodIds, allFoods, allRelationships);

// 3. User adds suggested food
selectedFoodIds.push("kale-001");

// 4. Get updated suggestions
const newSuggestions = generateSuggestions(selectedFoodIds, allFoods, allRelationships);

// 5. Create meal when satisfied
const meal = createMeal({
  type: MealType.LUNCH,
  foodIds: selectedFoodIds
});

// 6. Calculate and display score
const score = calculateMealScore(meal, allFoods, allRelationships);
```

### Generating a Weekly Menu

```typescript
const params: MenuGenerationParams = {
  startDate: "2025-11-18",
  numberOfDays: 7,
  seedFoodIds: ["kale-001", "broccoli-001", "blueberries-001"],
  preferences: {
    dietaryRestrictions: ["plant-based"],
    varietyTarget: 80,
    maxPrepTimeMinutes: 45,
    preferSeasonal: true
  },
  minMealScore: 150,
  maxFoodsPerMeal: 8,
  optimizeForVariety: true
};

const weeklyMenu = generateWeeklyMenu(params, allFoods, allRelationships);
```

## Performance Considerations

### Indexing Strategy

For efficient queries, maintain these lookup maps:

```typescript
const dataMaps: DataMaps = {
  foodsById: new Map(foods.map(f => [f.id, f])),
  relationshipsByFromFood: groupBy(relationships, 'fromFoodId'),
  relationshipsByToFood: groupBy(relationships, 'toFoodId'),
  foodsByCategory: groupBy(foods, 'category')
};
```

### Caching

- Cache meal scores (recalculate only when foods change)
- Cache suggestion lists for common food combinations
- Cache weekly menu analyses

### Complexity

- Meal score calculation: O(n²) where n = foods in meal
- Suggestion generation: O(m × r) where m = candidate foods, r = avg relationships per food
- Weekly menu generation: O(d × meals × candidates) where d = days

## Future Extensions

### Potential Enhancements

1. **Nutritional Targets**: Daily calorie, macro, and micronutrient goals
2. **Recipe Integration**: Full recipe objects with detailed instructions
3. **Shopping Lists**: Auto-generated from weekly menus
4. **Cost Optimization**: Balance nutrition with budget constraints
5. **Seasonal Scoring**: Bonus points for in-season foods
6. **Leftover Tracking**: Suggest meals using remaining ingredients
7. **Meal Prep Optimization**: Group similar prep tasks across the week
8. **Social Features**: Share menus, rate meals, community recipes
9. **AI Menu Generation**: Machine learning for personalized optimization
10. **Nutrient Interaction Graph**: Visualize food synergies as network graphs

## Type Summary

### Core Data Types

1. **Food** - Complete food with categories, properties, benefits, synergies, conflicts, timing, amount, and source references
2. **FoodDatabase** - Complete database structure with metadata, index, and foods array
3. **FoodCategory** - Union type of 13 categories from "How Not to Diet" focus areas
4. **MealTiming** - Union type of 11 timing recommendations
5. **FoodSource** - Page references and quotes from scientific literature

### Synergy Types

1. **FoodSynergy** - Normalized relationship with foodId1 < foodId2, score, and optional reason
2. **FoodSynergyScore** - Detailed analysis of specific food pairing
3. **MealSynergyAnalysis** - Comprehensive analysis including score, foods, pairs, balance, timing, recommendations

### Menu Planning Types

1. **Recipe** - Complete recipe with ingredients, instructions, nutrition, tags, featured foods
2. **DayMenu** - Daily plan with breakfast, lunch, dinner, snacks (all optional)
3. **WeeklyMenu** - 7-day plan with id, name, week, year, days array
4. **WeeklyMenuWithSynergies** - Extended weekly menu with synergy scoring and daily analysis
5. **Ingredient** - Recipe ingredient with name, amount, unit, notes
6. **NutritionInfo** - Nutritional data per serving

### Suggestion Algorithm Types

1. **SuggestionFood** - Lightweight food type for algorithm (id, name, category, allowedMealTypes)
2. **FoodSuggestion** - Suggested food with totalScore and synergyBreakdown
3. **SuggestionOptions** - Configuration (limit, mealContext, minScore, excludeFoodIds)
4. **MealType** - Union type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'any'

### Transformation Types

1. **FoodToSuggestionFood** - Function type to convert Food to SuggestionFood
2. **BuildSynergiesFromFoods** - Function type to build FoodSynergy array from Food array
3. **ValidationResult** - Validation result with valid flag, errors, warnings
4. **ValidateFoodDatabase** - Function type for database validation

## Key Design Patterns

### Normalized Keys
- FoodSynergy uses lexicographically ordered IDs to avoid duplicates
- Key format: `"foodId1:foodId2"` where foodId1 < foodId2

### String-Based Synergies
- Foods store synergies/conflicts as string arrays (food names or categories)
- These are transformed to scored FoodSynergy objects at runtime
- Allows flexible matching (exact names or category matching)

### Optional Chaining
- All meal types (breakfast, lunch, dinner) are optional in DayMenu
- Supports flexible meal planning (skip breakfast, have multiple snacks, etc.)

### Source Tracking
- Every food includes sources.pages and sources.quotes
- Enables scientific verification and citation
- Supports evidence-based decision making

### Type Collections
- Organized into logical groups: FoodTypes, SynergyTypes, MealPlanningTypes, SuggestionTypes
- Facilitates imports and code organization

## References

- **Primary Source**: "The How Not to Diet Cookbook" by Dr. Michael Greger, MD
- **Data File**: `/data/extracted-foods.json`
- **Algorithm**: `/src/utils/suggestions.ts`
- **Types**: `/src/types/schema.ts` and `/src/types/index.ts`
- Nutrient interaction research from clinical nutrition journals
- Evidence-based food combining principles from Dr. Greger's Daily Dozen

---

**Version**: 2.0
**Last Updated**: 2025-11-18
**Schema File**: `/src/types/schema.ts`
**Data Source**: `/data/extracted-foods.json` (10 foods extracted from "How Not to Diet Cookbook")
