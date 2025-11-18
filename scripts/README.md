# Food Data Management Scripts

This directory contains scripts for managing the food database in the hybrid approach:
- Individual source files in `data/foods/*.json`
- Build-time aggregation to `dist/foods-bundle.json`

## Scripts Overview

### `aggregate-foods.js`

**Purpose:** Aggregates individual food JSON files into a single bundle for production use.

**Usage:**
```bash
npm run build:foods
# or
node scripts/aggregate-foods.js
```

**What it does:**
1. Reads `data/index.json` for metadata
2. Reads all `data/foods/*.json` files
3. Validates basic structure
4. Sorts foods by ID
5. Builds category index
6. Writes to `dist/foods-bundle.json`

**Output:**
```json
{
  "extraction_metadata": {...},
  "build_metadata": {
    "build_timestamp": "2025-11-18T...",
    "total_foods": 10,
    "total_categories": 8
  },
  "categories": ["anti-inflammatory", "cruciferous", ...],
  "foods": [...]
}
```

### `validate-foods.js`

**Purpose:** Validates all food files against the schema.

**Usage:**
```bash
npm run validate:foods
# or
node scripts/validate-foods.js
```

**Checks:**
- Required fields present (id, name, categories, properties, benefits, sources)
- ID format matches `food-{number}`
- Categories are valid
- Timing values are valid
- No duplicate IDs
- Valid JSON syntax

**Exit codes:**
- `0` - All validations passed
- `1` - Validation errors found

### `split-foods.js`

**Purpose:** Migrates from single file to individual files (one-time migration).

**Usage:**
```bash
npm run split:foods
# or
node scripts/split-foods.js
```

**What it does:**
1. Reads `data/extracted-foods.json`
2. Extracts metadata to `data/index.json`
3. Creates `data/foods/{slug}.json` for each food
4. Handles slug collisions

**Use this once** when migrating from Approach 1 to Approach 3.

### `new-food-template.js`

**Purpose:** Creates a new food file from a template with the next available ID.

**Usage:**
```bash
npm run new:food
# or
node scripts/new-food-template.js
```

**Interactive prompt:**
```
Food name (e.g., "Beans (Legumes)"): Almonds
✓ Created new food file:
  File: data/foods/almonds.json
  ID: food-11
```

**Generated template:**
```json
{
  "id": "food-11",
  "name": "Almonds",
  "categories": [],
  "properties": [],
  "benefits": "",
  "synergies": [],
  "conflicts": [],
  "timing": [],
  "amount": "",
  "sources": {
    "pages": [],
    "quotes": []
  }
}
```

## Workflow

### Adding a New Food

1. **Create template:**
   ```bash
   npm run new:food
   ```

2. **Edit the file:**
   ```bash
   # Opens data/foods/almonds.json
   code data/foods/almonds.json
   ```

3. **Fill in the data:**
   ```json
   {
     "id": "food-11",
     "name": "Almonds",
     "categories": ["rich-in-nuts", "high-fiber"],
     "properties": [
       "High in vitamin E",
       "Good source of healthy fats"
     ],
     "benefits": "Supports heart health and weight management",
     "synergies": ["greens", "berries"],
     "conflicts": [],
     "timing": ["any-meal", "snacks"],
     "amount": "1 ounce daily",
     "sources": {
       "pages": [45, 67],
       "quotes": ["Almonds are a great source of..."]
     }
   }
   ```

4. **Validate:**
   ```bash
   npm run validate:foods
   ```

5. **Build bundle:**
   ```bash
   npm run build:foods
   ```

### Parallel Food Extraction (Team Workflow)

**Scenario:** 3 people extracting foods simultaneously

**Person A:**
```bash
npm run new:food
# Creates data/foods/almonds.json (food-11)
git add data/foods/almonds.json
git commit -m "Add almonds food entry"
git push
```

**Person B (at the same time):**
```bash
npm run new:food
# Creates data/foods/walnuts.json (food-12)
git add data/foods/walnuts.json
git commit -m "Add walnuts food entry"
git push
```

