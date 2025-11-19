import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

interface Food {
  id: string;
  timing?: string[];
  [key: string]: unknown;
}

interface TimingEntry {
  name: string;
  foodCount: number;
}

interface TimingsResponse {
  count: number;
  timings: TimingEntry[];
}

export const GET: APIRoute = async () => {
  try {
    // Read all food files from data/foods directory
    const foodsDir = path.join(process.cwd(), 'data', 'foods');
    const files = fs.readdirSync(foodsDir).filter(f => f.endsWith('.json'));

    // Extract unique timings and count foods per timing
    const timingMap = new Map<string, number>();

    files.forEach(file => {
      try {
        const filePath = path.join(foodsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const food: Food = JSON.parse(content);

        // Process timing array if it exists
        if (food.timing && Array.isArray(food.timing)) {
          food.timing.forEach(timing => {
            const count = timingMap.get(timing) || 0;
            timingMap.set(timing, count + 1);
          });
        }
      } catch (error) {
        // Log error but continue processing other files
        console.error(`Error processing file ${file}:`, error);
      }
    });

    // Convert map to sorted array
    const timings: TimingEntry[] = Array.from(timingMap.entries())
      .map(([name, foodCount]) => ({
        name,
        foodCount
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const response: TimingsResponse = {
      count: timings.length,
      timings
    };

    return new Response(JSON.stringify(response, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to load timings',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
