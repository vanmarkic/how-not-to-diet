# How Not To Diet - API Documentation

A static JSON API for accessing recipes and nutritional food data, compatible with GitHub Pages.

## Interactive API Testing

**Try the interactive Swagger UI:** [https://vanmarkic.github.io/how-not-to-diet/api-docs](https://vanmarkic.github.io/how-not-to-diet/api-docs)

Test all API endpoints directly in your browser with live examples and responses.

## Base URL

```
https://vanmarkic.github.io/how-not-to-diet/api
```

## Endpoints

All list endpoints return paginated results with 25 items per page.

### Search

#### Recipe Search Index
**GET** `/search/recipes.json`

Returns a complete search index of all recipes with searchable text for client-side filtering.

**Response:**
```json
{
  "count": 59,
  "recipes": [
    {
      "id": "recipe-001",
      "name": "Antipasto Vegetables With Tuscan White Bean Dressing",
      "searchText": "antipasto vegetables tuscan white bean dressing beans-legumes bell-peppers lunch easy",
      ...all recipe fields...
    }
  ]
}
```

#### Food Search Index
**GET** `/search/foods.json`

Returns a complete search index of all foods with searchable text for client-side filtering.

**Response:**
```json
{
  "count": 209,
  "foods": [
    {
      "id": "food-1",
      "name": "Adzuki Beans (Aduki Beans)",
      "searchText": "adzuki beans aduki beans rich-in-legumes high-fiber...",
      ...all food fields...
    }
  ]
}
```

### Filters

#### List All Categories
**GET** `/categories.json`

Returns all food categories with counts.

**Response:**
```json
{
  "count": 71,
  "categories": [
    {
      "name": "anti-inflammatory",
      "foodCount": 134
    }
  ]
}
```

#### Filter Foods by Category
**GET** `/categories/{category}.json`

Filters foods by a specific category (paginated, 25 per page).

**Example:**
```
GET /categories/anti-inflammatory.json
```

**Response:**
```json
{
  "category": "anti-inflammatory",
  "count": 134,
  "page": 1,
  "pageSize": 25,
  "totalPages": 6,
  "hasNextPage": true,
  "hasPreviousPage": false,
  "nextPage": "/api/categories/anti-inflammatory.json?page=2",
  "foods": [ ...25 foods... ]
}
```

#### List All Properties
**GET** `/properties.json`

Returns all food properties with counts.

**Response:**
```json
{
  "count": 864,
  "properties": [
    {
      "name": "High in fiber",
      "foodCount": 45
    }
  ]
}
```

#### List All Synergies
**GET** `/synergies.json`

Returns all food synergies with counts.

**Response:**
```json
{
  "count": 282,
  "synergies": [
    {
      "name": "rocket",
      "foodCount": 5
    }
  ]
}
```

#### List All Timings
**GET** `/timings.json`

Returns all meal timings with counts.

**Response:**
```json
{
  "count": 60,
  "timings": [
    {
      "name": "breakfast",
      "foodCount": 41
    }
  ]
}
```

#### Filter Foods by Timing
**GET** `/timings/{timing}.json`

Filters foods by a specific meal timing (paginated, 25 per page).

**Example:**
```
GET /timings/breakfast.json
```

**Response:**
```json
{
  "timing": "breakfast",
  "count": 41,
  "pagination": {
    "page": 1,
    "pageSize": 25,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPreviousPage": false,
    "nextPage": "/api/timings/breakfast.json?page=2"
  },
  "foods": [ ...25 foods... ]
}
```

### Recipes

#### List Recipes (Page 1)
**GET** `/recipes.json`

Returns the first page of recipes (25 per page) with pagination metadata.

**Response:**
```json
{
  "count": 59,
  "page": 1,
  "pageSize": 25,
  "totalPages": 3,
  "hasNextPage": true,
  "hasPreviousPage": false,
  "nextPage": "/api/recipes/page-2.json",
  "previousPage": null,
  "data": [
    {
      "id": "recipe-001",
      "name": "Antipasto Vegetables With Tuscan White Bean Dressing",
      "page": 120,
      "meal_type": "lunch",
      "servings": 4,
      "difficulty": "easy",
      "foods": [...],
      "daily_dozen_coverage": {...},
      "tweaks_21_incorporated": [...],
      "key_synergies": [...]
    }
  ]
}
```

#### Get Recipes Page
**GET** `/recipes/page-{page}.json`

Returns a specific page of recipes (pages 2-3).

**Parameters:**
- `page` (integer): Page number (2 or higher)

**Example:**
```
GET /recipes/page-2.json
```

**Response:**
```json
{
  "count": 59,
  "page": 2,
  "pageSize": 25,
  "totalPages": 3,
  "hasNextPage": true,
  "hasPreviousPage": true,
  "nextPage": "/api/recipes/page-3.json",
  "previousPage": "/api/recipes.json",
  "data": [ ...25 recipes... ]
}
```

#### Get Recipe by ID
**GET** `/recipes/{id}.json`

Returns a single recipe by its ID.

**Parameters:**
- `id` (string): Recipe ID (e.g., `recipe-072`)

**Example:**
```
GET /recipes/recipe-072.json
```

**Response:**
```json
{
  "data": {
    "id": "recipe-072",
    "name": "Slow Cooker Apple Pie Oat Groats",
    "page": 309,
    "servings": "4",
    "difficulty": "Easy",
    "meal_type": "Breakfast",
    "foods_used": [
      "oat-groats-whole-intact-oats",
      "chia-seeds",
      "cinnamon",
      "apples",
      "goji-berries"
    ],
    "daily_dozen_coverage": {
      "berries": 1,
      "other_fruits": 1,
      "nuts_seeds": 1,
      "herbs_spices": 1,
      "whole_grains": 1
    },
    "tweaks_21_incorporated": [],
    "key_synergies": [
      "oat-groats-whole-intact-oats",
      "apples"
    ]
  }
}
```

### Foods

#### List Foods (Page 1)
**GET** `/foods.json`

Returns the first page of foods (25 per page) with pagination metadata.

**Response:**
```json
{
  "count": 209,
  "page": 1,
  "pageSize": 25,
  "totalPages": 9,
  "hasNextPage": true,
  "hasPreviousPage": false,
  "nextPage": "/api/foods/page-2.json",
  "previousPage": null,
  "data": [
    {
      "id": "food-1",
      "name": "Adzuki Beans (Aduki Beans)",
      "categories": [
        "rich-in-legumes",
        "high-fiber",
        "low-insulin-index",
        "particularly-satiating",
        "microbiome-friendly",
        "anti-inflammatory"
      ],
      "properties": [...],
      "benefits": [...],
      "synergies": [...],
      "timing": [...],
      "amount": "Part of 3 daily servings of legumes",
      "sources": {...},
      "conflicts": []
    }
  ]
}
```

#### Get Foods Page
**GET** `/foods/page-{page}.json`

Returns a specific page of foods (pages 2-9).

**Parameters:**
- `page` (integer): Page number (2 or higher)

**Example:**
```
GET /foods/page-5.json
```

**Response:**
```json
{
  "count": 209,
  "page": 5,
  "pageSize": 25,
  "totalPages": 9,
  "hasNextPage": true,
  "hasPreviousPage": true,
  "nextPage": "/api/foods/page-6.json",
  "previousPage": "/api/foods/page-4.json",
  "data": [ ...25 foods... ]
}
```

#### Get Food by ID
**GET** `/foods/{id}.json`

Returns a single food by its ID.

**Parameters:**
- `id` (string): Food ID (e.g., `food-158`)

**Example:**
```
GET /foods/food-158.json
```

**Response:**
```json
{
  "data": {
    "id": "food-158",
    "name": "Poppy Seeds",
    "categories": [
      "nuts-and-seeds",
      "antioxidant-rich",
      "anti-inflammatory"
    ],
    "properties": [
      "Tiny seeds about the size of teff grain",
      "Rich in calcium and manganese",
      "Contains healthy polyunsaturated fats",
      "Provides iron, zinc, and magnesium",
      "Good source of dietary fiber",
      "Contains oleic acid and linoleic acid",
      "Provides plant-based protein"
    ],
    "benefits": [
      "Supports bone health with high calcium content",
      "Provides minerals for metabolic function",
      "Contains healthy fats for cardiovascular health",
      "May help improve digestion with fiber content",
      "Supports immune system with zinc",
      "Contains antioxidants that protect cells",
      "May help with sleep quality (contains alkaloids in trace amounts)",
      "Adds texture and nutrition to dishes"
    ],
    "synergies": [
      "Used as comparison for teff grain size in recipes",
      "Can be sprinkled on salads and baked goods",
      "Pairs well with other seeds for nutrition",
      "Complements whole grains and vegetables"
    ],
    "timing": [
      "any-meal",
      "breakfast",
      "snacks"
    ],
    "amount": "1-2 teaspoons per serving (about 5-10g)",
    "sources": {
      "pages": [271, 968],
      "quotes": [...]
    },
    "conflicts": []
  }
}
```

## OpenAPI Specification

The complete OpenAPI 3.0 specification is available at:

```
https://vanmarkic.github.io/how-not-to-diet/openapi.json
```

You can use this specification with:
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [ReDoc](https://redocly.com/redoc)
- API client generators
- Testing tools like Postman or Insomnia

## Usage Examples

### JavaScript (Fetch API)

```javascript
// Search for recipes containing "smoothie"
fetch('https://vanmarkic.github.io/how-not-to-diet/api/search/recipes.json')
  .then(response => response.json())
  .then(data => {
    const searchQuery = 'smoothie';
    const results = data.recipes.filter(recipe =>
      recipe.searchText.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log(`Found ${results.length} recipes matching "${searchQuery}"`);
  });

// Search for foods containing "bean"
fetch('https://vanmarkic.github.io/how-not-to-diet/api/search/foods.json')
  .then(response => response.json())
  .then(data => {
    const searchQuery = 'bean';
    const results = data.foods.filter(food =>
      food.searchText.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log(`Found ${results.length} foods matching "${searchQuery}"`);
  });

// Get all categories
fetch('https://vanmarkic.github.io/how-not-to-diet/api/categories.json')
  .then(response => response.json())
  .then(data => {
    console.log(`Found ${data.count} categories`);
    data.categories.forEach(cat => {
      console.log(`${cat.name}: ${cat.foodCount} foods`);
    });
  });

// Get foods in anti-inflammatory category
fetch('https://vanmarkic.github.io/how-not-to-diet/api/categories/anti-inflammatory.json')
  .then(response => response.json())
  .then(data => {
    console.log(`${data.count} anti-inflammatory foods`);
    console.log(`Page ${data.page} of ${data.totalPages}`);
  });

// Get first page of recipes
fetch('https://vanmarkic.github.io/how-not-to-diet/api/recipes.json')
  .then(response => response.json())
  .then(data => {
    console.log(`Found ${data.count} total recipes`);
    console.log(`Page ${data.page} of ${data.totalPages}`);
    console.log(`Showing ${data.data.length} recipes`);
    console.log(data.data);

    // Load next page if available
    if (data.hasNextPage) {
      console.log(`Next page: ${data.nextPage}`);
    }
  });

// Get specific page of recipes
fetch('https://vanmarkic.github.io/how-not-to-diet/api/recipes/page-2.json')
  .then(response => response.json())
  .then(data => {
    console.log(`Page ${data.page}: ${data.data.length} recipes`);
  });

// Fetch all recipes across all pages
async function getAllRecipes() {
  let allRecipes = [];
  let currentUrl = 'https://vanmarkic.github.io/how-not-to-diet/api/recipes.json';

  while (currentUrl) {
    const response = await fetch(currentUrl);
    const data = await response.json();
    allRecipes.push(...data.data);

    // Get next page URL (prepend base URL if needed)
    currentUrl = data.hasNextPage
      ? `https://vanmarkic.github.io/how-not-to-diet${data.nextPage}`
      : null;
  }

  return allRecipes;
}