**Person C (at the same time):**
```bash
npm run new:food
# Creates data/foods/cashews.json (food-13)
git add data/foods/cashews.json
git commit -m "Add cashews food entry"
git push
```

**Result:** Zero merge conflicts. Everyone can push independently.

### Building for Production

The `prebuild` script automatically runs validation and aggregation:

```bash
npm run build
# Runs: validate:foods → build:foods → astro build
```

Or manually:
```bash
npm run validate:foods
npm run build:foods
npm run build
```

## Schema Reference

### Required Fields

```typescript
{
  id: string;              // Format: "food-{number}"
  name: string;            // Display name
  categories: string[];    // See valid categories below
  properties: string[];    // Array of property descriptions
  benefits: string;        // Health benefits paragraph
  sources: {
    pages: number[];       // Page numbers from book
    quotes: string[];      // Exact quotes from book
  }
}
```

### Optional Fields

```typescript
{
  synergies: string[];     // Foods that work well together
  conflicts: string[];     // Foods to avoid combining
  timing: string[];        // When to eat (see valid values)
  amount: string;          // Recommended serving size
}
```

### Valid Categories

```
rich-in-legumes
rich-in-vegetables
rich-in-fruits
rich-in-whole-grains
cruciferous
greens
high-fiber
high-water-rich
anti-inflammatory
low-glycemic
herbs-and-spices
appetite-suppression
weight-loss-booster
```

### Valid Timing Values

```
any-meal
breakfast
lunch
dinner
snacks
with-meals
in-cooking
earlier-in-meal
earlier-in-meal-for-maximum-benefit
particularly-effective-in-soups
daily
can-sprinkle-on-meals
```

## File Naming Convention

Food files are named using slugified versions of the food name:

```
"Beans (Legumes)" → beans-legumes.json
"Kale" → kale.json
"Oat Groats (Whole Intact Oats)" → oat-groats-whole-intact-oats.json
```

**Slug rules:**
1. Convert to lowercase
2. Remove parentheses
3. Replace spaces with hyphens
4. Remove special characters
5. Collapse multiple hyphens
6. Trim hyphens from ends

## Troubleshooting

### "No food files found"

Make sure you have created at least one food file in `data/foods/`:

```bash
npm run new:food
```

### "Invalid category"

Check that your categories match the valid list. Common mistake:

```json
// Wrong
"categories": ["anti inflammatory"]

// Correct
"categories": ["anti-inflammatory"]
```

### "Duplicate ID"

Two files have the same ID. Find duplicates:

```bash
grep -h '"id"' data/foods/*.json | sort | uniq -d
```

Fix by updating one file to use the next available ID.

### "Missing required field"

All foods must have:
- `id`
- `name`
- `categories` (at least one)
- `properties` (array, can be empty)
- `benefits` (string, can be empty)
- `sources` (with `pages` and `quotes` arrays)

### Build fails during Astro build

Make sure you've run the aggregation:

```bash
npm run build:foods
```

And that `dist/foods-bundle.json` exists.

## Development Tips

### Quick Validation Loop

```bash
# Watch for changes and validate
watch -n 1 npm run validate:foods
```

### Testing Individual Food Files

```bash
# Validate JSON syntax
jq . data/foods/almonds.json

# Pretty-print
jq . data/foods/almonds.json | less

# Check specific field
jq '.categories' data/foods/almonds.json
```

### Bulk Operations

**Add a field to all foods:**
```bash
for file in data/foods/*.json; do
  jq '. + {new_field: "value"}' "$file" > tmp.json
  mv tmp.json "$file"
done
```

**Find foods in a category:**
```bash
grep -l "anti-inflammatory" data/foods/*.json
```

**Count foods by category:**
```bash
jq -r '.categories[]' data/foods/*.json | sort | uniq -c | sort -rn
```

## CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/validate.yml
name: Validate Foods
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run validate:foods
      - run: npm run build:foods
```

This ensures all PRs have valid food data before merging.
