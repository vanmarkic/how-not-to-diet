import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const GET: APIRoute = async () => {
  try {
    // Read all food files from data/foods directory
    const foodsDir = path.join(process.cwd(), 'data', 'foods');
    const files = fs.readdirSync(foodsDir).filter(f => f.endsWith('.json'));

    const foods = files.map(file => {
      const filePath = path.join(foodsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    });

    // Sort by ID for consistent ordering
    foods.sort((a, b) => a.id.localeCompare(b.id));

    return new Response(JSON.stringify({
      count: foods.length,
      data: foods
    }, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to load foods',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
