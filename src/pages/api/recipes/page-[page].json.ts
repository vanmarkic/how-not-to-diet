import type { APIRoute, GetStaticPathsResult } from 'astro';
import fs from 'fs';
import path from 'path';

interface PaginationMeta {
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage?: string;
  previousPage?: string;
  data: any[];
}

// Helper function to load all recipes
function loadAllRecipes(): any[] {
  const recipesDir = path.join(process.cwd(), 'data', 'recipes');
  const files = fs.readdirSync(recipesDir).filter(f => f.endsWith('.json'));

  const recipes = files.map(file => {
    const filePath = path.join(recipesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  });

  // Sort by ID for consistent ordering
  recipes.sort((a, b) => a.id.localeCompare(b.id));

  return recipes;
}

// Generate static paths for all pagination pages
export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  try {
    const recipes = loadAllRecipes();
    const totalRecipes = recipes.length;
    const pageSize = 25;
    const totalPages = Math.ceil(totalRecipes / pageSize);

    // Generate paths for pages 2 through totalPages
    // Page 1 is handled by recipes.json
    const paths: any[] = [];
    for (let page = 2; page <= totalPages; page++) {
      paths.push({ params: { page: page.toString() } });
    }

    return paths;
  } catch (error) {
    console.error('Error generating static paths:', error);
    return [];
  }
}

export const GET: APIRoute = async ({ params }) => {
  try {
    const recipes = loadAllRecipes();
    const totalRecipes = recipes.length;
    const pageSize = 25;
    const totalPages = Math.ceil(totalRecipes / pageSize);

    const page = parseInt(params.page as string, 10);

    // Validate page number
    if (isNaN(page) || page < 2 || page > totalPages) {
      return new Response(JSON.stringify({
        error: 'Invalid page number',
        message: `Page must be between 2 and ${totalPages}`
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Calculate pagination boundaries
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageRecipes = recipes.slice(startIndex, endIndex);

    // Determine next and previous page URLs
    let nextPage: string | undefined;
    let previousPage: string;

    if (page > totalPages) {
      nextPage = undefined;
    } else if (page < totalPages) {
      nextPage = `/api/recipes/page-${page + 1}.json`;
    }

    if (page === 2) {
      previousPage = '/api/recipes.json';
    } else {
      previousPage = `/api/recipes/page-${page - 1}.json`;
    }

    const response: PaginationMeta = {
      count: totalRecipes,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page < totalPages ? nextPage : undefined,
      previousPage,
      data: pageRecipes
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
      error: 'Failed to load recipes',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
