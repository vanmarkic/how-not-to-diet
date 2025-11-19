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

interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage?: string;
  previousPage?: string;
}

interface TimingFilterResponse {
  timing: string;
  count: number;
  pagination: PaginationMetadata;
  foods: Food[];
}

const PAGE_SIZE = 25;

function loadAllFoods(): Food[] {
  try {
    const foodsDir = path.join(process.cwd(), 'data', 'foods');
    const files = fs.readdirSync(foodsDir).filter((f) => f.endsWith('.json'));

    const foods = files.map((file) => {
      const filePath = path.join(foodsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    });

    // Sort by ID for consistent ordering
    foods.sort((a: Food, b: Food) => a.id.localeCompare(b.id));

    return foods;
  } catch (error) {
    console.error('Error loading foods:', error);
    return [];
  }
}

function getAllTimings(): Set<string> {
  const timings = new Set<string>();
  const foods = loadAllFoods();

  foods.forEach((food) => {
    if (food.timing && Array.isArray(food.timing)) {
      food.timing.forEach((timing) => {
        timings.add(timing);
      });
    }
  });

  return timings;
}

export const GET: APIRoute = async ({ params }) => {
  try {
    const { timing } = params;

    if (!timing) {
      return new Response(
        JSON.stringify({
          error: 'Timing parameter is required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Get page parameter from URL query string (default to 1)
    const url = new URL((params as any).request?.url || 'http://localhost');
    const pageParam = url.searchParams.get('page') || '1';
    const pageNumber = parseInt(pageParam, 10);

    if (isNaN(pageNumber) || pageNumber < 1) {
      return new Response(
        JSON.stringify({
          error: 'Invalid page number. Page must be >= 1',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Load all foods and filter by timing
    const allFoods = loadAllFoods();

    const filteredFoods = allFoods.filter((food) => {
      return (
        food.timing &&
        Array.isArray(food.timing) &&
        food.timing.includes(timing)
      );
    });

    // If no foods found for this timing, return 404
    if (filteredFoods.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Timing not found or no foods available for this timing',
          timing,
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Calculate pagination
    const totalPages = Math.ceil(filteredFoods.length / PAGE_SIZE);

    if (pageNumber > totalPages) {
      return new Response(
        JSON.stringify({
          error: `Page ${pageNumber} does not exist. Total pages: ${totalPages}`,
          timing,
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const startIndex = (pageNumber - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const paginatedFoods = filteredFoods.slice(startIndex, endIndex);

    const hasPreviousPage = pageNumber > 1;
    const hasNextPage = pageNumber < totalPages;

    let previousPage: string | undefined;
    if (pageNumber > 1) {
      previousPage =
        pageNumber === 2
          ? `/api/timings/${timing}.json`
          : `/api/timings/${timing}.json?page=${pageNumber - 1}`;
    }

    let nextPage: string | undefined;
    if (hasNextPage) {
      nextPage = `/api/timings/${timing}.json?page=${pageNumber + 1}`;
    }

    const response: TimingFilterResponse = {
      timing,
      count: filteredFoods.length,
      pagination: {
        page: pageNumber,
        pageSize: PAGE_SIZE,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        previousPage,
        nextPage,
      },
      foods: paginatedFoods,
    };

    return new Response(JSON.stringify(response, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to load foods for timing',
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
    const timings = getAllTimings();

    // Generate paths for each timing
    const paths = Array.from(timings).map((timing) => ({
      params: { timing },
    }));

    return paths;
  } catch (error) {
    console.error('Error generating static paths for timings:', error);
    return [];
  }
}
