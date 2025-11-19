/**
 * Test setup file
 * Runs before each test suite
 */

import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

// Mock navigator.share (Web Share API)
Object.defineProperty(navigator, 'share', {
  writable: true,
  value: async () => Promise.resolve(),
});

// Mock fetch globally
global.fetch = async (url: string | URL | Request) => {
  const urlString = typeof url === 'string' ? url : url.toString();

  if (urlString.includes('foods-bundle.json')) {
    // Return mock foods data
    return Promise.resolve({
      ok: true,
      json: async () => ({
        foods: [
          {
            id: 'food-1',
            name: 'Oat Groats (Whole Intact Oats)',
            categories: ['rich-in-whole-grains', 'high-fiber'],
            properties: ['Whole grain'],
            benefits: 'Great for breakfast',
            synergies: ['berries', 'flaxseeds'],
            conflicts: [],
            timing: ['breakfast', 'any-meal'],
            amount: '1 cup',
            sources: { pages: [17], quotes: ['Quote'] },
          },
          {
            id: 'food-2',
            name: 'Blueberries',
            categories: ['rich-in-fruits', 'berries'],
            properties: ['Antioxidant-rich'],
            benefits: 'Brain health',
            synergies: ['oats', 'flaxseeds'],
            conflicts: [],
            timing: ['breakfast', 'any-meal'],
            amount: '1/2 cup',
            sources: { pages: [15], quotes: ['Quote'] },
          },
          {
            id: 'food-3',
            name: 'Kale',
            categories: ['greens', 'cruciferous'],
            properties: ['Nutrient-dense'],
            benefits: 'Anti-inflammatory',
            synergies: ['beans', 'vinegar'],
            conflicts: [],
            timing: ['lunch', 'dinner', 'any-meal'],
            amount: '2 cups',
            sources: { pages: [13], quotes: ['Quote'] },
          },
        ],
      }),
    } as Response);
  }

  return Promise.reject(new Error('Not found'));
};
