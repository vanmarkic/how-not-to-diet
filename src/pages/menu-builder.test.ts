/**
 * Menu Builder Page Tests
 *
 * Tests the static menu-builder.astro page functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadRecipes, loadFoods } from '@utils/dataLoader';
import {
  checkDailyDozenCompliance,
  suggestFoodsToAdd,
  findComplementaryRecipes,
} from '@utils/menuGenerator';

describe('Menu Builder Page - Data Loading', () => {
  it('should load recipes successfully', async () => {
    const recipes = await loadRecipes();
    expect(recipes).toBeDefined();
    expect(Array.isArray(recipes)).toBe(true);
    expect(recipes.length).toBeGreaterThan(0);
  });

  it('should load foods successfully', async () => {
    const foods = await loadFoods();
    expect(foods).toBeDefined();
    expect(Array.isArray(foods)).toBe(true);
    expect(foods.length).toBeGreaterThan(0);
  });

  it('should find breakfast and lunch recipes', async () => {
    const recipes = await loadRecipes();
    const breakfast = recipes.find((r) => r.category === 'breakfast');
    const lunch = recipes.find((r) => r.category === 'lunch');

    expect(breakfast).toBeDefined();
    expect(lunch).toBeDefined();
  });
});

describe('Menu Builder Page - Daily Dozen Compliance', () => {
  it('should check daily dozen compliance for meals', async () => {
    const recipes = await loadRecipes();
    const breakfast = recipes.find((r) => r.category === 'breakfast');
    const lunch = recipes.find((r) => r.category === 'lunch');

    if (breakfast && lunch) {
      const compliance = await checkDailyDozenCompliance(breakfast, lunch);

      expect(compliance).toBeDefined();
      expect(compliance).toHaveProperty('compliant');
      expect(compliance).toHaveProperty('missing');
      expect(compliance).toHaveProperty('present');
      expect(typeof compliance.compliant).toBe('boolean');
      expect(Array.isArray(compliance.missing)).toBe(true);
      expect(Array.isArray(compliance.present)).toBe(true);
    }
  });

  it('should provide missing and present category information', async () => {
    const recipes = await loadRecipes();
    const breakfast = recipes.find((r) => r.category === 'breakfast');
    const lunch = recipes.find((r) => r.category === 'lunch');

    if (breakfast && lunch) {
      const compliance = await checkDailyDozenCompliance(breakfast, lunch);

      // Should have either missing or present items (or both)
      const totalItems = compliance.missing.length + compliance.present.length;
      expect(totalItems).toBeGreaterThan(0);
    }
  });
});

describe('Menu Builder Page - Food Suggestions', () => {
  it('should generate food suggestions for breakfast', async () => {
    const recipes = await loadRecipes();
    const foods = await loadFoods();
    const breakfast = recipes.find((r) => r.category === 'breakfast');

    if (breakfast) {
      const breakfastFoods = breakfast.ingredients.map((i) => i.name);
      const matchingFoods = foods.filter((f) =>
        breakfastFoods.some(
          (bf) =>
            f.name.toLowerCase().includes(bf.toLowerCase()) ||
            bf.toLowerCase().includes(f.name.toLowerCase())
        )
      );
      const foodNames = matchingFoods.map((f) => f.name);

      const suggestions = await suggestFoodsToAdd(foodNames, 'breakfast');

      expect(suggestions).toBeDefined();
      expect(Array.isArray(suggestions)).toBe(true);
      // Suggestions should have the expected structure
      if (suggestions.length > 0) {
        expect(suggestions[0]).toHaveProperty('food');
        expect(suggestions[0]).toHaveProperty('reason');
        expect(suggestions[0]).toHaveProperty('synergyBoost');
      }
    }
  });

  it('should limit suggestions to 5 items', async () => {
    const recipes = await loadRecipes();
    const foods = await loadFoods();
    const breakfast = recipes.find((r) => r.category === 'breakfast');

    if (breakfast) {
      const breakfastFoods = breakfast.ingredients.map((i) => i.name);
      const matchingFoods = foods.filter((f) =>
        breakfastFoods.some(
          (bf) =>
            f.name.toLowerCase().includes(bf.toLowerCase()) ||
            bf.toLowerCase().includes(f.name.toLowerCase())
        )
      );
      const foodNames = matchingFoods.map((f) => f.name);

      const suggestions = await suggestFoodsToAdd(foodNames, 'breakfast');

      expect(suggestions.length).toBeLessThanOrEqual(5);
    }
  });
});

describe('Menu Builder Page - Complementary Recipes', () => {
  it('should find complementary recipes for lunch', async () => {
    const recipes = await loadRecipes();
    const lunch = recipes.find((r) => r.category === 'lunch');

    if (lunch) {
      const complementary = await findComplementaryRecipes(lunch, recipes);

      expect(complementary).toBeDefined();
      expect(Array.isArray(complementary)).toBe(true);
      // Should have recipe and synergy score structure
      if (complementary.length > 0) {
        expect(complementary[0]).toHaveProperty('recipe');
        expect(complementary[0]).toHaveProperty('synergyScore');
        expect(typeof complementary[0].synergyScore).toBe('number');
      }
    }
  });

  it('should limit complementary recipes to 3 by default', async () => {
    const recipes = await loadRecipes();
    const lunch = recipes.find((r) => r.category === 'lunch');

    if (lunch && recipes.length > 3) {
      const complementary = await findComplementaryRecipes(lunch, recipes);

      expect(complementary.length).toBeLessThanOrEqual(3);
    }
  });

  it('should not include the base recipe in complementary results', async () => {
    const recipes = await loadRecipes();
    const lunch = recipes.find((r) => r.category === 'lunch');

    if (lunch) {
      const complementary = await findComplementaryRecipes(lunch, recipes);

      // None of the complementary recipes should have the same ID as lunch
      complementary.forEach((item) => {
        expect(item.recipe.id).not.toBe(lunch.id);
      });
    }
  });

  it('should sort complementary recipes by synergy score', async () => {
    const recipes = await loadRecipes();
    const lunch = recipes.find((r) => r.category === 'lunch');

    if (lunch && recipes.length > 1) {
      const complementary = await findComplementaryRecipes(lunch, recipes);

      // Check that results are sorted descending by synergyScore
      for (let i = 1; i < complementary.length; i++) {
        expect(complementary[i - 1].synergyScore).toBeGreaterThanOrEqual(
          complementary[i].synergyScore
        );
      }
    }
  });
});

describe('Menu Builder Page - Integration', () => {
  it('should have all required data for page rendering', async () => {
    const recipes = await loadRecipes();
    const foods = await loadFoods();
    const breakfast = recipes.find((r) => r.category === 'breakfast');
    const lunch = recipes.find((r) => r.category === 'lunch');

    expect(recipes.length).toBeGreaterThan(0);
    expect(foods.length).toBeGreaterThan(0);
    expect(breakfast).toBeDefined();
    expect(lunch).toBeDefined();

    if (breakfast && lunch) {
      // Page should be able to generate all sections
      const compliance = await checkDailyDozenCompliance(breakfast, lunch);
      expect(compliance).toBeDefined();

      const breakfastFoods = breakfast.ingredients.map((i) => i.name);
      const matchingFoods = foods.filter((f) =>
        breakfastFoods.some(
          (bf) =>
            f.name.toLowerCase().includes(bf.toLowerCase()) ||
            bf.toLowerCase().includes(f.name.toLowerCase())
        )
      );
      const foodNames = matchingFoods.map((f) => f.name);

      const suggestions = await suggestFoodsToAdd(foodNames, 'breakfast');
      expect(suggestions).toBeDefined();

      const complementary = await findComplementaryRecipes(lunch, recipes);
      expect(complementary).toBeDefined();
    }
  });

  it('should handle case when no recipes match criteria', async () => {
    const recipes = await loadRecipes();
    const emptyRecipes: typeof recipes = [];

    const lunch = recipes.find((r) => r.category === 'lunch');
    if (lunch) {
      const complementary = await findComplementaryRecipes(
        lunch,
        emptyRecipes
      );
      expect(complementary).toEqual([]);
    }
  });

  it('should handle empty food suggestions', async () => {
    const suggestions = await suggestFoodsToAdd([], 'breakfast');
    expect(suggestions).toBeDefined();
    expect(Array.isArray(suggestions)).toBe(true);
  });
});
