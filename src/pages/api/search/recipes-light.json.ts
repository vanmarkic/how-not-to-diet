import type { APIRoute } from 'astro';
import recipesBundle from '../../../../public/recipes-bundle.json';

interface LightRecipeSearchItem {
  id: string;
  name: string;
  meal_type?: string;
}

export const GET: APIRoute = async () => {
  try {
    // Extract only minimal data for search
    const recipes = recipesBundle.recipes || [];
    const lightRecipes: LightRecipeSearchItem[] = recipes.map((recipe: any) => ({
      id: recipe.id,
      name: recipe.name,
      meal_type: recipe.meal_type
    }));

    return new Response(JSON.stringify({
      count: lightRecipes.length,
      recipes: lightRecipes
    }, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to create light recipe search index',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
