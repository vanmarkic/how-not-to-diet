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

interface PaginationResponse {
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage?: string;
  previousPage?: string;
  data: Food[];
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

export const GET: APIRoute = async ({ params }) => {
  try {
    const pageParam = params.page;

    if (!pageParam) {
      return new Response(
        JSON.stringify({
          error: 'Page number is required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const pageNumber = parseInt(pageParam, 10);

    if (isNaN(pageNumber) || pageNumber < 2) {
      return new Response(
        JSON.stringify({
          error: 'Invalid page number. Page must be >= 2',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const foods = loadAllFoods();

    if (foods.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'No foods found',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const totalPages = Math.ceil(foods.length / PAGE_SIZE);

    if (pageNumber > totalPages) {
      return new Response(
        JSON.stringify({
          error: `Page ${pageNumber} does not exist. Total pages: ${totalPages}`,
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
    const startIndex = (pageNumber - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const paginatedFoods = foods.slice(startIndex, endIndex);

    const hasPreviousPage = pageNumber > 2;
    const hasNextPage = pageNumber < totalPages;

    let previousPage: string | undefined;
    if (pageNumber === 2) {
      previousPage = '/api/foods.json';
    } else if (hasPreviousPage) {
      previousPage = `/api/foods/page-${pageNumber - 1}.json`;
    }

    let nextPage: string | undefined;
    if (hasNextPage) {
      nextPage = `/api/foods/page-${pageNumber + 1}.json`;
    }

    const response: PaginationResponse = {
      count: foods.length,
      page: pageNumber,
      pageSize: PAGE_SIZE,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      previousPage,
      nextPage,
      data: paginatedFoods,
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
        error: 'Failed to load paginated foods',
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
    const foods = loadAllFoods();

    if (foods.length === 0) {
      return [];
    }

    const totalPages = Math.ceil(foods.length / PAGE_SIZE);

    // Generate paths for pages 2 through totalPages (page 1 is handled by foods.json)
    const paths = [];
    for (let page = 2; page <= totalPages; page++) {
      paths.push({
        params: { page: page.toString() },
      });
    }

    return paths;
  } catch (error) {
    console.error('Error generating static paths for paginated foods:', error);
    return [];
  }
}
