import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const GET: APIRoute = async () => {
  try {
    // Read all food files from data/foods directory
    const foodsDir = path.join(process.cwd(), 'data', 'foods');
    const files = fs.readdirSync(foodsDir).filter(f => f.endsWith('.json'));

    // Map to track category counts
    const categoryMap = new Map<string, number>();

    // Process each food file
    files.forEach(file => {
      try {
        const filePath = path.join(foodsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const food = JSON.parse(content);

        // Extract and count categories
        if (Array.isArray(food.categories)) {
          food.categories.forEach((category: string) => {
            categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
          });
        }
      } catch (err) {
        console.warn(`Failed to process food file ${file}:`, err);
      }
    });

    // Convert map to array and sort alphabetically by name
    const categories = Array.from(categoryMap)
      .map(([name, foodCount]) => ({ name, foodCount }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return new Response(JSON.stringify({
      count: categories.length,
      categories
    }, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to load categories',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
