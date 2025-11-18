# Food Data Integration Guide

This document explains how extracted food data flows through the application, from JSON files to the suggestion algorithm and UI components.

## Table of Contents

1. [Overview](#overview)
2. [Data Sources](#data-sources)
3. [Data Loading](#data-loading)
4. [Food Utilities](#food-utilities)
5. [Integration with Suggestion Algorithm](#integration-with-suggestion-algorithm)
6. [Usage Examples](#usage-examples)
7. [Type Definitions](#type-definitions)

## Overview

The food data integration system consists of three main layers:

```
┌─────────────────────────────────────────────────────────────┐
│                     extracted-foods.json                     │
│          (Raw extracted data from source material)           │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                      dataLoader.ts                           │
│              (Load and parse JSON data)                      │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                      foodUtils.ts                            │
│     (Transform, filter, analyze, build synergies)           │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                     suggestions.ts                           │
│           (Synergy-based recommendation algorithm)           │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                    UI Components                             │
│        (Display suggestions, food cards, etc.)               │
└─────────────────────────────────────────────────────────────┘
```

## Data Sources

### Primary Data File

**Location**: `/data/extracted-foods.json`

**Structure**:
```json
{
  "extraction_metadata": {
    "extraction_date": "2025-11-18",
    "source_document": "The How Not to Diet Cookbook -- Michael Greger, MD",
    "focus_areas": [...]
  },
  "extraction_index": [...],
  "foods": [...]
}
```

### Food Object Schema

Each food in the `foods` array contains:

```typescript
{
  id: string;              // "food-1", "food-2", etc.
  name: string;            // "Kale", "Beans (Legumes)", etc.
  categories: string[];    // ["anti-inflammatory", "high-fiber", ...]
  properties: string[];    // Key nutritional properties
  benefits: string;        // Health benefits description
  synergies: string[];     // Foods that pair well
  conflicts: string[];     // Foods to avoid combining
  timing: string[];        // When to eat (breakfast, any-meal, etc.)
  amount: string;          // Recommended serving
  sources: {
    pages: number[];       // Source page references
    quotes: string[];      // Direct quotes from source
  }
}
```

## Data Loading

### Basic Loading

```typescript
import { loadFoods, loadFoodById } from '../utils/dataLoader';

// Load all foods
const foods = await loadFoods();

// Load specific food by ID
const kale = await loadFoodById('food-2');

// Load complete data including metadata
const fullData = await loadExtractedFoodData();
```

### Filtered Loading

```typescript
import { loadFoodsByCategory, loadFoodsByTiming } from '../utils/dataLoader';

// Get all anti-inflammatory foods
const antiInflammatory = await loadFoodsByCategory('anti-inflammatory');

// Get breakfast-appropriate foods
const breakfastFoods = await loadFoodsByTiming('breakfast');
```

## Food Utilities

### Filtering and Search

```typescript
import { filterFoods, searchFoods } from '../utils/foodUtils';

// Filter by multiple criteria
const filtered = filterFoods(foods, {
  categories: ['anti-inflammatory', 'high-fiber'],
  timing: ['breakfast'],
  searchQuery: 'oat',
  excludeIds: ['food-5']
});

// Simple search
const results = searchFoods(foods, 'legumes');
```

### Building Synergy Maps

The synergy map converts food relationships to scored pairings:

```typescript
import { buildSynergyMap } from '../utils/foodUtils';

const foods = await loadFoods();
const synergies = buildSynergyMap(foods);

// Result: FoodSynergy[]
// [
//   {
//     foodId1: "food-1",
//     foodId2: "food-2",
//     score: 5,
//     reason: "Recommended pairing from Beans (Legumes)"
//   },
//   ...
// ]
```

**Synergy Scoring Rules**:
- Explicit synergies: +5 points
- Category-based synergies: +2 points per matching category pair
- Conflicts: -3 points

**Category Compatibility Matrix**:
- Legumes ↔ Vegetables, Greens, Whole Grains
- Vegetables ↔ Legumes, Fruits, Greens
- Anti-inflammatory ↔ Anti-inflammatory, High Fiber
- And more... (see `foodUtils.ts`)

### Display Formatting

```typescript
import { formatFoodForDisplay, getCategoryColor } from '../utils/foodUtils';

const kale = await loadFoodById('food-2');
const display = formatFoodForDisplay(kale);

// Result:
// {
//   title: "Kale",
//   subtitle: "Increased antioxidant capacity...",
//   categoryTags: ["Cruciferous", "Greens", "Anti-Inflammatory"],
//   timingInfo: "Anytime",
//   servingInfo: "Daily consumption recommended",
//   benefits: "Full benefits text",
//   keyProperties: ["Top 3 properties"],
//   synergyPartners: ["Cabbage", "Beans", "Vinegar"]
// }

// Get color for UI theming
const color = getCategoryColor('anti-inflammatory'); // "bg-red-100"
```

### Statistical Analysis

```typescript
import {
  getCategoryDistribution,
  getTopSynergyPartners,
  calculateFoodSynergyScore
} from '../utils/foodUtils';

// Get category distribution
const distribution = getCategoryDistribution(foods);
// { "anti-inflammatory": 8, "high-fiber": 7, ... }

// Get most mentioned synergy partners
const topPartners = getTopSynergyPartners(foods, 10);
// [["vegetables", 12], ["beans", 8], ...]

// Calculate detailed synergy between two foods
const score = calculateFoodSynergyScore(kale, beans, foods);
// {
//   food1: "Kale",
//   food2: "Beans (Legumes)",
//   score: 7,
//   reasons: ["Recommended pairing", "Both are anti-inflammatory"],
//   categoryMatches: ["anti-inflammatory"]
// }
```

## Integration with Suggestion Algorithm

### Data Transformation

The suggestion algorithm uses a different `Food` interface. Transform extracted foods:

```typescript
import { convertToSuggestionFoods } from '../utils/foodUtils';

const extractedFoods = await loadFoods();
const suggestionFoods = convertToSuggestionFoods(extractedFoods);

// Converts:
// {
//   id: "food-1",
//   name: "Beans",
//   categories: ["rich-in-legumes", ...],
//   timing: ["any-meal", "breakfast"]
// }
//
// To:
// {
//   id: "food-1",
//   name: "Beans",
//   category: "rich-in-legumes",
//   allowedMealTypes: ["any", "breakfast"]
// }
```

### Complete Suggestion Flow

```typescript
import { loadFoods } from '../utils/dataLoader';
import { buildSynergyMap, convertToSuggestionFoods } from '../utils/foodUtils';
import { getTopSuggestions } from '../utils/suggestions';

// 1. Load extracted foods
const extractedFoods = await loadFoods();

// 2. Build synergy relationships
const synergies = buildSynergyMap(extractedFoods);

// 3. Convert to suggestion format
const suggestionFoods = convertToSuggestionFoods(extractedFoods);

// 4. Select some foods (user selection)
const selectedFoods = suggestionFoods.filter(f =>
  ['Kale', 'Beans (Legumes)'].includes(f.name)
);

// 5. Get suggestions
const suggestions = getTopSuggestions(
  selectedFoods,
  suggestionFoods,
  synergies,
  {
    limit: 10,
    mealContext: 'breakfast',
    minScore: 3
  }
);

// 6. Display results
suggestions.forEach(suggestion => {
  console.log(suggestion.food.name);
  console.log(`Score: ${suggestion.totalScore}`);

  suggestion.synergyBreakdown.forEach(breakdown => {
    console.log(`  + ${breakdown.selectedFood.name}: ${breakdown.score}`);
    if (breakdown.reason) {
      console.log(`    ${breakdown.reason}`);
    }
  });
});
```

## Usage Examples

### Example 1: Food Card Component

```tsx
import { loadFoods } from '../utils/dataLoader';
import { formatFoodForDisplay, getCategoryColor } from '../utils/foodUtils';

export function FoodCard({ foodId }: { foodId: string }) {
  const [food, setFood] = useState(null);

  useEffect(() => {
    loadFoodById(foodId).then(setFood);
  }, [foodId]);

  if (!food) return <Loading />;

  const display = formatFoodForDisplay(food);

  return (
    <div className="food-card">
      <h2>{display.title}</h2>
      <p>{display.subtitle}</p>

      <div className="categories">
        {display.categoryTags.map(cat => (
          <span
            key={cat}
            className={getCategoryColor(cat)}
          >
            {cat}
          </span>
        ))}
      </div>

      <div className="timing">
        Best timing: {display.timingInfo}
      </div>

      <div className="serving">
        Recommended: {display.servingInfo}
      </div>

      <h3>Key Properties</h3>
      <ul>
        {display.keyProperties.map(prop => (
          <li key={prop}>{prop}</li>
        ))}
      </ul>

      <h3>Pairs Well With</h3>
      <div className="synergy-tags">
        {display.synergyPartners.map(partner => (
          <span key={partner}>{partner}</span>
        ))}
      </div>
    </div>
  );
}
```

### Example 2: Meal Planner with Suggestions

```tsx
import { useState, useEffect } from 'react';
import { loadFoods } from '../utils/dataLoader';
import {
  buildSynergyMap,
  convertToSuggestionFoods
} from '../utils/foodUtils';
import { getTopSuggestions } from '../utils/suggestions';

export function MealPlanner() {
  const [allFoods, setAllFoods] = useState([]);
  const [synergies, setSynergies] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    async function loadData() {
      const foods = await loadFoods();
      const syns = buildSynergyMap(foods);

      setAllFoods(convertToSuggestionFoods(foods));
      setSynergies(syns);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (selectedFoods.length > 0) {
      const suggestions = getTopSuggestions(
        selectedFoods,
        allFoods,
        synergies,
        { limit: 5, mealContext: 'breakfast' }
      );
      setSuggestions(suggestions);
    }
  }, [selectedFoods, allFoods, synergies]);

  return (
    <div>
      <h2>Selected Foods</h2>
      {selectedFoods.map(food => (
        <FoodTag key={food.id} food={food} />
      ))}

      <h2>Suggested Pairings</h2>
      {suggestions.map(suggestion => (
        <SuggestionCard
          key={suggestion.food.id}
          suggestion={suggestion}
        />
      ))}
    </div>
  );
}
```

### Example 3: Search and Filter Interface

```tsx
import { useState, useEffect } from 'react';
import { loadFoods } from '../utils/dataLoader';
import { filterFoods } from '../utils/foodUtils';

export function FoodBrowser() {
  const [allFoods, setAllFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [filters, setFilters] = useState({
    categories: [],
    timing: [],
    searchQuery: ''
  });

  useEffect(() => {
    loadFoods().then(foods => {
      setAllFoods(foods);
      setFilteredFoods(foods);
    });
  }, []);

  useEffect(() => {
    const filtered = filterFoods(allFoods, filters);
    setFilteredFoods(filtered);
  }, [filters, allFoods]);

  return (
    <div>
      <SearchBar
        value={filters.searchQuery}
        onChange={query => setFilters({ ...filters, searchQuery: query })}
      />

      <CategoryFilter
        selected={filters.categories}
        onChange={categories => setFilters({ ...filters, categories })}
      />

      <TimingFilter
        selected={filters.timing}
        onChange={timing => setFilters({ ...filters, timing })}
      />

      <FoodGrid foods={filteredFoods} />
    </div>
  );
}
```

## Type Definitions

### Core Types

```typescript
// Food from extracted data
interface Food {
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

// Food for suggestion algorithm
interface SuggestionFood {
  id: string;
  name: string;
  category: string;
  allowedMealTypes: MealType[];
}

// Synergy relationship
interface FoodSynergy {
  foodId1: string;
  foodId2: string;
  score: number;
  reason?: string;
}

// Suggestion result
interface FoodSuggestion {
  food: SuggestionFood;
  totalScore: number;
  synergyBreakdown: Array<{
    selectedFood: SuggestionFood;
    score: number;
    reason?: string;
  }>;
}
```

### Category Types

```typescript
type FoodCategory =
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

### Timing Types

```typescript
type MealTiming =
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
```

## Summary

The food data integration system provides:

1. **Data Loading**: Simple async functions to load food data from JSON
2. **Synergy Building**: Automatic conversion of food relationships to scored synergies
3. **Filtering**: Flexible filtering by category, timing, and search query
4. **Transformation**: Conversion between data formats for different uses
5. **Display Formatting**: Ready-to-use formatted data for UI components
6. **Statistical Analysis**: Tools for understanding food relationships and distributions
7. **Algorithm Integration**: Seamless connection to the suggestion algorithm

All utilities are fully typed, documented with JSDoc comments, and include usage examples.
