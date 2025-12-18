# How Not to Diet - Weekly Menu Planner - User Guide

## What You Have

A fully functional web application for planning weekly menus based on food synergies from "The How Not to Diet Cookbook" by Dr. Michael Greger.

## Quick Start

The app is currently running at: **http://localhost:3006/**

### Available Pages

1. **Home** (/) - Overview of features and data sources
2. **Weekly Planner** (/planner) - Auto-generated 7-day meal plan with synergies
3. **Synergy Analysis** (/meal-planner) - Analyze food synergies in your meals
4. **Food Selection** (/food-selector) - Interactive food selection interface
5. **Foods Database** (/foods) - Browse all 10+ extracted foods with details
6. **Combos** (/combos) - Discover powerful food combinations
7. **Recipes** (/recipes) - View sample recipes

## Key Features

### 1. Food Synergies Database
- **10 foods extracted** from the cookbook with complete data:
  - Beans (Legumes)
  - Kale
  - Cabbage
  - Vinegar
  - Oat Groats
  - Flaxseeds
  - Berries
  - Greens (Low-Oxalate)
  - Turmeric
  - Nigella Seeds

- **Each food includes**:
  - Categories (anti-inflammatory, high-fiber, etc.)
  - Health benefits
  - Synergies (which foods work well together)
  - Conflicts (foods to avoid combining)
  - Optimal timing (breakfast, lunch, dinner, any-meal)
  - Recommended amounts
  - Source pages from the book
  - Direct quotes from the cookbook

### 2. Weekly Planner
- Auto-generates a complete 7-day meal plan
- Maximizes food synergies
- Tracks Daily Dozen coverage
- Implements 21 Tweaks for weight loss
- Shows breakfast, lunch, and dinner for each day
- Displays category coverage and amounts

**Daily Dozen Tracking**:
- Beans (3 servings)
- Berries (1 serving)
- Cruciferous Vegetables (1 serving)
- Greens (2 servings)
- Flaxseeds (1 serving)
- Whole Grains (3 servings)
- Herbs & Spices (1 serving)

**21 Tweaks Integration**:
- Vinegar with each meal (2 tsp)
- Nigella seeds (1/4 tsp daily)
- Turmeric daily
- Ginger (1 tsp daily)

### 3. Food Combinations
- **Top Triple Combos**: Best 3-food combinations for complete meals
- **Top Pairs**: Scientifically-backed 2-food synergies
- **Quick Meal Ideas**: Pre-built meal combinations with benefits
- **Synergy Scores**: Numerical rankings for each combination

### 4. Synergy Analysis
- Upload or select recipes
- Automatically detects foods in ingredients
- Calculates synergy scores
- Shows which foods work well together
- Identifies category balance
- Provides recommendations for improvement
- Checks Daily Dozen compliance

## How to Use

### Browse Foods
1. Go to **Foods** page
2. Scroll through the food cards
3. Each card shows:
   - Food name and categories
   - Health benefits
   - Foods that synergize well
   - Best timing for consumption
   - Recommended daily amount
   - Source pages and quotes

### Discover Combos
1. Go to **Combos** page
2. View **Top Triple Combos** for meal building
3. Check **Top Food Pairs** for simple combinations
4. Use **Quick Meal Ideas** for instant inspiration
5. Each combo shows:
   - Synergy score (higher = better)
   - Categories covered
   - Best timing
   - Health benefits

### Plan Your Week
1. Go to **Weekly Planner** page
2. View the auto-generated 7-day plan
3. See:
   - Breakfast, lunch, dinner for each day
   - Food amounts for each meal
   - Daily Dozen coverage per day
   - 21 Tweaks applied
   - Weekly statistics
4. Use action buttons (future feature):
   - Download shopping list
   - Print weekly plan
   - Export to calendar

### Analyze Synergies
1. Go to **Synergy Analysis** page
2. View analysis of sample recipes
3. See:
   - Overall synergy score
   - Foods included
   - Synergy pairs detected
   - Category balance
   - Recommendations for improvement

## Understanding Synergy Scores

### What is a Synergy Score?
A numerical value indicating how well foods work together based on:
- Direct synergy mentions in the cookbook
- Shared health categories
- Compatible timing
- Complementary properties

### Score Ranges
- **0-20**: Neutral combination
- **20-40**: Good pairing
- **40-60**: Excellent synergy
- **60+**: Optimal combination

### Triple Combo Scores
Triple combos (3 foods) typically score higher because:
- More category coverage
- More synergy opportunities
- Better Daily Dozen fulfillment

## Food Categories Explained