// Get specific recipe
fetch('https://vanmarkic.github.io/how-not-to-diet/api/recipes/recipe-072.json')
  .then(response => response.json())
  .then(data => {
    console.log(data.data.name);
  });

// Get first page of foods
fetch('https://vanmarkic.github.io/how-not-to-diet/api/foods.json')
  .then(response => response.json())
  .then(data => {
    console.log(`Found ${data.count} total foods`);
    console.log(`Page ${data.page} of ${data.totalPages}`);
  });

// Get specific food
fetch('https://vanmarkic.github.io/how-not-to-diet/api/foods/food-158.json')
  .then(response => response.json())
  .then(data => {
    console.log(data.data.name);
    console.log(data.data.benefits);
  });
```

### Python (requests)

```python
import requests

# Get first page of recipes
response = requests.get('https://vanmarkic.github.io/how-not-to-diet/api/recipes.json')
data = response.json()
print(f"Found {data['count']} total recipes")
print(f"Page {data['page']} of {data['totalPages']}")
print(f"Showing {len(data['data'])} recipes on this page")

# Get specific page
response = requests.get('https://vanmarkic.github.io/how-not-to-diet/api/recipes/page-2.json')
data = response.json()
print(f"Page {data['page']}: {len(data['data'])} recipes")

# Fetch all recipes across all pages
def get_all_recipes():
    base_url = 'https://vanmarkic.github.io/how-not-to-diet'
    all_recipes = []
    current_url = f'{base_url}/api/recipes.json'

    while current_url:
        response = requests.get(current_url)
        data = response.json()
        all_recipes.extend(data['data'])

        # Get next page URL
        if data['hasNextPage']:
            current_url = f"{base_url}{data['nextPage']}"
        else:
            current_url = None

    return all_recipes

