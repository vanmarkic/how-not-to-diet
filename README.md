# How Not To Diet - Weekly Menu Planner

A static site generator (SSG) built with Astro and TypeScript for planning weekly menus based on food science principles.

## Project Structure

```
how-not-to-diet/
├── src/
│   ├── components/        # Reusable UI components
│   │   └── RecipeCard.astro
│   ├── layouts/           # Page layout templates
│   │   └── Layout.astro
│   ├── pages/             # Route pages (file-based routing)
│   │   └── index.astro
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   └── utils/             # Helper functions and utilities
│       ├── dataLoader.ts  # Functions to load JSON data
│       └── helpers.ts     # General utility functions
├── data/                  # JSON data files
│   ├── recipes.json       # Recipe database
│   └── weekly-menus.json  # Weekly menu plans
├── public/                # Static assets (served as-is)
│   └── favicon.svg
├── .gitignore
├── astro.config.mjs       # Astro configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md
```

## Key Features

### Technology Stack
- **Astro 4.16.12**: Modern static site generator with partial hydration
- **TypeScript 5.7.2**: Full type safety across the project
- **Zero JavaScript by default**: Pages ship pure HTML/CSS unless components need interactivity

### Configuration Highlights

#### TypeScript Configuration
- Strict mode enabled for maximum type safety
- Path aliases configured for clean imports:
  - `@components/*` → `src/components/*`
  - `@layouts/*` → `src/layouts/*`
  - `@utils/*` → `src/utils/*`
  - `@data/*` → `data/*`
  - `@types/*` → `src/types/*`

#### Astro Configuration
- **Output mode**: Static (pre-rendered at build time)
- **Dev server**: Runs on port 3000
- **Build optimization**: Auto-inlining of stylesheets
- Path aliases mirrored from TypeScript config

### Data Architecture

#### Type System
The project uses a comprehensive type system defined in `src/types/index.ts`:
- `Recipe`: Complete recipe information including ingredients, instructions, nutrition
- `Ingredient`: Structured ingredient data with amounts and units
- `NutritionInfo`: Nutritional facts per serving
- `WeeklyMenu`: Weekly meal planning structure
- `DayMenu`: Daily meal organization
- `ShoppingListItem`: Generated shopping list items

#### Data Loading
The `src/utils/dataLoader.ts` provides functions to:
- Load all recipes or specific recipes by ID
- Filter recipes by category
- Load weekly menu plans
- Search recipes by query string

#### Helper Utilities
The `src/utils/helpers.ts` includes:
- Time formatting (minutes to human-readable)
- Nutrition calculation for daily meals
- Shopping list generation from recipes
- Date formatting utilities

### Components

#### Layout Component (`src/layouts/Layout.astro`)
- Responsive navigation header
- Clean, semantic HTML structure
- Scoped CSS with CSS custom properties for theming
- Color scheme based on food/health theme (greens)
- Mobile-first responsive design

#### Recipe Card Component (`src/components/RecipeCard.astro`)
- Displays recipe summary or full details
- Shows prep/cook time, servings, nutrition facts
- Tag system for categorization
- Optional detailed view with ingredients and instructions
- Hover effects for better UX

### Sample Data

The project includes example data:
- **recipes.json**: 2 sample recipes (Berry Oatmeal Bowl, Mediterranean Chickpea Salad)
- **weekly-menus.json**: Template weekly menu structure

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see your site.

### Build

```bash
npm run build
```

Generates static files in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Type Checking

```bash
npm run type-check
```

## Design Decisions

1. **Static Site Generation**: Chosen for optimal performance, SEO, and hosting simplicity
2. **TypeScript**: Ensures type safety for data structures, especially important for recipe/nutrition data
3. **Component-based Architecture**: Promotes reusability and maintainability
4. **JSON Data Storage**: Easy to edit, version control, and eventually migrate to a CMS
5. **Path Aliases**: Cleaner imports and better developer experience
6. **Scoped Styling**: Prevents CSS conflicts and keeps styles component-focused
7. **Semantic HTML**: Improves accessibility and SEO
8. **Mobile-First Design**: Ensures good experience on all devices

## Next Steps

To expand this project, consider:

1. **Add more pages**:
   - `/menu` - Display weekly menu
   - `/recipes` - Browse all recipes
   - `/recipes/[id]` - Individual recipe pages

2. **Add interactivity**:
   - Shopping list generator
   - Meal planner interface
   - Recipe search/filter

3. **Enhance data**:
   - Add more recipes from the cookbook
   - Create multiple weekly menu templates
   - Add ingredient categories for shopping organization

4. **Improve UX**:
   - Add images for recipes
   - Implement print-friendly styles
   - Add nutritional goal tracking

5. **Deploy**:
   - Deploy to Netlify, Vercel, or GitHub Pages
   - Set up CI/CD pipeline

## Notes

- PDF cookbook is excluded from git (see `.gitignore`)
- No external UI libraries added to keep bundle small
- Can easily integrate React, Vue, or Svelte components if needed later
- All styling uses vanilla CSS with modern features (Grid, Flexbox, Custom Properties)
