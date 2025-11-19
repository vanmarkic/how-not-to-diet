import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const GET: APIRoute = async () => {
  try {
    // Read all recipe files from data/recipes directory
    const recipesDir = path.join(process.cwd(), 'data', 'recipes');
    const files = fs.readdirSync(recipesDir).filter(f => f.endsWith('.json'));

    const recipes = files.map(file => {
      const filePath = path.join(recipesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    });

    // Sort by ID for consistent ordering
    recipes.sort((a, b) => a.id.localeCompare(b.id));

    return new Response(JSON.stringify({
      count: recipes.length,
      data: recipes
    }, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to load recipes',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
