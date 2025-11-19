import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

interface Food {
  id: string;
  name: string;
  categories?: string[];
}

interface LightSearchItem {
  id: string;
  name: string;
  categories: string[];
}

export const GET: APIRoute = async () => {
  try {
    // Read all food files from data/foods directory
    const foodsDir = path.join(process.cwd(), 'data', 'foods');

    if (!fs.existsSync(foodsDir)) {
      return new Response(
        JSON.stringify({
          error: 'Foods directory not found'
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const files = fs.readdirSync(foodsDir).filter(f => f.endsWith('.json'));

    // Read and process all food files - only extract minimal data
    const foods: LightSearchItem[] = files.map(file => {
      const filePath = path.join(foodsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const food: Food = JSON.parse(content);

      return {
        id: food.id,
        name: food.name,
        categories: food.categories || []
      };
    });

    // Sort by ID for consistent ordering
    foods.sort((a, b) => {
      const aNum = parseInt(a.id.replace(/\D/g, '') || '0', 10);
      const bNum = parseInt(b.id.replace(/\D/g, '') || '0', 10);
      return aNum - bNum;
    });

    return new Response(JSON.stringify({
      count: foods.length,
      foods
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
        error: 'Failed to create light food search index',
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
