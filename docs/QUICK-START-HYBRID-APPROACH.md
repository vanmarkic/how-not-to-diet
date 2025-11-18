# Quick Start: Hybrid Data Organization Approach

This guide helps you get started with the hybrid food data organization approach.

## What is the Hybrid Approach?

**Development:** Individual JSON files per food (`data/foods/*.json`)
**Production:** Single aggregated bundle (`dist/foods-bundle.json`)

**Benefits:**
- No merge conflicts during parallel work
- Fast file navigation (CMD+P to jump to any food)
- Optimal runtime performance (single file load)
- Easy to maintain and validate

## Setup (First Time)

### Option A: Starting Fresh

If you're starting from scratch:

```bash
# 1. Create directory structure
mkdir -p data/foods

# 2. Create your first food
npm run new:food
# Enter: "Beans (Legumes)"

# 3. Edit the generated file
code data/foods/beans-legumes.json

# 4. Validate and build
npm run validate:foods
npm run build:foods
```

### Option B: Migrating from Single File

If you already have `data/extracted-foods.json`:

```bash
# 1. Split the existing file
npm run split:foods

# This creates:
# - data/index.json (metadata)
# - data/foods/*.json (10 individual files)

# 2. Verify the split worked
ls data/foods/

# 3. Build the bundle
npm run build:foods

# 4. Update your imports (see below)

# 5. (Optional) Backup and remove old file
mv data/extracted-foods.json data/extracted-foods.json.backup
```

## Daily Workflow

### Adding a New Food

```bash
# 1. Create template
npm run new:food
# Enter food name: "Almonds"

# 2. Edit the file
code data/foods/almonds.json

# 3. Fill in data (see template below)

# 4. Validate
npm run validate:foods

# 5. Rebuild bundle
npm run build:foods

# 6. Commit
git add data/foods/almonds.json
git commit -m "Add almonds food entry"
git push
```

### Updating an Existing Food

```bash
# 1. Find and edit the file
code data/foods/kale.json

# 2. Make your changes

# 3. Validate
npm run validate:foods

# 4. Rebuild
npm run build:foods

# 5. Commit
git add data/foods/kale.json
git commit -m "Update kale benefits"
git push
```

### Building for Production

```bash
# During development
npm run dev
# Automatically validates and builds foods before starting dev server

# For production build
npm run build
# Runs: validate:foods → build:foods → astro build
```

## Food File Template

```json
{
  "id": "food-11",
  "name": "Almonds",
  "categories": [
    "rich-in-nuts",
    "high-fiber",
    "anti-inflammatory"
  ],
  "properties": [
    "High in vitamin E",
    "Good source of healthy fats",
    "Rich in magnesium"
  ],
  "benefits": "Supports heart health and weight management. Helps reduce LDL cholesterol and inflammation.",
  "synergies": ["greens", "berries"],
  "conflicts": [],
  "timing": ["any-meal", "snacks"],
  "amount": "1 ounce daily (about 23 almonds)",
  "sources": {
    "pages": [45, 67, 89],
    "quotes": [
      "Almonds are a great source of vitamin E and healthy fats..."
    ]
  }
}
```

## Using the Data in Astro

### Import the Bundle

```typescript
// src/pages/index.astro
---
import { loadFoodBundle } from '../utils/food-loader';

// Load at build time (SSG)
const foodData = await loadFoodBundle();
const foods = foodData.foods;
---

<h1>Foods Database ({foods.length} foods)</h1>

{foods.map(food => (
  <div>
    <h2>{food.name}</h2>
    <p>{food.benefits}</p>
  </div>
))}
```

### Using Helper Functions

```typescript
// src/pages/categories.astro
---
import { getAllCategories, getFoodsByCategory } from '../utils/food-loader';

const categories = await getAllCategories();
const antInflammatoryFoods = await getFoodsByCategory('anti-inflammatory');
---

<h1>Categories</h1>
<ul>
  {categories.map(cat => <li>{cat}</li>)}
</ul>

<h2>Anti-Inflammatory Foods</h2>
{antInflammatoryFoods.map(food => (
  <div>{food.name}</div>
))}
```

### Search Example

```typescript
// src/pages/search.astro
---
import { searchFoods } from '../utils/food-loader';

const query = Astro.url.searchParams.get('q') || '';
const results = query ? await searchFoods(query) : [];
---

<form>
  <input name="q" value={query} placeholder="Search foods..." />
  <button>Search</button>
</form>

{results.map(food => (
  <div>{food.name} - {food.benefits}</div>
))}
```

## Available npm Scripts

| Command | Description |
|---------|-------------|
| `npm run new:food` | Create new food template |
| `npm run validate:foods` | Validate all food files |
| `npm run build:foods` | Aggregate foods into bundle |
| `npm run split:foods` | Migrate from single file (one-time) |
| `npm run dev` | Start dev server (auto-builds foods) |
| `npm run build` | Build for production (auto-validates) |

## Directory Structure

