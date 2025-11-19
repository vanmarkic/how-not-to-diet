import { describe, it, expect } from 'vitest';
import { GET } from './foods.json';

describe('GET /api/search/foods.json', () => {
  it('should return paginated results with default limit of 10', async () => {
    const url = new URL('http://localhost/api/search/foods.json');
    const response = await GET({ url } as any);

    const data = await response.json();

    expect(data).toHaveProperty('count');
    expect(data).toHaveProperty('page');
    expect(data).toHaveProperty('pageSize');
    expect(data).toHaveProperty('totalPages');
    expect(data).toHaveProperty('hasNextPage');
    expect(data).toHaveProperty('hasPreviousPage');
    expect(data).toHaveProperty('foods');

    expect(data.page).toBe(1);
    expect(data.pageSize).toBe(10);
    expect(data.foods.length).toBeLessThanOrEqual(10);
  });

  it('should respect custom page parameter', async () => {
    const url = new URL('http://localhost/api/search/foods.json?page=2');
    const response = await GET({ url } as any);

    const data = await response.json();

    expect(data.page).toBe(2);
    expect(data.hasPreviousPage).toBe(true);
  });

  it('should respect custom limit parameter', async () => {
    const url = new URL('http://localhost/api/search/foods.json?limit=5');
    const response = await GET({ url } as any);

    const data = await response.json();

    expect(data.pageSize).toBe(5);
    expect(data.foods.length).toBeLessThanOrEqual(5);
  });

  it('should enforce maximum limit of 20', async () => {
    const url = new URL('http://localhost/api/search/foods.json?limit=100');
    const response = await GET({ url } as any);

    const data = await response.json();

    expect(data.pageSize).toBe(20);
    expect(data.foods.length).toBeLessThanOrEqual(20);
  });

  it('should never return more than 1000 lines of JSON', async () => {
    // Test with default limit
    const urlDefault = new URL('http://localhost/api/search/foods.json');
    const responseDefault = await GET({ url: urlDefault } as any);
    const textDefault = await responseDefault.text();
    const linesDefault = textDefault.split('\n').length;

    expect(linesDefault).toBeLessThanOrEqual(1000);

    // Test with max limit (20)
    const urlMax = new URL('http://localhost/api/search/foods.json?limit=20');
    const responseMax = await GET({ url: urlMax } as any);
    const textMax = await responseMax.text();
    const linesMax = textMax.split('\n').length;

    expect(linesMax).toBeLessThanOrEqual(1000);

    // Test with various page sizes
    for (const limit of [5, 10, 15, 20]) {
      const url = new URL(`http://localhost/api/search/foods.json?limit=${limit}`);
      const response = await GET({ url } as any);
      const text = await response.text();
      const lines = text.split('\n').length;

      expect(lines).toBeLessThanOrEqual(1000);
    }
  });

  it('should have valid pagination metadata', async () => {
    const url = new URL('http://localhost/api/search/foods.json?page=1&limit=10');
    const response = await GET({ url } as any);

    const data = await response.json();

    // Verify pagination math
    expect(data.totalPages).toBe(Math.ceil(data.count / data.pageSize));
    expect(data.hasNextPage).toBe(data.page < data.totalPages);
    expect(data.hasPreviousPage).toBe(data.page > 1);
  });

  it('should handle page numbers beyond total pages gracefully', async () => {
    const url = new URL('http://localhost/api/search/foods.json?page=999');
    const response = await GET({ url } as any);

    const data = await response.json();

    expect(data.foods.length).toBe(0);
    expect(data.hasNextPage).toBe(false);
    expect(data.hasPreviousPage).toBe(true);
  });

  it('should include searchText in food items', async () => {
    const url = new URL('http://localhost/api/search/foods.json?limit=1');
    const response = await GET({ url } as any);

    const data = await response.json();

    expect(data.foods.length).toBeGreaterThan(0);
    expect(data.foods[0]).toHaveProperty('searchText');
    expect(typeof data.foods[0].searchText).toBe('string');
  });

  it('should return foods in consistent order', async () => {
    const url1 = new URL('http://localhost/api/search/foods.json?page=1&limit=5');
    const response1 = await GET({ url: url1 } as any);
    const data1 = await response1.json();

    const url2 = new URL('http://localhost/api/search/foods.json?page=1&limit=5');
    const response2 = await GET({ url: url2 } as any);
    const data2 = await response2.json();

    expect(data1.foods).toEqual(data2.foods);
  });

  it('should have proper cache headers', async () => {
    const url = new URL('http://localhost/api/search/foods.json');
    const response = await GET({ url } as any);

    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600');
  });
});
