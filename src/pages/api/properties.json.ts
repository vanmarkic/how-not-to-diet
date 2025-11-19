import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

interface Food {
  id: string;
  name: string;
  properties?: string[];
  [key: string]: unknown;
}

interface Property {
  name: string;
  foodCount: number;
}

export const GET: APIRoute = async () => {
  try {
    // Read all food files from data/foods directory
    const foodsDir = path.join(process.cwd(), 'data', 'foods');
    const files = fs.readdirSync(foodsDir).filter(f => f.endsWith('.json'));

    // Extract all unique properties and count food occurrences
    const propertyMap = new Map<string, number>();

    files.forEach(file => {
      try {
        const filePath = path.join(foodsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const food: Food = JSON.parse(content);

        // Process properties array if it exists
        if (food.properties && Array.isArray(food.properties)) {
          food.properties.forEach(property => {
            if (typeof property === 'string' && property.trim()) {
              const trimmedProperty = property.trim();
              propertyMap.set(
                trimmedProperty,
                (propertyMap.get(trimmedProperty) || 0) + 1
              );
            }
          });
        }
      } catch (fileError) {
        console.error(`Error processing file ${file}:`, fileError);
        // Continue processing other files if one fails
      }
    });

    // Convert map to sorted array
    const properties: Property[] = Array.from(propertyMap.entries())
      .map(([name, foodCount]) => ({
        name,
        foodCount
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return new Response(
      JSON.stringify({
        count: properties.length,
        properties
      }, null, 2),
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
        error: 'Failed to load properties',
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
