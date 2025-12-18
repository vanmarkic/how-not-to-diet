# Food Search API Pagination Summary

## Overview
The `/search/foods.json` endpoint has been updated with pagination to ensure responses never exceed 1000 lines of JSON.

## Endpoint Details

**URL:** `/api/search/foods.json`

**Method:** GET

**Query Parameters:**
- `page` (optional, default: 1) - Page number (minimum: 1)
- `limit` (optional, default: 10) - Items per page (minimum: 1, maximum: 20)

## Response Format

```json
{
  "count": 209,           // Total number of foods
  "page": 1,              // Current page number
  "pageSize": 10,         // Items per page
  "totalPages": 21,       // Total number of pages
  "hasNextPage": true,    // Whether there's a next page
  "hasPreviousPage": false, // Whether there's a previous page
  "foods": [              // Array of food items (max 20)
    {
      "id": "food-1",
      "name": "Adzuki Beans (Aduki Beans)",
      "categories": [...],
      "properties": [...],
      "benefits": "...",
      "synergies": [...],
      "timing": [...],
      "amount": "...",
      "sources": {...},
      "conflicts": [],
      "searchText": "..."  // Searchable text combining all fields
    }
  ]
}
```

## Response Size Guarantees

| Limit | Estimated Lines | Status |
|-------|----------------|--------|
| 10 (default) | ~417 lines | ✅ Under 1000 |
| 15 | ~625 lines | ✅ Under 1000 |
| 20 (max) | ~834 lines | ✅ Under 1000 |

**Maximum response size:** ~834 lines (enforced by MAX_PAGE_SIZE = 20)

## Usage Examples

### Default pagination (10 items)
```bash
GET /api/search/foods.json
```

### Custom page size
```bash
GET /api/search/foods.json?limit=15
```

### Navigate to page 2
```bash
GET /api/search/foods.json?page=2&limit=10
```

### Maximum items per page (20)
```bash
GET /api/search/foods.json?limit=50  # Will be capped at 20
```

## JavaScript Example

```javascript
// Fetch first page with 10 items
const response = await fetch('/api/search/foods.json');
const data = await response.json();

console.log(`Showing ${data.foods.length} of ${data.count} foods`);
console.log(`Page ${data.page} of ${data.totalPages}`);

// Check if more data available
if (data.hasNextPage) {
  const nextPage = await fetch(`/api/search/foods.json?page=${data.page + 1}&limit=${data.pageSize}`);
  // ...
}
```

## Pagination Logic

```typescript
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 20; // Ensures < 1000 lines

// Parse and validate parameters
const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(url.searchParams.get('limit') || String(DEFAULT_PAGE_SIZE), 10)));

// Calculate pagination
const totalCount = allFoods.length;
const totalPages = Math.ceil(totalCount / limit);
const startIndex = (page - 1) * limit;
const endIndex = startIndex + limit;
const paginatedFoods = allFoods.slice(startIndex, endIndex);
```

## Test Coverage

The endpoint includes comprehensive tests to ensure:

1. ✅ Default pagination works (10 items per page)
2. ✅ Custom page numbers are respected
3. ✅ Custom limit parameter is respected
4. ✅ Maximum limit is enforced (20)
5. ✅ **Response never exceeds 1000 lines of JSON**
6. ✅ Pagination metadata is accurate
7. ✅ Out-of-bounds pages handled gracefully
8. ✅ SearchText is included in all items
9. ✅ Consistent ordering across requests
10. ✅ Proper cache headers set

Run tests with:
```bash
npm test -- src/pages/api/search/foods.json.test.ts
```

## Performance Characteristics

- **Default response:** ~417 lines, ~20 KB
- **Maximum response:** ~834 lines, ~40 KB
- **Cache:** 1 hour (3600 seconds)
- **Total foods:** 209
- **Total pages (default):** 21 pages

## Migration Notes

### Breaking Changes
The response format has changed from:
```json
{
  "count": 209,
  "foods": [/* all 209 foods */]
}
```

To:
```json
{
  "count": 209,
  "page": 1,
  "pageSize": 10,
  "totalPages": 21,
  "hasNextPage": true,
  "hasPreviousPage": false,
  "foods": [/* 10 foods */]
}
```

### For Existing Clients
If you need all foods at once, use the lightweight endpoint instead:
- `/api/search/foods-light.json` - Returns all 209 foods with minimal data (~42 KB, 8 KB compressed)

Or iterate through pages:
```javascript
async function getAllFoods() {
  let allFoods = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`/api/search/foods.json?page=${page}&limit=20`);
    const data = await response.json();

    allFoods.push(...data.foods);
    hasMore = data.hasNextPage;
    page++;
  }

  return allFoods;
}
```

## Related Endpoints

- `/api/search/foods-light.json` - Lightweight version (ID, name, categories only)
- `/api/foods.json` - Paginated list of all foods (25 per page)
- `/api/foods/page-{n}.json` - Specific page of foods
- `/api/foods/{id}.json` - Single food by ID

---

*Last updated: November 19, 2025*
