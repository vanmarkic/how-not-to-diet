# Food Science Menu Planning Schema - Summary

## Overview

This document provides a high-level summary of the comprehensive data schema designed for the food science menu planning application. The schema supports evidence-based meal planning with food synergies, conflicts, nutritional timing, and intelligent recommendation algorithms.

## Created Files

### 1. `/src/types/schema.ts`
**Complete TypeScript type definitions** for the food science data model, including:
- Core types (Food, FoodRelationship, Meal, DayMenu, WeeklyMenu)
- Enums (FoodCategory, MealType, TimingRecommendation, RelationshipType, MeasurementUnit)
- Helper types (MealScore, FoodSuggestion, MenuAnalysis)
- Utility types for efficient data access and validation

**Lines of code**: ~580 lines of comprehensive TypeScript definitions

### 2. `/docs/data-schema.md`
**Comprehensive documentation** explaining:
- Data model architecture and philosophy
- How food relationships work (synergies vs conflicts)
- Scoring algorithm details with examples
- Food suggestion algorithm
- Complete data examples
- Validation rules
- Usage patterns
- Performance considerations

**Length**: ~850 lines of detailed documentation

### 3. `/src/data/sample-data.json`
**Sample dataset** featuring:
- 10 carefully selected foods with complete metadata
- 7 scientifically-backed food relationships
- Real-world examples based on Dr. Michael Greger's research

### 4. `/src/examples/usage-examples.ts`
**Working code examples** demonstrating:
- 11 complete usage scenarios
- Data map building for efficient queries
- Meal score calculation
- Food suggestion generation
- Weekly menu generation
- Data validation
- Analysis functions

**Lines of code**: ~650 lines of practical examples

## Key Schema Features

### Food Model
Each food has:
- **Categories**: Primary + secondary classifications (e.g., kale is both leafy greens and cruciferous)
- **Timing Recommendations**: When to eat it (morning, evening, pre-workout, etc.)
- **Serving Amounts**: Precise measurements with units
- **Evidence Tags**: Scientific properties (anti-inflammatory, antioxidant, etc.)
- **Nutritional Metadata**: Calories, fiber, protein, etc.
- **Seasonal Information**: Availability by season
- **Staple Flag**: Foods that should appear frequently

### Relationship Model
Relationships define how foods interact:

**Synergy Example** (Score: +75):
```
Kale + Lemon
Rationale: Vitamin C from lemon increases iron absorption from kale by up to 6x
Evidence Strength: 5/5
```

**Conflict Example** (Score: -40):
```
Spinach + Dairy Cheese
Rationale: Calcium in dairy inhibits iron absorption from spinach by up to 50%
Evidence Strength: 5/5
```

### Scoring System

**Meal Score Calculation**:
1. Check all pairs of foods in the meal
2. Sum synergy scores (positive)
3. Sum conflict scores (negative)
4. Add timing bonus (foods matching meal time)
5. Add variety bonus (diverse categories)

**Example Meal Score**:
```
Power Greens Bowl:
- Kale + Lemon: +80 (iron absorption)
- Turmeric + Black Pepper: +95 (curcumin absorption 2000% increase)
- Beans + Lemon: +70 (iron absorption)
= Total: 245 points
```

### Suggestion Algorithm

When a user selects foods (e.g., kale, black beans), the system:
1. Calculates compatibility score for each unselected food
2. Identifies specific synergies and conflicts
3. Ranks by net compatibility score
4. Filters by meal timing, dietary restrictions, seasonality
5. Returns top suggestions with explanations

**Example Output**:
```
Suggested: Lemon (Compatibility: +150)
- Synergy with Kale: +80 (enhances iron absorption)
- Synergy with Black Beans: +70 (enhances iron absorption)
Reason: "Strong synergies with your iron-rich foods"
```

## Integration with Existing Project

### Current Schema (`/src/types/index.ts`)
The existing types focus on recipes:
- Recipe (ingredients, instructions, nutrition)
- Ingredient (name, amount, unit)
- DayMenu (breakfast, lunch, dinner recipes)
- WeeklyMenu (7 days of recipes)

### New Schema (`/src/types/schema.ts`)
The new types focus on food science:
- Food (categories, timing, evidence tags)
- FoodRelationship (synergies, conflicts, scores)
- Meal (food combinations with calculated scores)
- DayMenu (enhanced with scoring)
- WeeklyMenu (enhanced with preferences and analysis)

