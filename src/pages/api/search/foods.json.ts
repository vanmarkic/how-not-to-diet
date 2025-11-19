import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

interface Food {
  id: string;
  name: string;
  categories?: string[];
  properties?: string[];
  benefits?: string;
  synergies?: string[];
  conflicts?: string[];
  timing?: string[];
  amount?: string;
  sources?: {
    pages?: number[];
    quotes?: string[];
  };
  [key: string]: any;
}

interface FoodSearchItem extends Food {
  searchText: string;
}

interface SearchIndexResponse {
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  foods: FoodSearchItem[];
}

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 20; // Limit to ensure response stays under 1000 lines

/**
 * Creates a normalized search text from food data
 * Combines name, categories, properties, benefits, and synergies into a single searchable string
 */
function createSearchText(food: Food): string {
  const parts: string[] = [];

  // Add name
  if (food.name) {
    parts.push(food.name.toLowerCase());
  }

  // Add categories
  if (Array.isArray(food.categories)) {
    parts.push(...food.categories.map((cat: string) => cat.toLowerCase()));
  }

  // Add properties
  if (Array.isArray(food.properties)) {
    parts.push(...food.properties.map((prop: string) => prop.toLowerCase()));
  }

  // Add benefits
  if (food.benefits && typeof food.benefits === 'string') {
    parts.push(food.benefits.toLowerCase());
  }

  // Add synergies
  if (Array.isArray(food.synergies)) {
    parts.push(...food.synergies.map((syn: string) => syn.toLowerCase()));
  }

  // Join all parts with spaces and deduplicate words
  const combined = parts.join(' ');
  const words = combined.split(/\s+/).filter(word => word.length > 0);
  const unique = Array.from(new Set(words));

  return unique.join(' ');
}

export const GET: APIRoute = async ({ url }) => {
  try {
    // Parse pagination parameters
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(url.searchParams.get('limit') || String(DEFAULT_PAGE_SIZE), 10)));

    // Read all food files from data/foods directory
    const foodsDir = path.join(process.cwd(), 'data', 'foods');

    if (!fs.existsSync(foodsDir)) {
      return new Response(
        JSON.stringify({
          error: 'Foods directory not found',
          message: `The directory ${foodsDir} does not exist`
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

    // Read and process all food files
    const allFoods: FoodSearchItem[] = files.map(file => {
      const filePath = path.join(foodsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const food: Food = JSON.parse(content);

      return {
        ...food,
        searchText: createSearchText(food)
      };
    });

    // Sort by ID for consistent ordering
    allFoods.sort((a, b) => {
      // Extract numeric part from IDs like "food-1", "food-209"
      const aNum = parseInt(a.id.replace(/\D/g, '') || '0', 10);
      const bNum = parseInt(b.id.replace(/\D/g, '') || '0', 10);
      return aNum - bNum;
    });

    // Calculate pagination
    const totalCount = allFoods.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFoods = allFoods.slice(startIndex, endIndex);

    const response: SearchIndexResponse = {
      count: totalCount,
      page,
      pageSize: limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      foods: paginatedFoods
    };

    return new Response(JSON.stringify(response, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to create food search index',
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
