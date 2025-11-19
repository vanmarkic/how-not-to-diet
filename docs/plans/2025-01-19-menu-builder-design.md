# Weekly Menu Builder - Design Document

**Date:** 2025-01-19
**Status:** Validated & Ready for Implementation

## Overview

A meal-first weekly menu planner that suggests foods based on synergies within each meal, with transparent localStorage persistence and full backup capabilities.

---

## Core Architecture & Data Flow

### Component Structure
- **WeeklyMenuGrid** (desktop) - Full 7×3 grid view
- **DayByDayView** (mobile) - Swipeable day cards
- **MealSlot** - Individual meal cell (e.g., "Monday Breakfast")
- **FoodSuggestionPanel** - Ranked suggestions with synergy scores
- **FoodSearch** - Search/filter overlay (hybrid approach)

### Data Flow
1. User clicks meal slot → MealSlot becomes active
2. System calculates suggestions:
   - Based on foods already in that meal
   - Filtered by meal timing (breakfast/lunch/dinner)
3. User adds food → Instant re-calculation:
   - Suggestions re-rank based on synergy with newly added food
   - Synergy scores displayed (+8, +5, +3, etc.)
   - Top 3 highlighted with visual emphasis (green badges)
4. Auto-saves to localStorage on every change
5. User can snapshot menu to library or export full backup

### Tech Stack
- Astro SSG for initial render
- Astro Islands (React/Preact) for client-side interactivity
- localStorage for transparent persistence
- Web Share API / `mailto:` for email export
- No backend required (fully client-side)

---

## Synergy Calculation Engine

### Algorithm Implementation

**Input:**
- Selected foods in current meal: `["oats", "blueberries"]`
- All available foods: 181 foods from aggregated bundle

**Process:**
```javascript
1. Filter candidates:
   - Remove already-selected foods from current meal
   - Apply timing constraint (breakfast/lunch/dinner appropriate)

2. Calculate synergy scores:
   for each candidate food:
     score = 0
     for each selected food in current meal:
       score += getSynergyScore(candidate, selected_food)

     candidate.totalScore = score

3. Rank & categorize:
   - Sort by score (descending)
   - Top 3: "Excellent pairing" (green badge, +8 or higher)
   - Next 5: "Good pairing" (blue badge, +3 to +7)
   - Rest: Neutral (no badge, 0 to +2)
```

### Synergy Data Source
- Uses `food.synergies` array from extracted data (181 foods)
- Build lookup map on page load for O(1) access
- Default score = 0 if no explicit synergy defined
- Synergies are bidirectional (A→B implies B→A)

### Real-time Updates
- Every add/remove → recalculate all scores
- Debounced to 100ms to prevent performance issues
- Smooth transition animations for re-ranking

---

## User Interface Components

### Desktop View - Weekly Grid

```
┌─────────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│             │  Mon    │  Tue    │  Wed    │  Thu    │  Fri    │  Sat    │  Sun    │
├─────────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Breakfast   │ [Cell]  │ [Cell]  │ [Cell]  │ [Cell]  │ [Cell]  │ [Cell]  │ [Cell]  │
│ Lunch       │ [Cell]  │ [Cell]  │ [Cell]  │ [Cell]  │ [Cell]  │ [Cell]  │ [Cell]  │
│ Dinner      │ [Cell]  │ [Cell]  │ [Cell]  │ [Cell]  │ [Cell]  │ [Cell]  │ [Cell]  │
└─────────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```

### MealSlot Cell States
- **Empty**: Gray border, "Click to add foods" placeholder
- **Active**: Green border, shows suggestion panel
- **Filled**: Food chips (removable), synergy score badge
- **Hover**: Lift effect, shows "Edit" button

### Suggestion Panel
- **Desktop**: Fixed sidebar (slides in when cell active)
- **Mobile**: Bottom sheet (full-screen on tap)
- **Content**:
  - Search bar at top (hybrid: browse + search)
  - Top 3 with green "⭐ Excellent" badges
  - Next 5 with blue "✓ Good" badges
  - Each shows: Food name, synergy score (+8), quick-add button
  - "Show all 181 foods" collapse/expand