### Nutritional Categories
- **rich-in-legumes**: Beans, chickpeas, lentils, split peas
- **rich-in-vegetables**: Kale, cabbage, greens
- **rich-in-whole-grains**: Oat groats, whole grains
- **rich-in-fruits**: Berries and other fruits
- **cruciferous**: Kale, cabbage, broccoli family
- **greens**: Leafy green vegetables

### Functional Categories
- **anti-inflammatory**: Reduces inflammation
- **high-fiber**: Promotes digestive health
- **high-water-rich**: High water content foods
- **low-glycemic**: Low glycemic load
- **appetite-suppression**: Helps control hunger
- **weight-loss-booster**: From 21 Tweaks
- **herbs-and-spices**: Turmeric, ginger, etc.

## Best Practices

### Daily Dozen Goals
Try to include these daily:
1. Beans - 3 servings
2. Berries - 1 serving
3. Other fruits - 3 servings
4. Cruciferous vegetables - 1 serving
5. Greens - 2 servings
6. Other vegetables - 2 servings
7. Flaxseeds - 1 tablespoon
8. Nuts and seeds - 1 serving
9. Herbs and spices - 1/4 teaspoon turmeric
10. Whole grains - 3 servings
11. Beverages - 5 glasses of water
12. Exercise - 90 minutes moderate or 40 minutes vigorous

### 21 Tweaks to Maximize
From the cookbook:
1. **Vinegar**: 2 tsp with each meal
2. **Nigella seeds**: 1/4 tsp daily
3. **Turmeric**: Daily in cooking
4. **Ginger**: 1 tsp daily
5. **Eat greens earlier in the meal**
6. **Choose whole, intact grains** (groats over rolled)

### Meal Timing
- **Breakfast**: Oats, berries, flaxseeds
- **Lunch**: Salads with greens, cruciferous vegetables, vinegar
- **Dinner**: Beans, greens, herbs & spices
- **Any meal**: Most vegetables, whole grains

## Customization

### Adding More Foods
1. Edit `data/extracted-foods.json`
2. Follow the existing structure:
```json
{
  "id": "food-11",
  "name": "Food Name",
  "categories": ["category1", "category2"],
  "properties": ["Property 1", "Property 2"],
  "benefits": "Health benefits description",
  "synergies": ["food-it-works-with"],
  "conflicts": ["foods-to-avoid"],
  "timing": ["breakfast", "any-meal"],
  "amount": "1 serving daily",
  "sources": {
    "pages": [20, 30],
    "quotes": ["Quote from book"]
  }
}
```

### Adding Recipes
1. Edit `data/recipes.json`
2. Add new recipe with ingredients and instructions
3. The synergy engine will automatically analyze it

## Technical Notes

### Built With
- **Astro 4.16.19**: Static site generator
- **TypeScript 5.7.2**: Type safety
- **No external UI libraries**: Pure HTML/CSS

### Data Sources
- Extracted from "The How Not to Diet Cookbook" (2020)
- Focus areas: Anti-inflammatory, high fiber, high water-rich, low glycemic load
- Source tracking with page numbers and direct quotes

### Performance
- Static HTML pages (extremely fast)
- No JavaScript required for basic functionality
- Builds to pure static files

## Troubleshooting

### Port Already in Use
The app automatically finds an available port. Check the terminal output for the actual port (e.g., http://localhost:3006/)

### Missing Data
If foods or recipes don't appear:
1. Check `data/extracted-foods.json` exists
2. Verify JSON is valid (no syntax errors)
3. Restart the dev server

### Type Errors
Run type checking:
```bash
npm run type-check
```

## Next Steps

### Enhance the App
1. Add more foods from the cookbook
2. Create more recipe combinations
3. Build custom meal planning interface
4. Add shopping list generator
5. Implement print styles

### Deploy Online
```bash
npm run build
```
Deploy the `dist/` folder to:
- Netlify (free)
- Vercel (free)
- GitHub Pages (free)
- Cloudflare Pages (free)

## Support & Resources

- Astro docs: https://docs.astro.build
- TypeScript docs: https://www.typescriptlang.org/docs
- Book: "The How Not to Diet Cookbook" by Dr. Michael Greger

## Summary

You now have a fully functional web app that:
- Displays 10+ foods with complete synergy data
- Auto-generates weekly meal plans
- Calculates food synergy scores
- Suggests optimal food combinations
- Tracks Daily Dozen and 21 Tweaks
- Shows source pages and quotes from the cookbook
- Runs locally at http://localhost:3006/

Enjoy planning your healthy, synergy-optimized meals!