# Get specific recipe
response = requests.get('https://vanmarkic.github.io/how-not-to-diet/api/recipes/recipe-072.json')
recipe = response.json()['data']
print(recipe['name'])

# Get first page of foods
response = requests.get('https://vanmarkic.github.io/how-not-to-diet/api/foods.json')
data = response.json()
print(f"Found {data['count']} total foods")
print(f"Page {data['page']} of {data['totalPages']}")

# Get specific food
response = requests.get('https://vanmarkic.github.io/how-not-to-diet/api/foods/food-158.json')
food = response.json()['data']
print(food['name'])
print(food['benefits'])
```

### cURL

```bash
# Get first page of recipes
curl https://vanmarkic.github.io/how-not-to-diet/api/recipes.json

# Get specific page of recipes
curl https://vanmarkic.github.io/how-not-to-diet/api/recipes/page-2.json

# Get specific recipe
curl https://vanmarkic.github.io/how-not-to-diet/api/recipes/recipe-072.json

# Get first page of foods
curl https://vanmarkic.github.io/how-not-to-diet/api/foods.json

# Get specific page of foods
curl https://vanmarkic.github.io/how-not-to-diet/api/foods/page-5.json

# Get specific food
curl https://vanmarkic.github.io/how-not-to-diet/api/foods/food-158.json
```

## Response Format

All responses are in JSON format with appropriate headers:
- `Content-Type: application/json`
- `Cache-Control: public, max-age=3600` (1 hour cache)

### Success Response (200 OK)
Returns the requested data in the format shown above.

### Error Response (404 Not Found)
```json
{
  "error": "Recipe not found",
  "message": "No recipe with ID 'recipe-999' exists"
}
```

## Data Schemas

### Recipe Schema
```typescript
{
  id: string;              // Unique recipe identifier
  name: string;            // Recipe name
  page: number;            // Page reference in source book
  servings: string;        // Number of servings
  difficulty: string;      // "Easy", "Medium", or "Hard"
  meal_type: string;       // "Breakfast", "Lunch", "Dinner", or "Snack"
  foods_used: string[];    // Array of food IDs used in recipe
  daily_dozen_coverage: {  // Coverage of daily dozen categories
    [key: string]: number;
  };
  tweaks_21_incorporated: string[];  // Weight-loss tweaks incorporated
  key_synergies: string[]; // Key food synergies in this recipe
}
```

### Food Schema
```typescript
{
  id: string;              // Unique food identifier
  name: string;            // Food name
  categories: string[];    // Food categories
  properties: string[];    // Food properties and characteristics
  benefits: string[];      // Health benefits
  synergies: string[];     // Foods that pair well with this food
  timing: string[];        // Recommended meal timings
  amount: string;          // Recommended serving amount
  sources: {               // Source references
    pages: number[];
    quotes: string[];
  };
  conflicts: string[];     // Foods to avoid pairing with
}
```

## Local Development

To build and test the API locally:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# The API files will be generated in dist/api/
# You can test them locally by serving the dist folder
npx serve dist
```

