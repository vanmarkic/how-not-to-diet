/**
 * Planner Page Integration Tests
 *
 * Tests that the planner.astro page correctly integrates with the MenuBuilder React island
 */

import { describe, it, expect } from 'vitest';
import { loadFoodsBundle } from '@utils/menuSynergyEngine';
import {
  createEmptyMenu,
  autoSaveMenu,
  restoreMenu,
  snapshotMenu,
  getMenuLibrary,
  loadSnapshot,
} from '@utils/menuStorage';

describe('Planner Page - Menu Storage Integration', () => {
  it('should create an empty menu with correct structure', () => {
    const menu = createEmptyMenu();

    expect(menu).toBeDefined();
    expect(menu).toHaveProperty('weekOf');
    expect(menu).toHaveProperty('meals');
    expect(menu).toHaveProperty('lastModified');

    // Check all days are present
    const days = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ] as const;

    days.forEach((day) => {
      expect(menu.meals[day]).toBeDefined();
      expect(menu.meals[day]).toHaveProperty('breakfast');
      expect(menu.meals[day]).toHaveProperty('lunch');
      expect(menu.meals[day]).toHaveProperty('dinner');
      expect(Array.isArray(menu.meals[day].breakfast)).toBe(true);
      expect(Array.isArray(menu.meals[day].lunch)).toBe(true);
      expect(Array.isArray(menu.meals[day].dinner)).toBe(true);
    });
  });

  it('should auto-save menu to localStorage', async () => {
    const menu = createEmptyMenu();
    menu.meals.monday.breakfast = ['food-1', 'food-2'];

    autoSaveMenu(menu);

    // Wait for auto-save debounce (500ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    const saved = localStorage.getItem('menu-current');
    expect(saved).toBeTruthy();

    const parsed = JSON.parse(saved!);
    expect(parsed.meals.monday.breakfast).toEqual(['food-1', 'food-2']);
  });

  it('should restore menu from localStorage', async () => {
    const menu = createEmptyMenu();
    menu.meals.tuesday.lunch = ['food-3', 'food-4'];

    autoSaveMenu(menu);

    // Wait for auto-save debounce (500ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    const restored = restoreMenu();
    expect(restored).toBeTruthy();
    expect(restored?.meals.tuesday.lunch).toEqual(['food-3', 'food-4']);
  });

  it('should return null when no saved menu exists', () => {
    localStorage.removeItem('menu-current');

    const restored = restoreMenu();
    expect(restored).toBeNull();
  });
});

describe('Planner Page - Menu Library Integration', () => {
  it('should save menu snapshot to library', () => {
    const menu = createEmptyMenu();
    menu.meals.monday.breakfast = ['food-1'];

    snapshotMenu(menu, 'Test Snapshot', 100);

    const library = getMenuLibrary();
    expect(library.length).toBeGreaterThan(0);

    const snapshot = library.find((s) => s.name === 'Test Snapshot');
    expect(snapshot).toBeDefined();
    expect(snapshot?.totalSynergyScore).toBe(100);
  });

  it('should load snapshot from library', () => {
    const menu = createEmptyMenu();
    menu.meals.wednesday.dinner = ['food-5', 'food-6'];

    snapshotMenu(menu, 'Another Snapshot', 150);

    const loaded = loadSnapshot('Another Snapshot');
    expect(loaded).toBeDefined();
    expect(loaded?.meals.wednesday.dinner).toEqual(['food-5', 'food-6']);
  });

  it('should return null when loading non-existent snapshot', () => {
    const loaded = loadSnapshot('Non Existent Snapshot');
    expect(loaded).toBeNull();
  });

  it('should maintain multiple snapshots in library', () => {
    const menu1 = createEmptyMenu();
    menu1.meals.monday.breakfast = ['food-1'];

    const menu2 = createEmptyMenu();
    menu2.meals.tuesday.lunch = ['food-2'];

    snapshotMenu(menu1, 'Snapshot 1', 50);
    snapshotMenu(menu2, 'Snapshot 2', 75);

    const library = getMenuLibrary();
    expect(library.length).toBeGreaterThanOrEqual(2);

    const snapshot1 = library.find((s) => s.name === 'Snapshot 1');
    const snapshot2 = library.find((s) => s.name === 'Snapshot 2');

    expect(snapshot1).toBeDefined();
    expect(snapshot2).toBeDefined();
  });
});

describe('Planner Page - Foods Bundle Loading', () => {
  it('should load foods bundle for suggestions', async () => {
    const foods = await loadFoodsBundle();

    expect(foods).toBeDefined();
    expect(Array.isArray(foods)).toBe(true);
    expect(foods.length).toBeGreaterThan(0);

    // Check food structure
    if (foods.length > 0) {
      const food = foods[0];
      expect(food).toHaveProperty('id');
      expect(food).toHaveProperty('name');
      expect(food).toHaveProperty('categories');
      expect(food).toHaveProperty('timing');
    }
  });

  it('should load foods with synergy information', async () => {
    const foods = await loadFoodsBundle();

    // At least some foods should have synergies
    const foodsWithSynergies = foods.filter((f) => f.synergies.length > 0);
    expect(foodsWithSynergies.length).toBeGreaterThan(0);
  });
});

describe('Planner Page - Week Of Date', () => {
  it('should generate current week date in menu', () => {
    const menu = createEmptyMenu();

    // Week of should be a valid date string
    expect(menu.weekOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    // Should be parseable as a date
    const date = new Date(menu.weekOf);
    expect(date.toString()).not.toBe('Invalid Date');
  });

  it('should set lastModified timestamp', () => {
    const menu = createEmptyMenu();

    expect(menu.lastModified).toBeDefined();
    const timestamp = new Date(menu.lastModified);
    expect(timestamp.toString()).not.toBe('Invalid Date');

    // Should be recent (within last minute)
    const now = Date.now();
    const diff = now - timestamp.getTime();
    expect(diff).toBeLessThan(60000); // Less than 1 minute
  });

  it('should update lastModified when auto-saving', async () => {
    const menu = createEmptyMenu();
    const originalTimestamp = menu.lastModified;

    // Wait a bit to ensure timestamp is different
    await new Promise((resolve) => setTimeout(resolve, 10));

    menu.meals.monday.breakfast = ['food-1'];
    autoSaveMenu(menu);

    // Wait for auto-save debounce (500ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    const restored = restoreMenu();
    expect(restored).toBeTruthy();
    expect(restored!.lastModified).not.toBe(originalTimestamp);
  });
});

describe('Planner Page - Error Handling', () => {
  it('should handle corrupted localStorage data gracefully', () => {
    localStorage.setItem('menu-current', 'invalid json {{{');

    const restored = restoreMenu();
    expect(restored).toBeNull();
  });

  it('should handle missing menu-library gracefully', () => {
    localStorage.removeItem('menu-library');

    const library = getMenuLibrary();
    expect(library).toEqual([]);
  });

  it('should handle corrupted menu-library data', () => {
    localStorage.setItem('menu-library', 'not valid json');

    const library = getMenuLibrary();
    expect(library).toEqual([]);
  });
});
