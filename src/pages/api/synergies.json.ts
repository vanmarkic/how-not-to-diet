import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

interface Food {
  id: string;
  name: string;
  synergies?: string[];
  [key: string]: unknown;
}

interface Synergy {
  name: string;
  foodCount: number;
}

export const GET: APIRoute = async () => {
  try {
    // Read all food files from data/foods directory
    const foodsDir = path.join(process.cwd(), 'data', 'foods');
    const files = fs.readdirSync(foodsDir).filter(f => f.endsWith('.json'));

    // Extract synergies from all foods
    const synergiesMap = new Map<string, number>();

    files.forEach(file => {
      const filePath = path.join(foodsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const food = JSON.parse(content) as Food;

      // Extract synergies array from each food
      if (food.synergies && Array.isArray(food.synergies)) {
        food.synergies.forEach(synergy => {
          const lowerSynergy = synergy.toLowerCase().trim();
          synergiesMap.set(lowerSynergy, (synergiesMap.get(lowerSynergy) || 0) + 1);
        });
      }
    });

    // Convert map to array and sort alphabetically by name
    const synergies: Synergy[] = Array.from(synergiesMap.entries())
      .map(([name, foodCount]) => ({
        name,
        foodCount
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return new Response(
      JSON.stringify(
        {
          count: synergies.length,
          synergies
        },
        null,
        2
      ),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to load synergies',
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