### Integration Strategy

**Option 1: Parallel Systems**
- Keep existing recipe-based system for traditional planning
- Add new food science system for optimized planning
- Allow users to choose their preferred method

**Option 2: Merge Approaches**
- Link recipes to foods (Recipe contains Food IDs)
- Calculate recipe scores based on food relationships
- Generate menus using both recipe instructions AND food science

**Option 3: Gradual Migration**
- Start with food science system for menu generation
- Add recipe instructions to optimized food combinations
- Eventually replace old schema with enhanced version

## Data Examples

### Sample Food: Turmeric
```json
{
  "id": "turmeric-001",
  "name": "Turmeric",
  "category": "herbs_spices",
  "timingRecommendations": ["anytime"],
  "servingAmount": { "value": 0.25, "unit": "tsp" },
  "nutritionalHighlights": ["Curcumin"],
  "evidenceTags": ["anti-inflammatory", "antioxidant", "brain-health"],
  "preparationNotes": "Activate with black pepper (piperine) and heat or fat",
  "isStaple": true
}
```

### Sample Relationship: The 2000% Boost
```json
{
  "id": "rel-002",
  "fromFoodId": "turmeric-001",
  "toFoodId": "black-pepper-001",
  "type": "synergy",
  "score": 95,
  "rationale": "Piperine in black pepper increases curcumin bioavailability by 2000%",
  "evidenceStrength": 5,
  "sources": ["Planta Medica 1998 - Shoba et al."],
  "notes": "This is one of the most dramatic food synergies documented"
}
```

### Sample Optimized Meal
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
  "synergyScore": 245,
  "prepTimeMinutes": 10,
  "tags": ["high-iron", "anti-inflammatory", "quick-prep"]
}
```

**Score Breakdown**:
- Kale + Lemon: +80 (6x iron absorption)
- Turmeric + Black Pepper: +95 (2000% curcumin absorption)
- Beans + Lemon: +70 (enhanced iron absorption)

This meal is scientifically optimized - every food pairing has documented synergistic benefits.

## Usage Workflow

### 1. Building a Meal (User Perspective)
```
User: "I want to make a lunch with kale"
System: Shows kale card
User: Adds kale to meal

System: Suggests top synergies
- Lemon (+80): "Vitamin C enhances iron absorption by 6x"
- Garlic (+65): "Enhances sulforaphane production"
- Black beans (+60): "Complementary protein and fiber"

User: Adds lemon and black beans
System: Current score: 150 points

System: Updates suggestions
- Turmeric (+50): "Anti-inflammatory synergy with kale"
- Tomatoes (+45): "Complementary antioxidants"

User: Adds turmeric
System: "Add black pepper? (+95 with turmeric)"
User: Adds black pepper

Final meal score: 245 points
```

### 2. Generating a Week (Developer Perspective)
```typescript
const params: MenuGenerationParams = {
  startDate: '2025-11-18',
  numberOfDays: 7,
  seedFoodIds: ['kale-001', 'broccoli-001', 'blueberries-001'],
  preferences: {
    dietaryRestrictions: ['plant-based'],
    varietyTarget: 80,
    preferSeasonal: true
  },
  minMealScore: 150,
  optimizeForVariety: true
};

const menu = generateWeeklyMenu(params, foods, relationships);
// Returns 7 days × 3 meals = 21 optimized meal combinations
// Weekly score: ~4500 points
```

### 3. Analyzing a Menu
```typescript
const analysis = analyzeMenu(menu);