```
data/
  index.json                  # Metadata (committed to git)
  foods/                      # Individual food files (committed)
    beans-legumes.json
    kale.json
    cabbage.json
    ...
  extracted-foods.json.backup # Old file (optional backup)

dist/
  foods-bundle.json          # Generated bundle (gitignored)

scripts/
  aggregate-foods.js         # Build script
  validate-foods.js          # Validation script
  new-food-template.js       # Template generator
  split-foods.js             # Migration script
  README.md                  # Scripts documentation

src/
  utils/
    food-loader.ts           # Loader utilities

examples/
  astro-usage.astro          # Example Astro page
```

## Common Tasks

### Find All Foods in a Category

```bash
# Using grep
grep -l "anti-inflammatory" data/foods/*.json

# Using jq
for file in data/foods/*.json; do
  if jq -e '.categories[] | select(. == "anti-inflammatory")' "$file" > /dev/null; then
    echo "$file"
  fi
done
```

### Count Total Foods

```bash
ls data/foods/*.json | wc -l
```

### List All Categories

```bash
jq -r '.categories[]' data/foods/*.json | sort -u
```

### Find Foods Missing a Field

```bash
# Find foods without synergies
for file in data/foods/*.json; do
  if ! jq -e '.synergies | length > 0' "$file" > /dev/null; then
    echo "$file: No synergies defined"
  fi
done
```

### Batch Update All Foods

```bash
# Add a new field to all foods
for file in data/foods/*.json; do
  jq '. + {preparation_time: "varies"}' "$file" > tmp.json
  mv tmp.json "$file"
done

# Validate and rebuild
npm run validate:foods
npm run build:foods
```

## Troubleshooting

### "File not found: dist/foods-bundle.json"

Run the build script:
```bash
npm run build:foods
```

### "Validation errors"

Check the error messages and fix the indicated files:
```bash
npm run validate:foods
```

Common issues:
- Missing required fields
- Invalid category names (check valid list)
- Wrong ID format (must be `food-{number}`)

### "Duplicate ID"

Find the duplicate:
```bash
grep -h '"id"' data/foods/*.json | sort | uniq -d
```

Fix by assigning a new unique ID to one of the files.

### Build Is Slow

Normal build times:
- 10 foods: ~50ms
- 50 foods: ~100ms
- 200 foods: ~200ms

If slower, check for:
- Large quote arrays (consider truncating)
- Circular dependencies in synergies
- File system issues (run `npm run validate:foods`)

## Best Practices

### 1. Always Validate Before Committing

```bash
npm run validate:foods && git add . && git commit -m "message"
```

### 2. Use Descriptive Commit Messages

```bash
# Good
git commit -m "Add almonds with vitamin E properties"

# Bad
git commit -m "Update food"
```

### 3. Keep Properties Concise

```json
// Good
"properties": [
  "High in vitamin E",
  "Good source of healthy fats"
]

// Too verbose
"properties": [
  "Almonds are really high in vitamin E which is an antioxidant..."
]
```

### 4. Reference Page Numbers

Always include page sources for verification:

```json
"sources": {
  "pages": [45, 67],
  "quotes": ["Direct quote from page 45..."]
}
```

### 5. Use Consistent Timing Values

Stick to the predefined timing values:
- `any-meal`
- `breakfast`
- `earlier-in-meal`
- etc.

### 6. Link Synergies Properly

Use exact food names or general categories:

```json
// Good
"synergies": ["kale", "greens", "beans"]

// Unclear
"synergies": ["other vegetables"]
```

## Performance Tips

### For Large Datasets (100+ foods)

1. **Index Generation:** The build script automatically creates a category index

2. **Lazy Loading:** For client-side apps, consider loading categories on demand:

```typescript
// Load just metadata first
const metadata = await fetch('/dist/foods-metadata.json').then(r => r.json());

// Load full data when needed
const fullData = await fetch('/dist/foods-bundle.json').then(r => r.json());
```

3. **Search Optimization:** Build a search index during aggregation:

```javascript
// In aggregate-foods.js
const searchIndex = foods.map(f => ({
  id: f.id,
  name: f.name.toLowerCase(),
  categories: f.categories
}));
```

## Migration Path

If you want to migrate from Approach 3 back to Approach 1:

```bash
# Simply use the generated bundle as your single file
cp dist/foods-bundle.json data/extracted-foods.json

# Remove individual files (backup first!)
tar -czf data-foods-backup.tar.gz data/foods/
rm -rf data/foods/
```

This flexibility means you're never locked into the hybrid approach.

## Next Steps

1. Read the full analysis: [`docs/DATA-ORGANIZATION-ANALYSIS.md`](./DATA-ORGANIZATION-ANALYSIS.md)
2. Review scripts documentation: [`scripts/README.md`](../scripts/README.md)
3. Check the example page: [`examples/astro-usage.astro`](../examples/astro-usage.astro)
4. Start extracting foods: `npm run new:food`

## Getting Help

Common resources:
- [Full analysis document](./DATA-ORGANIZATION-ANALYSIS.md)
- [Scripts README](../scripts/README.md)
- [Food loader utilities](../src/utils/food-loader.ts)
- [Example Astro page](../examples/astro-usage.astro)

For issues:
1. Check validation output: `npm run validate:foods`
2. Review this guide's troubleshooting section
3. Check git status for uncommitted changes
4. Verify dist/foods-bundle.json exists
