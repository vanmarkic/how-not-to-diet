import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

interface Food {
  id: string;
  name: string;
  categories?: string[];
  properties?: string[];
  benefits?: string[];
  synergies?: string[];
  timing?: string[];
  amount?: string;
  sources?: {
    pages?: number[];
    quotes?: string[];
  };
  conflicts?: string[];
  [key: string]: unknown;
}

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({
          error: 'Food ID is required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Read all food files from data/foods directory
    const foodsDir = path.join(process.cwd(), 'data', 'foods');
    const files = fs.readdirSync(foodsDir).filter((f) => f.endsWith('.json'));

    // Find the food with matching ID
    let food: Food | null = null;

    for (const file of files) {
      const filePath = path.join(foodsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsedFood = JSON.parse(content);

      if (parsedFood.id === id) {
        food = parsedFood;
        break;
      }
    }

    // If food not found, return 404
    if (!food) {
      return new Response(
        JSON.stringify({
          error: 'Food not found',
          id,
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Return the food data with proper headers
    return new Response(JSON.stringify({ data: food }, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to load food details',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

export async function getStaticPaths() {
  try {
    // Read all food files from data/foods directory
    const foodsDir = path.join(process.cwd(), 'data', 'foods');
    const files = fs.readdirSync(foodsDir).filter((f) => f.endsWith('.json'));

    // Generate paths for each food ID
    const paths = files.map((file) => {
      const filePath = path.join(foodsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const food: Food = JSON.parse(content);

      return {
        params: { id: food.id },
      };
    });

    return paths;
  } catch (error) {
    console.error('Error generating static paths for foods:', error);
    return [];
  }
}
