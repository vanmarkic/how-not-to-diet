# How Not To Diet - API Documentation

A static JSON API for accessing recipes and nutritional food data, compatible with GitHub Pages.

## Base URL

```
https://vanmarkic.github.io/how-not-to-diet/api
```

## Endpoints

### Recipes

#### List All Recipes
**GET** `/recipes.json`

Returns a list of all available recipes.

**Response:**
```json
{
  "count": 59,
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

#### List All Foods
**GET** `/foods.json`

Returns a list of all available foods.

**Response:**
```json
{
  "count": 209,
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
// Get all recipes
fetch('https://vanmarkic.github.io/how-not-to-diet/api/recipes.json')
  .then(response => response.json())
  .then(data => {
    console.log(`Found ${data.count} recipes`);
    console.log(data.data);
  });

// Get specific recipe
fetch('https://vanmarkic.github.io/how-not-to-diet/api/recipes/recipe-072.json')
  .then(response => response.json())
  .then(data => {
    console.log(data.data.name);
  });

// Get all foods
fetch('https://vanmarkic.github.io/how-not-to-diet/api/foods.json')
  .then(response => response.json())
  .then(data => {
    console.log(`Found ${data.count} foods`);
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

# Get all recipes
response = requests.get('https://vanmarkic.github.io/how-not-to-diet/api/recipes.json')
data = response.json()
print(f"Found {data['count']} recipes")

# Get specific recipe
response = requests.get('https://vanmarkic.github.io/how-not-to-diet/api/recipes/recipe-072.json')
recipe = response.json()['data']
print(recipe['name'])

# Get all foods
response = requests.get('https://vanmarkic.github.io/how-not-to-diet/api/foods.json')
data = response.json()
print(f"Found {data['count']} foods")

# Get specific food
response = requests.get('https://vanmarkic.github.io/how-not-to-diet/api/foods/food-158.json')
food = response.json()['data']
print(food['name'])
print(food['benefits'])
```

### cURL

```bash
# Get all recipes
curl https://vanmarkic.github.io/how-not-to-diet/api/recipes.json

# Get specific recipe
curl https://vanmarkic.github.io/how-not-to-diet/api/recipes/recipe-072.json

# Get all foods
curl https://vanmarkic.github.io/how-not-to-diet/api/foods.json

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

## Notes

- This is a **static API** - all data is pre-generated at build time
- The API is read-only (no POST, PUT, DELETE operations)
- All files are cached for 1 hour for optimal performance
- The API is automatically deployed to GitHub Pages on push to master
- Total dataset: 59 recipes and 209 foods

## License

This API and data are available under the same license as the main project.