## Pagination Details

- **Page Size**: 25 items per page
- **Recipes**: 59 total recipes across 3 pages
- **Foods**: 209 total foods across 9 pages
- **Navigation**: Use `nextPage` and `previousPage` fields to navigate between pages
- **Page Numbers**: Page 1 is at `/recipes.json` or `/foods.json`, subsequent pages are at `/recipes/page-{n}.json` or `/foods/page-{n}.json`

## API Summary

### Endpoints Overview

- **Search**: 2 endpoints for client-side text search
  - `/search/recipes.json` - Recipe search index (59 recipes)
  - `/search/foods.json` - Food search index (209 foods)

- **Filters**: 6 endpoints for filtering and discovery
  - `/categories.json` - 71 categories
  - `/categories/{category}.json` - Filter by category (paginated)
  - `/properties.json` - 864 unique properties
  - `/synergies.json` - 282 food synergies
  - `/timings.json` - 60 meal timings
  - `/timings/{timing}.json` - Filter by timing (paginated)

- **Recipes**: 4 endpoints (paginated)
  - `/recipes.json` - List all recipes (page 1)
  - `/recipes/page-{page}.json` - Additional pages
  - `/recipes/{id}.json` - Get single recipe

- **Foods**: 4 endpoints (paginated)
  - `/foods.json` - List all foods (page 1)
  - `/foods/page-{page}.json` - Additional pages
  - `/foods/{id}.json` - Get single food

## Notes

- This is a **static API** - all data is pre-generated at build time
- The API is read-only (no POST, PUT, DELETE operations)
- All files are cached for 1 hour for optimal performance
- The API is automatically deployed to GitHub Pages on push to master
- Total dataset: 59 recipes and 209 foods
- List endpoints return paginated results (25 items per page)
- Detail endpoints (by ID) return single items without pagination
- Search endpoints return complete datasets for client-side filtering
- Filter endpoints (categories, timings) return paginated results (25 per page)

## License

This API and data are available under the same license as the main project.
