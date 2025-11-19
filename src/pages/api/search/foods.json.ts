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
  foods: FoodSearchItem[];
}

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

export const GET: APIRoute = async () => {
  try {
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
    const foods: FoodSearchItem[] = files.map(file => {
      const filePath = path.join(foodsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const food: Food = JSON.parse(content);

      return {
        ...food,
        searchText: createSearchText(food)
      };
    });

    // Sort by ID for consistent ordering
    foods.sort((a, b) => {
      // Extract numeric part from IDs like "food-1", "food-209"
      const aNum = parseInt(a.id.replace(/\D/g, '') || '0', 10);
      const bNum = parseInt(b.id.replace(/\D/g, '') || '0', 10);
      return aNum - bNum;
    });

    const response: SearchIndexResponse = {
      count: foods.length,
      foods
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
