# Quick Start Guide

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

## Project Overview

This is a static site built with Astro for planning weekly menus based on food science principles from "How Not To Diet".

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production (output in `dist/`)
- `npm run preview` - Preview production build locally
- `npm run type-check` - Check TypeScript types
- `npm run check` - Run Astro checks in watch mode

## Project Structure at a Glance

```
src/
├── components/     # Reusable UI components
├── layouts/        # Page templates
├── pages/          # Routes (file-based routing)
├── types/          # TypeScript types
└── utils/          # Helper functions

data/               # JSON data storage
├── recipes.json
└── weekly-menus.json
```

## Adding Content

### Adding a Recipe

Edit `data/recipes.json` and add a new recipe object:

```json
{
  "id": "unique-id",
  "name": "Recipe Name",
  "description": "Short description",
  "servings": 2,
  "prepTime": 15,
  "cookTime": 30,
  "ingredients": [
    {
      "name": "Ingredient name",
      "amount": 1,
      "unit": "cup"
    }
  ],
  "instructions": [
    "Step 1",
    "Step 2"
  ],
  "nutrition": {
    "calories": 300,
    "protein": 10,
    "carbohydrates": 45,
    "fat": 8,
    "fiber": 6
  },
  "tags": ["breakfast", "quick"],
  "category": "breakfast"
}
```

### Creating a Weekly Menu

Edit `data/weekly-menus.json` to reference recipe IDs in your menu plan.

## Key Features

- Full TypeScript support with path aliases
- Static site generation (fast, SEO-friendly)
- Scoped component styling
- Responsive, mobile-first design
- Recipe management system
- Weekly menu planning
- Nutritional information tracking

## Development Tips

1. **Path Aliases**: Use `@components/`, `@layouts/`, `@utils/`, `@data/`, `@types/` for imports
2. **Hot Reload**: Changes automatically reload in the browser
3. **Type Safety**: Run `npm run type-check` to catch type errors
4. **Component Development**: Edit `.astro` files in `src/components/`
5. **Adding Pages**: Create new `.astro` files in `src/pages/`

## File-Based Routing

- `src/pages/index.astro` → `/`
- `src/pages/menu.astro` → `/menu`
- `src/pages/recipes.astro` → `/recipes`
- `src/pages/about.astro` → `/about` (you can create this)

## Styling

Each `.astro` component can have scoped styles in a `<style>` block. Global styles are in `src/layouts/Layout.astro`.

CSS custom properties (variables):
- `--color-primary`: Main green color
- `--color-secondary`: Lighter green
- `--color-accent`: Bright green accent
- `--color-bg`: Background color
- `--color-text`: Text color
- `--max-width`: Max content width

## Next Steps

1. Add more recipes to `data/recipes.json`
2. Create actual weekly menus in `data/weekly-menus.json`
3. Customize the styling to match your preferences
4. Add new pages (about, shopping list, etc.)
5. Deploy to Netlify, Vercel, or GitHub Pages

## Deployment

Build the site:
```bash
npm run build
```

The `dist/` folder contains your static site ready to deploy to any static hosting service.

### Recommended Hosts
- **Netlify**: Drag & drop `dist/` folder
- **Vercel**: Connect your git repository
- **GitHub Pages**: Use GitHub Actions to deploy
- **Cloudflare Pages**: Connect repository or upload manually

## Support

For Astro documentation: https://docs.astro.build
For TypeScript help: https://www.typescriptlang.org/docs
