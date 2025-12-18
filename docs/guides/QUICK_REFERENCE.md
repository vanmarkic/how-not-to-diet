# Quick Reference - How Not to Diet Menu Planner

## App is Running At
**http://localhost:3006/**

---

## Main Pages

| Page | URL | What It Does |
|------|-----|--------------|
| Home | `/` | Overview of features and data |
| Weekly Planner | `/planner` | Auto-generated 7-day meal plan |
| Foods Database | `/foods` | Browse all 10 foods with synergies |
| Combos | `/combos` | Top food combinations |
| Synergy Analysis | `/meal-planner` | Analyze meal synergies |
| Recipes | `/recipes` | View sample recipes |
| Menu Builder | `/menu-builder` | Build custom menus |

---

## Food Synergies Quick List

### Top Breakfast Combos
1. **Oat Groats + Berries + Flaxseeds**
   - Whole grains, antioxidants, omega-3
   - Covers 3 Daily Dozen items

2. **Berries + Greens + Flaxseeds**
   - High fiber, low calorie, nutrient-dense

### Top Lunch Combos
1. **Kale + Cabbage + Vinegar**
   - Cruciferous power, metabolism boost
   - 21 Tweaks: Vinegar included

2. **Greens + Beans + Vinegar**
   - Complete nutrition, high fiber

### Top Dinner Combos
1. **Beans + Greens + Turmeric**
   - Anti-inflammatory, protein-rich
   - Perfect Daily Dozen coverage

2. **Beans + Cabbage + Ginger**
   - Digestive support, immune boost

---

## Daily Dozen Checklist

- [ ] Beans (3 servings)
- [ ] Berries (1 serving)
- [ ] Other fruits (3 servings)
- [ ] Cruciferous vegetables (1 serving)
- [ ] Greens (2 servings)
- [ ] Other vegetables (2 servings)
- [ ] Flaxseeds (1 tablespoon)
- [ ] Nuts/seeds (1 serving)
- [ ] Herbs/spices (1/4 tsp turmeric)
- [ ] Whole grains (3 servings)
- [ ] Beverages (5 glasses water)
- [ ] Exercise (90 min moderate or 40 min vigorous)

---

## 21 Tweaks Quick List

1. **Vinegar**: 2 tsp with each meal
2. **Nigella seeds**: 1/4 tsp daily
3. **Turmeric**: Daily in cooking
4. **Ginger**: 1 tsp daily
5. **Greens earlier in meal**
6. **Whole intact grains** (groats > rolled)

---

## 10 Foods in Database

| Food | Amount | Best Time | Key Benefit |
|------|--------|-----------|-------------|
| Beans | 3 servings/day | Any meal | Highest nutrition density |
| Kale | Daily | Any meal | Antioxidants, low-oxalate |
| Cabbage | Daily | Any meal | Cruciferous, cholesterol |
| Vinegar | 2 tsp/meal | With meals | Metabolism boost |
| Oat Groats | 3 servings/day | Breakfast | Fiber-encased calories |
| Flaxseeds | 1 tbsp/day | Breakfast | Omega-3, appetite control |
| Berries | 1 serving/day | Breakfast/snacks | Antioxidants |
| Greens | 2 servings/day | Earlier in meal | Fat-blocking thylakoids |
| Turmeric | Daily | With meals | Anti-inflammatory |
| Nigella Seeds | 1/4 tsp/day | Any meal | Weight loss, BMI reduction |

---

## Synergy Scores Explained

- **0-20**: Neutral combination
- **20-40**: Good pairing
- **40-60**: Excellent synergy
- **60+**: Optimal combination

---

## Food Categories

### Nutritional
- rich-in-legumes
- rich-in-vegetables
- rich-in-whole-grains
- rich-in-fruits
- cruciferous
- greens

### Functional
- anti-inflammatory
- high-fiber
- low-glycemic
- appetite-suppression
- weight-loss-booster
- herbs-and-spices

---

## Quick Commands

### Start Server
```bash
cd /Users/dragan/Documents/how-not-to-diet
npm run dev
```

### Stop Server
Press `Ctrl+C` in terminal

### Build for Production
```bash
npm run build
```

### Type Check
```bash
npm run type-check
```

---

## Adding Content

### Add a Food
Edit `data/extracted-foods.json`:
```json
{
  "id": "food-11",
  "name": "Food Name",
  "categories": ["category1"],
  "properties": ["Property"],
  "benefits": "Benefits",
  "synergies": ["other-food"],
  "conflicts": [],
  "timing": ["breakfast"],
  "amount": "1 serving",
  "sources": {
    "pages": [20],
    "quotes": ["Quote"]
  }
}
```

### Add a Recipe
Edit `data/recipes.json` following the existing structure.

---

## Key Files

- `USER_GUIDE.md` - Comprehensive usage guide
- `SUMMARY.md` - Project summary and approach
- `QUICKSTART.md` - Quick start instructions
- `README.md` - Project overview
- `QUICK_REFERENCE.md` - This file

---

## Troubleshooting

**Port already in use?**
- Server auto-finds next available port
- Check terminal for actual URL

**Missing data?**
- Verify JSON files in `data/` folder
- Restart server

**Type errors?**
- Only in example files
- Main app works fine

---

## Best Meal Building Strategy

1. **Start with base**: Beans or whole grains
2. **Add greens**: Kale or leafy greens
3. **Include vinegar**: As dressing or drink
4. **Boost with spices**: Turmeric, ginger
5. **Top with seeds**: Flaxseeds or nigella seeds

---

## Example Daily Menu

### Breakfast
Oat groats (1 cup dry) + Berries (1 cup) + Flaxseeds (1 tbsp)

### Lunch
Kale & Cabbage Salad + Chickpeas + Vinegar Dressing

### Dinner
Black Bean Bowl + Greens + Turmeric & Ginger

### Boosters
- Vinegar: 2 tsp with lunch and dinner
- Nigella seeds: 1/4 tsp sprinkled on salad
- Water: 5 glasses throughout day

**Daily Dozen Coverage**: 7/12 items ✓
**21 Tweaks**: 4/21 implemented ✓

---

## Deployment

**Ready to deploy**: Run `npm run build`

**Host on**:
- Netlify (free)
- Vercel (free)
- GitHub Pages (free)
- Cloudflare Pages (free)

---

## Support

- Astro: https://docs.astro.build
- TypeScript: https://typescriptlang.org/docs
- Book: "The How Not to Diet Cookbook" by Dr. Michael Greger

---

**App Status**: WORKING ✓
**Server**: http://localhost:3006/
**Last Updated**: 2025-11-18
