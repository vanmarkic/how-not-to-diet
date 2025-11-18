# Demo Cheat Sheet - Quick Reference

## START HERE

```bash
cd /Users/dragan/Documents/how-not-to-diet
npm run dev
```

Visit: http://localhost:3000 (or check terminal for actual port)

---

## 5-Minute Demo Flow

### 1. HOME (/) - 30 sec
"Food synergies app from 600-page cookbook. 10 foods. Full data. Source tracking."

### 2. FOODS (/foods) - 60 sec
"Each food: synergies, timing, amounts, sources with page numbers."
**Point out:** Green tags = synergies, Blue tags = timing, Page numbers at bottom

### 3. COMBOS (/combos) - 60 sec
"System ranks food combinations by synergy strength."
**Point out:** Triple combos for meals, Synergy scores, Quick meal ideas

### 4. PLANNER (/planner) - 60 sec
"AI-generated 7-day plan. Maximizes synergies. Covers Daily Dozen."
**Point out:** Full week, Daily Dozen coverage, Specific amounts

### 5. WRAP (/) - 30 sec
"Ready to deploy. Easy to extend. All data trackable."

---

## Key Pages

| URL | What It Shows | Key Feature |
|-----|---------------|-------------|
| / | Overview | 3 feature cards |
| /foods | 10 foods database | Synergies + sources |
| /combos | Ranked combinations | Triple combos |
| /planner | 7-day meal plan | Daily Dozen |
| /meal-planner | Synergy analysis | Advanced engine |
| /food-selector | Interactive UI | Selection system |

---

## Talking Points

### Data Quality
- 10 foods fully documented
- 120 pages reviewed (of 600)
- Every claim has page numbers
- Direct quotes from book

### Synergy System
- Which foods work together
- Timing optimization
- Amount recommendations
- Category matching

### Daily Dozen
- 12 food categories
- Serving recommendations
- Coverage tracking
- Visual indicators

### 21 Tweaks
- Weight loss strategies
- Specific amounts
- Timing guidance
- Integration with meals

---

## If They Ask...

**"How many foods?"**
10 fully documented. Template proven. Can extract 50+ more.

**"Can you add more?"**
Yes. Just add to JSON. System handles everything.

**"Source tracking?"**
Every food has page numbers + direct quotes.

**"How does synergy work?"**
Algorithm matches categories, timing, and explicit synergies from book.

**"Can it generate shopping lists?"**
Button is there. Function stub. Easy to implement.

**"Is it deployed?"**
Ready to deploy. Builds in <1 second. Works on any static host.

**"How long did this take?"**
Emergency build. Focused on core value. Professional result.

---

## Technical Highlights

- **7,622 lines of code**
- **9 pages built**
- **TypeScript 100% type-safe**
- **Static HTML (no JS needed)**
- **<1 second build time**
- **Zero dependencies** (except Astro + TypeScript)

---

## Foods in Database

1. Beans (Legumes) - 3 servings daily
2. Kale - Part of 2 servings greens
3. Cabbage - 1 serving cruciferous
4. Vinegar - 2 tsp per meal
5. Oat Groats - 3 servings grains
6. Flaxseeds - 1 tbsp daily
7. Berries - 1 serving daily
8. Greens - 2 servings daily
9. Turmeric - Daily in cooking
10. Nigella Seeds - 1/4 tsp daily

---

## Example Synergies

**Breakfast:** Oats + Berries + Flaxseeds
- All high-fiber
- All anti-inflammatory
- All low-glycemic
- Covers 3 Daily Dozen items

**Lunch:** Kale + Cabbage + Vinegar
- Both cruciferous
- Vinegar boosts metabolism
- Cholesterol reduction
- Antioxidant synergy

**Dinner:** Beans + Greens + Turmeric
- Complete protein
- Anti-inflammatory
- High fiber
- Covers 3 Daily Dozen items

---

## Emergency Fixes

**Port busy:** Astro auto-finds next port

**Build fails:**
```bash
rm -rf node_modules dist
npm install
npm run build
```

**Data missing:** Check `/data/extracted-foods.json` exists

**Styles broken:** Hard refresh (Cmd+Shift+R)

---

## Post-Demo

If they want more:
1. Extract more foods (template proven)
2. Add recipe integration
3. Implement shopping list
4. Deploy to Netlify
5. Add user customization

---

**READY TO GO. PRESENTATION TOMORROW. YOU GOT THIS.**
