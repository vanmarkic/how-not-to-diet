# Food Utilities Quick Reference

Quick reference for common food data operations.

## Import Statements

```typescript
// Data Loading
import {
  loadFoods,
  loadFoodById,
  loadFoodsByCategory,
  loadFoodsByTiming
} from '../utils/dataLoader';

// Food Utilities
import {
  buildSynergyMap,
  convertToSuggestionFoods,
  filterFoods,
  formatFoodForDisplay,
  getCategoryColor
} from '../utils/foodUtils';

// Suggestion Algorithm
import { getTopSuggestions } from '../utils/suggestions';
```

## Common Operations

### Load All Foods
```typescript
const foods = await loadFoods();
```

### Load Specific Food
```typescript
const kale = await loadFoodById('food-2');
```

### Filter by Category
```typescript
const antiInflammatory = await loadFoodsByCategory('anti-inflammatory');
// OR using filterFoods
const antiInflammatory = filterFoods(foods, {
  categories: ['anti-inflammatory']
});
```

### Filter by Timing
```typescript
const breakfastFoods = await loadFoodsByTiming('breakfast');
// OR using filterFoods
const breakfastFoods = filterFoods(foods, {
  timing: ['breakfast']
});
```

### Search Foods
```typescript
const results = filterFoods(foods, {
  searchQuery: 'fiber'
});
```

### Combined Filters
```typescript
const filtered = filterFoods(foods, {
  categories: ['anti-inflammatory', 'high-fiber'],
  timing: ['breakfast'],
  searchQuery: 'oat',
  excludeIds: ['food-5']
});
```

### Build Synergy Map
```typescript
const foods = await loadFoods();
const synergies = buildSynergyMap(foods);
// Returns: FoodSynergy[]
```

### Convert for Suggestions
```typescript
const foods = await loadFoods();
const suggestionFoods = convertToSuggestionFoods(foods);
// Returns: SuggestionFood[]
```

### Get Suggestions
```typescript
const foods = await loadFoods();
const synergies = buildSynergyMap(foods);
const suggestionFoods = convertToSuggestionFoods(foods);

const selected = suggestionFoods.filter(f =>
  ['Kale', 'Beans'].includes(f.name)
);

const suggestions = getTopSuggestions(
  selected,
  suggestionFoods,
  synergies,
  {
    limit: 10,
    mealContext: 'breakfast',
    minScore: 3
  }
);
```

### Format for Display
```typescript
const food = await loadFoodById('food-2');
const display = formatFoodForDisplay(food);

// Use in component:
<h2>{display.title}</h2>
<p>{display.subtitle}</p>
<div className="tags">
  {display.categoryTags.map(tag => (
    <span className={getCategoryColor(tag)}>{tag}</span>
  ))}
</div>
```

### Calculate Synergy Score
```typescript
const foods = await loadFoods();
const kale = getFoodById(foods, 'food-2');
const beans = getFoodById(foods, 'food-1');

const score = calculateFoodSynergyScore(kale, beans, foods);
// Returns: { food1, food2, score, reasons, categoryMatches }
```

### Get Category Distribution
```typescript
const foods = await loadFoods();
const distribution = getCategoryDistribution(foods);
// Returns: { "anti-inflammatory": 8, "high-fiber": 7, ... }
```

### Get Top Synergy Partners
```typescript
const foods = await loadFoods();
const topPartners = getTopSynergyPartners(foods, 10);
// Returns: [["vegetables", 12], ["beans", 8], ...]
```

## Complete Example: Food Suggestion Flow

```typescript
async function getSuggestionsForMeal(
  selectedFoodIds: string[],
  mealType: 'breakfast' | 'lunch' | 'dinner'
) {
  // 1. Load data
  const foods = await loadFoads();

  // 2. Build synergies
  const synergies = buildSynergyMap(foods);

  // 3. Convert to suggestion format
  const suggestionFoods = convertToSuggestionFoods(foods);

  // 4. Get selected foods
  const selected = suggestionFoods.filter(f =>
    selectedFoodIds.includes(f.id)
  );

  // 5. Get suggestions
  const suggestions = getTopSuggestions(
    selected,
    suggestionFoods,
    synergies,
    {
      limit: 10,
      mealContext: mealType,
      minScore: 3
    }
  );

  // 6. Format for display
  return suggestions.map(s => ({
    ...formatFoodForDisplay(
      foods.find(f => f.id === s.food.id)!
    ),
    score: s.totalScore,
    breakdown: s.synergyBreakdown
  }));
}
```

