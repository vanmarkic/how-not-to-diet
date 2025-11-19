import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

interface RecipeWithSearch {
  id: string;
  name: string;
  searchText: string;
  [key: string]: unknown;
}

export const GET: APIRoute = async () => {
  try {
    // Read all recipe files from data/recipes directory
    const recipesDir = path.join(process.cwd(), 'data', 'recipes');
    const files = fs.readdirSync(recipesDir).filter(f => f.endsWith('.json'));

    const recipes: RecipeWithSearch[] = files.map(file => {
      const filePath = path.join(recipesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const recipe = JSON.parse(content);

      // Build searchText from multiple fields
      const searchParts: string[] = [];

      // Add recipe name
      if (recipe.name) {
        searchParts.push(String(recipe.name).toLowerCase());
      }

      // Add foods (handle both 'foods' and 'foods_used' field names)
      const foodsList = recipe.foods || recipe.foods_used || [];
      if (Array.isArray(foodsList) && foodsList.length > 0) {
        searchParts.push(foodsList.map((f: string) => f.toLowerCase()).join(' '));
      }

      // Add description if it exists
      if (recipe.description) {
        searchParts.push(String(recipe.description).toLowerCase());
      }

      // Add meal type
      if (recipe.meal_type) {
        searchParts.push(String(recipe.meal_type).toLowerCase());
      }

      // Add difficulty
      if (recipe.difficulty) {
        searchParts.push(String(recipe.difficulty).toLowerCase());
      }

      // Combine and clean up search text
      const searchText = searchParts
        .join(' ')
        .replace(/\s+/g, ' ') // Remove extra whitespace
        .trim();

      return {
        ...recipe,
        searchText
      };
    });

    // Sort by ID for consistency
    recipes.sort((a, b) => a.id.localeCompare(b.id));

    return new Response(JSON.stringify({
      count: recipes.length,
      recipes
    }, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to load recipe search index',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