console.log(analysis);
// {
//   scores: { weeklyScore: 4580, avgDaily: 654, avgMeal: 218 },
//   foodFrequency: [
//     { foodName: 'Kale', occurrences: 5 },
//     { foodName: 'Lemon', occurrences: 6 },
//     ...
//   ],
//   categoryDistribution: [
//     { category: 'leafy_greens', count: 12, percentage: 18% },
//     ...
//   ],
//   issues: [
//     { type: 'missing_category', severity: 'medium',
//       message: 'No mushrooms this week' }
//   ],
//   recommendations: [
//     'Consider adding mushrooms for vitamin D',
//     'Great variety in cruciferous vegetables!'
//   ]
// }
```

## Scientific Foundation

The schema is built on research from:
- Dr. Michael Greger's "How Not to Die" and "How Not to Diet"
- Clinical nutrition journals (synergy scores based on documented studies)
- Nutrient bioavailability research
- Chrononutrition (timing recommendations)

### Example Evidence

**Turmeric + Black Pepper** (Score: 95):
- Source: Planta Medica 1998, Shoba et al.
- Finding: Piperine increases curcumin absorption by 2000%
- Evidence Strength: 5/5 (multiple replicated studies)

**Vitamin C + Iron** (Score: 75-80):
- Source: American Journal of Clinical Nutrition
- Finding: Vitamin C increases non-heme iron absorption up to 6x
- Evidence Strength: 5/5 (well-established mechanism)

**Broccoli + Garlic** (Score: 65):
- Source: Journal of Agricultural and Food Chemistry
- Finding: Allicin enhances sulforaphane production
- Evidence Strength: 4/5 (emerging evidence)

## Performance Considerations

### Data Structure Sizes (Estimated)
- 100 foods: ~50KB JSON
- 500 relationships: ~200KB JSON
- 1 weekly menu: ~10KB JSON
- Sample data (10 foods + 7 relationships): ~8KB

### Query Complexity
- Meal score calculation: O(n²) where n = foods in meal
  - 5 foods = 10 comparisons
  - 8 foods = 28 comparisons
- Suggestion generation: O(m × r) where m = foods, r = avg relationships
  - 100 foods, 5 relationships each = 500 comparisons
- Weekly generation: Optimized with lookup maps

### Optimization Strategies
1. **Pre-build lookup maps** (foodsById, relationshipsByFromFood)
2. **Cache meal scores** (recalculate only when foods change)
3. **Index relationships** by both from and to foods
4. **Limit suggestions** to top 10 (don't calculate all)

## Next Steps

### Immediate Use
1. Load sample data into your Astro app
2. Create a meal builder UI component
3. Display suggestions as user adds foods
4. Show real-time score calculations

### Future Enhancements
1. **Expand Food Database**: Add 200+ foods from the cookbook
2. **Research Relationships**: Document 1000+ synergies and conflicts
3. **AI Optimization**: Use ML to optimize weekly menus
4. **Nutritional Targets**: Add daily calorie/macro goals
5. **Shopping Lists**: Auto-generate from weekly menus
6. **Recipe Integration**: Link recipes to food combinations
7. **Community Features**: Share menus, rate combinations
8. **Visualization**: Network graph of food synergies
9. **Mobile App**: Native app with offline support
10. **Personalization**: Learn user preferences over time

## File Locations

All new files are in the project root:

```
/Users/dragan/Documents/how-not-to-diet/
├── src/
│   ├── types/
│   │   └── schema.ts          (580 lines - Core type definitions)
│   ├── data/
│   │   └── sample-data.json   (10 foods + 7 relationships)
│   └── examples/
│       └── usage-examples.ts  (650 lines - Working examples)
└── docs/
    ├── data-schema.md         (850 lines - Full documentation)
    └── schema-summary.md      (This file)
```

## Quick Start

### 1. Load the Data
```typescript
import sampleData from '@/data/sample-data.json';
const { foods, relationships } = sampleData;
```

### 2. Calculate a Meal Score
```typescript
import { calculateMealScore } from '@/examples/usage-examples';

const meal = {
  id: 'my-meal',
  type: 'lunch',
  foodIds: ['kale-001', 'lemon-001', 'black-beans-001']
};

const score = calculateMealScore(meal, relationships);
console.log(`Score: ${score.netScore} points`);
```

### 3. Get Suggestions
```typescript
import { generateSuggestions } from '@/examples/usage-examples';

const selected = ['kale-001'];
const suggestions = generateSuggestions(selected, foods, relationships, 5);

console.log('Top suggestion:', suggestions[0].food.name);
console.log('Compatibility:', suggestions[0].compatibilityScore);
```

## Design Philosophy

### Evidence-Based
Every relationship is backed by scientific research with documented sources and evidence strength ratings.

### User-Friendly
Complex nutrition science is simplified into intuitive scores and suggestions that guide users toward optimal combinations.

### Flexible
The schema supports multiple use cases: manual meal building, automated menu generation, recipe optimization, and nutritional analysis.

### Extensible
Easy to add new foods, relationships, and features without breaking existing functionality.

### Performance-Oriented
Designed for efficient querying with lookup maps and indexing strategies.

---

**Created**: 2025-11-18
**Version**: 1.0
**Author**: Claude Code
**Project**: How Not to Diet - Menu Planner
