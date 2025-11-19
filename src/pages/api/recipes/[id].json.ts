import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const getStaticPaths = async () => {
  try {
    // Read all recipe files from data/recipes directory
    const recipesDir = path.join(process.cwd(), 'data', 'recipes');
    const files = fs.readdirSync(recipesDir).filter(f => f.endsWith('.json'));

    // Generate paths for each recipe ID
    return files.map(file => {
      const filePath = path.join(recipesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const recipe = JSON.parse(content);

      return {
        params: { id: recipe.id }
      };
    });
  } catch (error) {
    console.error('Error generating static paths:', error);
    return [];
  }
};

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({
        error: 'Recipe ID is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Read the specific recipe file
    const recipesDir = path.join(process.cwd(), 'data', 'recipes');
    const filePath = path.join(recipesDir, `${id}.json`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({
        error: 'Recipe not found',
        id: id
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Read and parse the recipe file
    const content = fs.readFileSync(filePath, 'utf-8');
    const recipe = JSON.parse(content);

    return new Response(JSON.stringify({
      data: recipe
    }, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to load recipe',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
