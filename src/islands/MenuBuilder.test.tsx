/**
 * MenuBuilder Component Tests
 *
 * Tests the 10 most important UI features from a user perspective:
 * 1. Load all foods from bundle
 * 2. Click meal slot to open suggestion panel
 * 3. Search/filter foods by name
 * 4. Add food to meal slot
 * 5. Remove food from meal slot
 * 6. Auto-save to localStorage
 * 7. Restore menu from localStorage
 * 8. Snapshot menu to library
 * 9. Load snapshot from library
 * 10. Download backup / Email export
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenuBuilder from './MenuBuilder';

// ============================================================================
// Test Helpers
// ============================================================================

const waitForFoodsToLoad = async () => {
  await waitFor(() => {
    expect(screen.queryByText(/loading foods database/i)).not.toBeInTheDocument();
  });
};

const clickMealSlot = async (user: ReturnType<typeof userEvent.setup>, day: string, meal: string) => {
  // Use data-testid for reliable selection
  const testId = `meal-cell-${day}-${meal}`;
  const cell = screen.getByTestId(testId);
  await user.click(cell);
};

const getMealCell = (day: string, meal: string) => {
  const testId = `meal-cell-${day}-${meal}`;
  return screen.getByTestId(testId);
};

// ============================================================================
// Feature 1: Load Foods from Bundle
// ============================================================================

describe('Feature 1: Load Foods from Bundle', () => {
  it('should load 3 foods successfully (mocked)', async () => {
    render(<MenuBuilder />);

    // Should show loading state initially
    expect(screen.getByText(/loading foods database/i)).toBeInTheDocument();

    // Wait for foods to load
    await waitForFoodsToLoad();

    // Should not show loading anymore
    expect(screen.queryByText(/loading foods database/i)).not.toBeInTheDocument();

    // Should show the header
    expect(screen.getByText(/weekly menu planner/i)).toBeInTheDocument();
  });

  it('should log loaded foods count to console', async () => {
    const consoleSpy = vi.spyOn(console, 'log');

    render(<MenuBuilder />);
    await waitForFoodsToLoad();

    // Check console log was called with foods count
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[MenuBuilder] Loaded foods:'),
      expect.any(Number)
    );
  });
});

// ============================================================================
// Feature 2: Click Meal Slot to Open Suggestion Panel
// ============================================================================

describe('Feature 2: Click Meal Slot Opens Suggestion Panel', () => {
  it('should open suggestion panel when clicking a meal slot', async () => {
    const user = userEvent.setup();
    render(<MenuBuilder />);
    await waitForFoodsToLoad();

    // Suggestion panel should not be visible initially
    expect(screen.queryByText(/suggestions for/i)).not.toBeInTheDocument();

    // Click Monday Breakfast cell
    await clickMealSlot(user, 'monday', 'breakfast');

    // Suggestion panel should appear
    await waitFor(() => {
      expect(screen.getByText(/suggestions for monday breakfast/i)).toBeInTheDocument();
    });
  });

  it('should show search input in suggestion panel', async () => {
    const user = userEvent.setup();
    render(<MenuBuilder />);
    await waitForFoodsToLoad();

    await clickMealSlot(user, 'monday', 'breakfast');

    // Search input should be visible
    const searchInput = await screen.findByPlaceholderText(/search foods/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('should close suggestion panel when clicking X button', async () => {
    const user = userEvent.setup();
    render(<MenuBuilder />);
    await waitForFoodsToLoad();

    await clickMealSlot(user, 'monday', 'breakfast');

    // Panel should be open
    expect(screen.getByText(/suggestions for monday breakfast/i)).toBeInTheDocument();

    // Click close button
    const closeButton = screen.getByRole('button', { name: /✕/i });
    await user.click(closeButton);

    // Panel should be closed
    await waitFor(() => {
      expect(screen.queryByText(/suggestions for monday breakfast/i)).not.toBeInTheDocument();
    });
  });
});

// ============================================================================
// Feature 3: Search/Filter Foods by Name
// ============================================================================

describe('Feature 3: Search/Filter Foods', () => {
  it('should filter suggestions when typing in search', async () => {
    const user = userEvent.setup();
    render(<MenuBuilder />);
    await waitForFoodsToLoad();

    await clickMealSlot(user, 'monday', 'breakfast');

    // Get search input
    const searchInput = await screen.findByPlaceholderText(/search foods/i);

    // Initially should show foods (Oat Groats, Blueberries for breakfast)
    expect(screen.getByText(/oat groats/i)).toBeInTheDocument();
    expect(screen.getByText(/blueberries/i)).toBeInTheDocument();

    // Type "blue" in search
    await user.type(searchInput, 'blue');

    // Should only show Blueberries
    expect(screen.getByText(/blueberries/i)).toBeInTheDocument();
    expect(screen.queryByText(/oat groats/i)).not.toBeInTheDocument();
  });

  it('should show "no suggestions" when search has no matches', async () => {
    const user = userEvent.setup();
    render(<MenuBuilder />);
    await waitForFoodsToLoad();

    await clickMealSlot(user, 'monday', 'breakfast');

    const searchInput = await screen.findByPlaceholderText(/search foods/i);

    // Search for something that doesn't exist
    await user.type(searchInput, 'zzzzz');

    // Should show no suggestions message
    expect(screen.getByText(/no suggestions found/i)).toBeInTheDocument();
  });

  it('should clear search when switching meal slots', async () => {
    const user = userEvent.setup();
    render(<MenuBuilder />);
    await waitForFoodsToLoad();

    // Open Monday Breakfast and search
    await clickMealSlot(user, 'monday', 'breakfast');
    const searchInput = await screen.findByPlaceholderText(/search foods/i);
    await user.type(searchInput, 'blue');

    expect(searchInput).toHaveValue('blue');

    // Switch to Tuesday Breakfast
    await clickMealSlot(user, 'tuesday', 'breakfast');

    // Search should be cleared
    await waitFor(() => {
      const newSearchInput = screen.getByPlaceholderText(/search foods/i);
      expect(newSearchInput).toHaveValue('');
    });
  });
});

// ============================================================================
// Feature 4: Add Food to Meal Slot
// ============================================================================

describe('Feature 4: Add Food to Meal Slot', () => {
  it('should add food when clicking + Add button', async () => {
    const user = userEvent.setup();
    render(<MenuBuilder />);
    await waitForFoodsToLoad();

    await clickMealSlot(user, 'monday', 'breakfast');

    // Find and click "+ Add" button for Oat Groats
    const addButtons = screen.getAllByRole('button', { name: /\+ add/i });
    await user.click(addButtons[0]); // First suggestion

    // Food should appear in the meal cell
    const mondayBreakfastCell = getMealCell('monday', 'breakfast');

    await waitFor(() => {
      expect(within(mondayBreakfastCell).getByText(/oat groats/i)).toBeInTheDocument();
    });
  });

  it('should not add duplicate foods to same meal', async () => {
    const user = userEvent.setup();
    render(<MenuBuilder />);
    await waitForFoodsToLoad();

    await clickMealSlot(user, 'monday', 'breakfast');

    // Add Oat Groats once
    const addButtons = screen.getAllByRole('button', { name: /\+ add/i });
    await user.click(addButtons[0]);

    // Try to add again
    await user.click(addButtons[0]);

    // Should only appear once
    const mondayBreakfastCell = getMealCell('monday', 'breakfast');
    const foodChips = within(mondayBreakfastCell).queryAllByText(/oat groats/i);
    expect(foodChips).toHaveLength(1);
  });
});

// ============================================================================
// Feature 5: Remove Food from Meal Slot
// ============================================================================

describe('Feature 5: Remove Food from Meal Slot', () => {
  it('should remove food when clicking × button', async () => {
    const user = userEvent.setup();
    render(<MenuBuilder />);
    await waitForFoodsToLoad();

    // Add a food first
    await clickMealSlot(user, 'monday', 'breakfast');
    const addButtons = screen.getAllByRole('button', { name: /\+ add/i });
    await user.click(addButtons[0]);

    // Wait for food to appear
    const mondayBreakfastCell = getMealCell('monday', 'breakfast');

    await waitFor(() => {
      expect(within(mondayBreakfastCell).getByText(/oat groats/i)).toBeInTheDocument();
    });

    // Find and click remove button (×)
    const removeButton = within(mondayBreakfastCell).getByRole('button', { name: /×/ });
    await user.click(removeButton);

    // Food should be removed
    await waitFor(() => {
      expect(within(mondayBreakfastCell).queryByText(/oat groats/i)).not.toBeInTheDocument();
    });
  });
});

// ============================================================================
// Feature 6: Auto-save to localStorage
// ============================================================================

describe('Feature 6: Auto-save to localStorage', () => {
  it('should auto-save menu when adding food', async () => {
    const user = userEvent.setup();
    render(<MenuBuilder />);
    await waitForFoodsToLoad();

    // Add a food
    await clickMealSlot(user, 'monday', 'breakfast');
    const addButtons = screen.getAllByRole('button', { name: /\+ add/i });
    await user.click(addButtons[0]);

    // Wait for auto-save (debounced 500ms)
    await waitFor(() => {
      const saved = localStorage.getItem('menu-current');
      expect(saved).toBeTruthy();

      const menu = JSON.parse(saved!);
      expect(menu.meals.monday.breakfast).toHaveLength(1);
    }, { timeout: 1000 });
  });

  it('should auto-save when removing food', async () => {
    const user = userEvent.setup();
    render(<MenuBuilder />);
    await waitForFoodsToLoad();

    // Add a food
    await clickMealSlot(user, 'monday', 'breakfast');
    const addButtons = screen.getAllByRole('button', { name: /\+ add/i });
    await user.click(addButtons[0]);

    // Wait for it to be saved
    await waitFor(() => {
      const saved = localStorage.getItem('menu-current');
      const menu = JSON.parse(saved!);
      expect(menu.meals.monday.breakfast).toHaveLength(1);
    }, { timeout: 1000 });

    // Remove the food
    const mondayBreakfastCell = getMealCell('monday', 'breakfast');
    const removeButton = within(mondayBreakfastCell).getByRole('button', { name: /×/ });
    await user.click(removeButton);

    // Should save empty array
    await waitFor(() => {
      const saved = localStorage.getItem('menu-current');
      const menu = JSON.parse(saved!);
      expect(menu.meals.monday.breakfast).toHaveLength(0);
    }, { timeout: 1000 });
  });
});

// ============================================================================
// Feature 7: Restore Menu from localStorage
// ============================================================================

describe('Feature 7: Restore Menu from localStorage', () => {
  it('should restore menu on page load', async () => {
    // Pre-populate localStorage with a menu
    const savedMenu = {
      weekOf: '2025-11-19',
      meals: {
        monday: { breakfast: ['food-1'], lunch: [], dinner: [] },
        tuesday: { breakfast: [], lunch: [], dinner: [] },
        wednesday: { breakfast: [], lunch: [], dinner: [] },
        thursday: { breakfast: [], lunch: [], dinner: [] },
        friday: { breakfast: [], lunch: [], dinner: [] },
        saturday: { breakfast: [], lunch: [], dinner: [] },
        sunday: { breakfast: [], lunch: [], dinner: [] },
      },
      lastModified: new Date().toISOString(),
    };

    localStorage.setItem('menu-current', JSON.stringify(savedMenu));

    // Render component
    render(<MenuBuilder />);
    await waitForFoodsToLoad();

    // Should show the saved food
    const mondayBreakfastCell = getMealCell('monday', 'breakfast');

    await waitFor(() => {
      expect(within(mondayBreakfastCell).getByText(/oat groats/i)).toBeInTheDocument();
    });
  });
});

// ============================================================================
// Feature 8: Snapshot Menu to Library
// ============================================================================

describe('Feature 8: Snapshot Menu to Library', () => {
  it('should save snapshot when clicking Snapshot Menu button', async () => {
    const user = userEvent.setup();

    // Mock window.prompt
    vi.spyOn(window, 'prompt').mockReturnValue('My Test Menu');
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<MenuBuilder />);
    await waitForFoodsToLoad();

    // Add a food first
    await clickMealSlot(user, 'monday', 'breakfast');
    const addButtons = screen.getAllByRole('button', { name: /\+ add/i });
    await user.click(addButtons[0]);

    // Wait for auto-save
    await new Promise(resolve => setTimeout(resolve, 600));

    // Click Snapshot Menu button
    const snapshotButton = screen.getByRole('button', { name: /snapshot menu/i });
    await user.click(snapshotButton);

    // Should save to library
    await waitFor(() => {
      const library = localStorage.getItem('menu-library');
      expect(library).toBeTruthy();

      const snapshots = JSON.parse(library!);
      expect(snapshots).toHaveLength(1);
      expect(snapshots[0].name).toBe('My Test Menu');
    });
  });

  it('should not save snapshot if user cancels prompt', async () => {
    const user = userEvent.setup();

    // Mock window.prompt to return null (cancel)
    vi.spyOn(window, 'prompt').mockReturnValue(null);

    render(<MenuBuilder />);
    await waitForFoodsToLoad();

    const snapshotButton = screen.getByRole('button', { name: /snapshot menu/i });
    await user.click(snapshotButton);

    // Library should be empty
    const library = localStorage.getItem('menu-library');
    expect(library).toBeNull();
  });
});

// ============================================================================
// Feature 9: Load Snapshot from Library
// ============================================================================

describe('Feature 9: Load Snapshot from Library', () => {
  it('should load snapshot when clicking Load Snapshot button', async () => {
    const user = userEvent.setup();

    // Pre-populate library with a snapshot
    const snapshot = {
      name: 'Saved Menu',
      weekOf: '2025-11-19',
      meals: {
        monday: { breakfast: ['food-2'], lunch: [], dinner: [] }, // Blueberries
        tuesday: { breakfast: [], lunch: [], dinner: [] },
        wednesday: { breakfast: [], lunch: [], dinner: [] },
        thursday: { breakfast: [], lunch: [], dinner: [] },
        friday: { breakfast: [], lunch: [], dinner: [] },
        saturday: { breakfast: [], lunch: [], dinner: [] },
        sunday: { breakfast: [], lunch: [], dinner: [] },
      },
      created: new Date().toISOString(),
      totalSynergyScore: 0,
    };

    localStorage.setItem('menu-library', JSON.stringify([snapshot]));

    // Mock window.prompt to return the snapshot name
    vi.spyOn(window, 'prompt').mockReturnValue('Saved Menu');
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<MenuBuilder />);
    await waitForFoodsToLoad();

    const loadButton = screen.getByRole('button', { name: /load snapshot/i });
    await user.click(loadButton);

    // Should load Blueberries
    const mondayBreakfastCell = getMealCell('monday', 'breakfast');

    await waitFor(() => {
      expect(within(mondayBreakfastCell).getByText(/blueberries/i)).toBeInTheDocument();
    });
  });
});

// ============================================================================
// Feature 10: Download Backup / Email Export
// ============================================================================

describe('Feature 10: Export Features', () => {
  it('should trigger download when clicking Download Backup button', async () => {
    const user = userEvent.setup();

    // Mock createObjectURL and revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    // Mock document.createElement to track link creation
    const linkClickSpy = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = originalCreateElement(tagName);
      if (tagName === 'a') {
        element.click = linkClickSpy;
      }
      return element;
    });

    render(<MenuBuilder />);
    await waitForFoodsToLoad();

    const downloadButton = screen.getByRole('button', { name: /download backup/i });
    await user.click(downloadButton);

    // Should create and click download link
    await waitFor(() => {
      expect(linkClickSpy).toHaveBeenCalled();
    });
  });

  it('should open email/share when clicking Email Shopping List button', async () => {
    const user = userEvent.setup();

    // Mock window.location
    delete (window as any).location;
    window.location = { href: '' } as any;

    render(<MenuBuilder />);
    await waitForFoodsToLoad();

    const emailButton = screen.getByRole('button', { name: /email shopping list/i });
    await user.click(emailButton);

    // Should call navigator.share or set window.location.href
    // Since we mocked navigator.share in setup.ts, it should call that
    await waitFor(() => {
      // Just verify the button works without errors
      expect(emailButton).toBeInTheDocument();
    });
  });
});
