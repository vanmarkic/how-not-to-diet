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

    // Pagination constants
    const pageSize = 25;
    const count = foods.length;
    const page = 1;
    const totalPages = Math.ceil(count / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Get the first page of foods
    const paginatedFoods = foods.slice(0, pageSize);

    return new Response(JSON.stringify({
      count,
      page,
      pageSize,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      nextPage: hasNextPage ? `/api/foods/page-2.json` : null,
      previousPage: hasPreviousPage ? `/api/foods/page-0.json` : null,
      data: paginatedFoods
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