## Food IDs Reference

```
food-1  - Beans (Legumes)
food-2  - Kale
food-3  - Cabbage
food-4  - Vinegar
food-5  - Oat Groats (Whole Intact Oats)
food-6  - Flaxseeds (Ground)
food-7  - Berries
food-8  - Greens (Low-Oxalate)
food-9  - Turmeric
food-10 - Nigella Seeds (Black Cumin)
```

## Categories Reference

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

## Timing Reference

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

## UI Color Classes

```typescript
getCategoryColor('anti-inflammatory')     // 'bg-red-100'
getCategoryColor('high-fiber')            // 'bg-amber-100'
getCategoryColor('low-glycemic')          // 'bg-green-100'
getCategoryColor('rich-in-legumes')       // 'bg-yellow-100'
getCategoryColor('rich-in-vegetables')    // 'bg-green-200'
getCategoryColor('rich-in-fruits')        // 'bg-pink-100'
getCategoryColor('rich-in-whole-grains')  // 'bg-amber-200'
getCategoryColor('greens')                // 'bg-emerald-100'
getCategoryColor('cruciferous')           // 'bg-teal-100'
getCategoryColor('herbs-and-spices')      // 'bg-purple-100'
getCategoryColor('appetite-suppression')  // 'bg-blue-100'
getCategoryColor('weight-loss-booster')   // 'bg-indigo-100'
getCategoryColor('high-water-rich')       // 'bg-cyan-100'
```

## Common Patterns

### React Component: Food Browser
```tsx
import { useState, useEffect } from 'react';
import { loadFoods } from '../utils/dataLoader';
import { filterFoods, formatFoodForDisplay } from '../utils/foodUtils';

export function FoodBrowser() {
  const [foods, setFoods] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadFoods().then(setFoods);
  }, []);

  useEffect(() => {
    setFiltered(filterFoods(foods, { searchQuery: search }));
  }, [search, foods]);

  return (
    <div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search foods..."
      />
      {filtered.map(food => {
        const display = formatFoodForDisplay(food);
        return <FoodCard key={food.id} {...display} />;
      })}
    </div>
  );
}
```

### React Component: Meal Suggestions
```tsx
import { useState, useEffect } from 'react';
import { loadFoods } from '../utils/dataLoader';
import {
  buildSynergyMap,
  convertToSuggestionFoods
} from '../utils/foodUtils';
import { getTopSuggestions } from '../utils/suggestions';

export function MealSuggestions({ selectedIds, mealType }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    async function loadSuggestions() {
      const foods = await loadFoods();
      const synergies = buildSynergyMap(foods);
      const suggestionFoods = convertToSuggestionFoods(foods);

      const selected = suggestionFoods.filter(f =>
        selectedIds.includes(f.id)
      );

      const results = getTopSuggestions(
        selected,
        suggestionFoods,
        synergies,
        { limit: 5, mealContext: mealType }
      );

      setSuggestions(results);
    }

    if (selectedIds.length > 0) {
      loadSuggestions();
    }
  }, [selectedIds, mealType]);

  return (
    <div>
      {suggestions.map(s => (
        <SuggestionCard
          key={s.food.id}
          food={s.food}
          score={s.totalScore}
          breakdown={s.synergyBreakdown}
        />
      ))}
    </div>
  );
}
```

## Performance Tips

1. **Load once, filter many**: Load foods once and filter in memory
2. **Cache synergies**: Build synergy map once at app start
3. **Use Sets for exclusions**: Convert exclude arrays to Sets
4. **Batch conversions**: Convert all foods to suggestion format once

## Error Handling

All loading functions return empty arrays on error and log to console:

```typescript
const foods = await loadFoods(); // Never throws, returns [] on error
if (foods.length === 0) {
  console.log('No foods loaded - check data file');
}
```
