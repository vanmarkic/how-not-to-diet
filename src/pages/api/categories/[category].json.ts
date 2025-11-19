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
  category: string;
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage?: string;
  previousPage?: string;
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

function getAllCategories(): Set<string> {
  try {
    const foods = loadAllFoods();
    const categories = new Set<string>();

    foods.forEach((food) => {
      if (Array.isArray(food.categories)) {
        food.categories.forEach((category: string) => {
          categories.add(category);
        });
      }
    });

    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    return new Set();
  }
}

export const GET: APIRoute = async ({ params }) => {
  try {
    const categoryParam = params.category;

    if (!categoryParam) {
      return new Response(
        JSON.stringify({
          error: 'Category name is required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Decode the category parameter (URL-encoded)
    const category = decodeURIComponent(categoryParam);

    const foods = loadAllFoods();

    // Filter foods by category
    const foodsInCategory = foods.filter((food) =>
      Array.isArray(food.categories) && food.categories.includes(category)
    );

    // If no foods found for this category, return 404
    if (foodsInCategory.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Category not found',
          category,
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Get page number from query params (default to 1)
    const url = new URL(params as unknown as string);
    const pageParam = url.searchParams.get('page');
    const pageNumber = pageParam ? parseInt(pageParam, 10) : 1;

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

    const totalPages = Math.ceil(foodsInCategory.length / PAGE_SIZE);

    if (pageNumber > totalPages) {
      return new Response(
        JSON.stringify({
          error: `Page ${pageNumber} does not exist. Total pages: ${totalPages}`,
          category,
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
    const paginatedFoods = foodsInCategory.slice(startIndex, endIndex);

    const hasPreviousPage = pageNumber > 1;
    const hasNextPage = pageNumber < totalPages;

    let previousPage: string | undefined;
    if (hasPreviousPage) {
      if (pageNumber === 2) {
        previousPage = `/api/categories/${encodeURIComponent(category)}.json`;
      } else {
        previousPage = `/api/categories/${encodeURIComponent(category)}.json?page=${pageNumber - 1}`;
      }
    }

    let nextPage: string | undefined;
    if (hasNextPage) {
      nextPage = `/api/categories/${encodeURIComponent(category)}.json?page=${pageNumber + 1}`;
    }

    const response: PaginationResponse = {
      category,
      count: foodsInCategory.length,
      page: pageNumber,
      pageSize: PAGE_SIZE,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      previousPage,
      nextPage,
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
        error: 'Failed to load category foods',
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
    const categories = getAllCategories();

    // Generate paths for each category
    const paths = Array.from(categories).map((category) => ({
      params: { category },
    }));

    return paths;
  } catch (error) {
    console.error('Error generating static paths for categories:', error);
    return [];
  }
}