### Mobile View - Day by Day
- Swipeable cards, one day at a time
- 3 meal slots stacked vertically per day
- Bottom sheet for suggestions
- Progress indicator: "Day 2 of 7"

### Responsive Breakpoints
- **Desktop** (>1024px): Full week grid
- **Tablet** (768-1024px): Condensed grid, smaller cells
- **Mobile** (<768px): Day-by-day swipeable cards

---

## Transparent Storage System

### Automatic localStorage (No Save Button)
- Auto-saves current menu on every food add/remove
- Debounced to 500ms after last change
- Key: `menu-current`
- On page load: Automatically restores last working state
- User never thinks about saving - it just works

### Menu Library (Snapshots)
- "Snapshot Menu" button → prompts for name
- Saves to `menu-library` array in localStorage
- Dropdown shows all snapshots with date/name
- Click to load a snapshot into current working menu
- Snapshots are permanent (no delete - append only)

### localStorage Structure
```javascript
{
  "menu-current": {
    "weekOf": "2025-11-19",
    "meals": {
      "monday": {
        "breakfast": ["food-1", "food-5", "food-42"],
        "lunch": ["food-10", "food-20"],
        "dinner": ["food-7", "food-15", "food-30"]
      },
      // ... other days
    },
    "lastModified": "2025-11-19T14:30:00Z"
  },
  "menu-library": [
    {
      "name": "Winter Week 1",
      "weekOf": "2025-11-19",
      "meals": {...},
      "created": "2025-11-19T14:30:00Z",
      "totalSynergyScore": 245
    },
    // ... other snapshots
  ]
}
```

---

## Backup & Export System

### Export Options

**1. Download Backup**
- Single JSON file containing ALL menus + current state
- Filename: `menus-backup-YYYY-MM-DD.json`
- Format:
  ```json
  {
    "exportDate": "2025-11-19T14:30:00Z",
    "current": {...},
    "library": [...]
  }
  ```

**2. Email Backup**
- `mailto:` with pre-filled subject & body
- Attaches complete backup JSON
- Body includes human-readable shopping list

### Email Shopping List Format
```
Subject: Weekly Menu Shopping List - Week of Nov 19

=== SHOPPING LIST ===
Grouped by category:

VEGETABLES:
  - Kale (2×)
  - Broccoli (1×)
  - Carrots (3×)

FRUITS:
  - Blueberries (4×)
  - Apples (2×)

LEGUMES:
  - Chickpeas (1×)
  - Lentils (2×)

...

=== WEEKLY MENU PREVIEW ===
Monday:
  Breakfast: Oats, Blueberries, Flaxseeds
  Lunch: Kale Salad, Chickpeas, Lemon
  Dinner: Lentil Soup, Quinoa, Broccoli

Tuesday:
  ...
```

---

## Technical Implementation

### File Structure
```
src/
  pages/
    planner.astro                    # Main weekly planner page
  components/
    WeeklyMenuGrid.astro            # Desktop grid view
    DayByDayView.astro              # Mobile swipeable view
    MealSlot.astro                  # Individual meal cell
    FoodSuggestionPanel.astro       # Suggestion sidebar/sheet
    FoodSearch.astro                # Search/filter overlay
  islands/
    MenuBuilder.tsx                 # Client-side interactive wrapper
  utils/
    synergyEngine.ts                # Score calculation logic
    menuStorage.ts                  # localStorage operations
    backupExport.ts                 # Full backup generation
    emailExport.ts                  # mailto: generation
```

### Key Functions

**synergyEngine.ts:**
```typescript
loadFoodsBundle() → Food[]
buildSynergyMap(foods) → Map<string, number>
calculateSuggestions(selectedFoods, mealType, allFoods) → RankedSuggestion[]
getSynergyScore(foodA, foodB) → number
```

**menuStorage.ts:**
```typescript
autoSaveMenu(menu: WeeklyMenu) → void
restoreMenu() → WeeklyMenu | null
snapshotMenu(menu: WeeklyMenu, name: string) → void
loadSnapshot(name: string) → WeeklyMenu
getMenuLibrary() → WeeklyMenu[]
```

**backupExport.ts:**
```typescript
exportAllMenus() → Blob
importBackup(json: string) → boolean
generateBackupFilename() → string
```

**emailExport.ts:**
```typescript
generateShoppingList(menu: WeeklyMenu) → GroupedIngredients
formatEmailBody(menu: WeeklyMenu, shoppingList) → string
openEmailClient(menu: WeeklyMenu) → void
```

---

## Edge Cases & Polish

### Empty States
- Empty week: Welcome message + "Start with Monday Breakfast"
- Empty meal: "Click to add foods" placeholder
- No suggestions: "All foods already added!" message

### Synergy Score Display
- Show running total for each meal (e.g., "Synergy: +24")
- Visual indicator:
  - Green (>15): Excellent synergies
  - Yellow (5-15): Good synergies
  - Gray (<5): Minimal synergies
- Tooltip on hover: Breakdown showing which foods synergize

### Performance Optimizations
- Load 181 foods bundle once on page init
- Build synergy lookup map immediately (O(1) access)
- Debounce auto-save (500ms after last change)
- Virtualize suggestion list if >50 items visible
- Memoize synergy calculations for re-renders

### Error Handling
- **localStorage full**: Show warning, suggest backup/clear old snapshots
- **Corrupted data**: Fall back to empty state, log error to console
- **Missing foods**: Gracefully handle if food IDs don't exist
- **Restore failure**: Start fresh with empty menu

---

## Data Types

```typescript
interface Food {
  id: string;
  name: string;
  categories: string[];
  properties: string[];
  benefits: string;
  synergies: string[];
  timing: string[];
  amount: string;
  sources: {
    pages: number[];
    quotes: string[];
  };
}

interface MealFoods {
  breakfast: string[];  // food IDs
  lunch: string[];
  dinner: string[];
}

interface WeeklyMenu {
  weekOf: string;  // ISO date
  meals: {
    monday: MealFoods;
    tuesday: MealFoods;
    wednesday: MealFoods;
    thursday: MealFoods;
    friday: MealFoods;
    saturday: MealFoods;
    sunday: MealFoods;
  };
  lastModified: string;  // ISO timestamp
}

interface MenuSnapshot extends WeeklyMenu {
  name: string;
  created: string;
  totalSynergyScore: number;
}

interface RankedSuggestion {
  food: Food;
  synergyScore: number;
  category: 'excellent' | 'good' | 'neutral';
  breakdown: Array<{
    withFood: string;
    score: number;
  }>;
}

interface GroupedIngredients {
  [category: string]: Array<{
    name: string;
    count: number;
  }>;
}
```

---

## Success Criteria

✅ User can build a weekly menu by clicking meal slots
✅ Suggestions automatically rank based on synergies within each meal
✅ Top 3 suggestions visually highlighted with scores
✅ Menu auto-saves to localStorage transparently
✅ User can snapshot menus to library with names
✅ Full backup export (download + email) works
✅ Responsive: grid on desktop, day-by-day on mobile
✅ Shopping list groups ingredients by category
✅ No save/load buttons - automatic persistence

---

## Future Enhancements (Out of Scope)

- Cross-day synergies (consider Monday lunch when suggesting Tuesday breakfast)
- Nutritional totals (calories, macros, Daily Dozen compliance)
- Recipe integration (suggest recipes instead of individual foods)
- Drag-and-drop food reordering
- Print-friendly weekly menu view
- Import backup from JSON file
- Undo/redo functionality
- Multi-week planning (month view)

---

## Implementation Notes

- Use existing `dist/foods-bundle.json` (181 foods)
- Leverage existing `src/utils/suggestions.ts` algorithm
- Build on existing Astro project structure
- No backend/API required - fully client-side
- Test localStorage limits (~5-10MB, plenty for menus)
- Mobile-first CSS, progressive enhancement for desktop
- Accessibility: keyboard navigation, ARIA labels, focus management

---

**Design validated:** 2025-01-19
**Ready for implementation:** Yes
**Estimated complexity:** Medium (2-3 days for core features)
