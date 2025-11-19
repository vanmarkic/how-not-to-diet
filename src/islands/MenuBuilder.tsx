/**
 * MenuBuilder Island - Main Interactive Component
 *
 * Manages weekly menu state and food selection.
 * This is an Astro Island (React component with client-side interactivity).
 */

import { useState, useEffect, useMemo } from 'react';
import type {
  Food,
  MealType,
  RankedSuggestion,
} from '../utils/menuSynergyEngine';
import {
  loadFoodsBundle,
  buildSynergyMap,
  calculateSuggestions,
} from '../utils/menuSynergyEngine';
import type { WeeklyMenu } from '../utils/menuStorage';
import {
  createEmptyMenu,
  autoSaveMenu,
  restoreMenu,
  snapshotMenu,
  getMenuLibrary,
  loadSnapshot,
} from '../utils/menuStorage';
import { downloadBackup } from '../utils/backupExport';
import { shareMenu } from '../utils/emailExport';

// ============================================================================
// Types
// ============================================================================

type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

interface ActiveMeal {
  day: DayOfWeek;
  mealType: MealType;
}

// ============================================================================
// Main Component
// ============================================================================

export default function MenuBuilder() {
  // ============================================================================
  // State
  // ============================================================================

  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState<WeeklyMenu>(createEmptyMenu());
  const [activeMeal, setActiveMeal] = useState<ActiveMeal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // ============================================================================
  // Load Foods on Mount
  // ============================================================================

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Load foods bundle
        const loadedFoods = await loadFoodsBundle();
        console.log('[MenuBuilder] Loaded foods:', loadedFoods.length);
        setFoods(loadedFoods);

        // Restore menu from localStorage
        const restoredMenu = restoreMenu();
        if (restoredMenu) {
          setMenu(restoredMenu);
        }

        setLoading(false);
      } catch (error) {
        console.error('[MenuBuilder] Failed to load data:', error);
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ============================================================================
  // Synergy Calculation
  // ============================================================================

  const synergyMap = useMemo(() => {
    if (foods.length === 0) return new Map();
    return buildSynergyMap(foods);
  }, [foods]);

  const suggestions = useMemo(() => {
    if (!activeMeal || foods.length === 0) {
      console.log('[MenuBuilder] No suggestions:', { activeMeal, foodsCount: foods.length });
      return [];
    }

    const selectedFoodIds = menu.meals[activeMeal.day][activeMeal.mealType];
    const result = calculateSuggestions(
      selectedFoodIds,
      activeMeal.mealType,
      foods,
      synergyMap
    );
    console.log('[MenuBuilder] Calculated suggestions:', {
      mealType: activeMeal.mealType,
      selectedCount: selectedFoodIds.length,
      suggestionsCount: result.length
    });
    return result;
  }, [activeMeal, menu, foods, synergyMap]);

  // ============================================================================
  // Filter Suggestions by Search
  // ============================================================================

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return suggestions;

    const query = searchQuery.toLowerCase();
    return suggestions.filter((suggestion) =>
      suggestion.food.name.toLowerCase().includes(query)
    );
  }, [suggestions, searchQuery]);

  // ============================================================================
  // Menu Manipulation
  // ============================================================================

  const addFoodToMeal = (day: DayOfWeek, mealType: MealType, foodId: string) => {
    setMenu((prev) => {
      const newMenu = { ...prev };
      const mealFoods = [...newMenu.meals[day][mealType]];

      // Prevent duplicates
      if (mealFoods.includes(foodId)) {
        return prev;
      }

      mealFoods.push(foodId);
      newMenu.meals[day][mealType] = mealFoods;

      // Auto-save
      autoSaveMenu(newMenu);

      return newMenu;
    });
  };

  const removeFoodFromMeal = (
    day: DayOfWeek,
    mealType: MealType,
    foodId: string
  ) => {
    setMenu((prev) => {
      const newMenu = { ...prev };
      const mealFoods = newMenu.meals[day][mealType].filter((id) => id !== foodId);
      newMenu.meals[day][mealType] = mealFoods;

      // Auto-save
      autoSaveMenu(newMenu);

      return newMenu;
    });
  };

  const setActiveMealSlot = (day: DayOfWeek, mealType: MealType) => {
    setActiveMeal({ day, mealType });
    setSearchQuery(''); // Reset search when switching meals
  };

  const clearActiveMeal = () => {
    setActiveMeal(null);
    setSearchQuery('');
  };

  // ============================================================================
  // Menu Library Operations
  // ============================================================================

  const saveSnapshot = () => {
    const name = prompt('Enter a name for this menu snapshot:');
    if (!name) return;

    // TODO: Calculate total synergy score
    const totalSynergyScore = 0;

    snapshotMenu(menu, name, totalSynergyScore);
    alert(`Menu snapshot "${name}" saved!`);
  };

  const loadSnapshotMenu = () => {
    const library = getMenuLibrary();

    if (library.length === 0) {
      alert('No saved snapshots found.');
      return;
    }

    const snapshotNames = library.map((s) => s.name).join('\n');
    const name = prompt(`Select a snapshot to load:\n\n${snapshotNames}`);

    if (!name) return;

    const loaded = loadSnapshot(name);
    if (loaded) {
      setMenu(loaded);
      alert(`Loaded snapshot "${name}"`);
    } else {
      alert(`Snapshot "${name}" not found.`);
    }
  };

  // ============================================================================
  // Export Operations
  // ============================================================================

  const handleDownloadBackup = () => {
    try {
      downloadBackup();
      alert('Backup downloaded successfully!');
    } catch (error) {
      alert('Failed to download backup. Please try again.');
    }
  };

  const handleEmailExport = async () => {
    try {
      await shareMenu(menu, foods);
    } catch (error) {
      console.error('Failed to export menu:', error);
      alert('Failed to export menu. Please try again.');
    }
  };

  // ============================================================================
  // Rendering Helpers
  // ============================================================================

  const getFoodById = (id: string): Food | undefined => {
    return foods.find((f) => f.id === id);
  };

  // ============================================================================
  // Render
  // ============================================================================

  if (loading) {
    return (
      <div className="menu-builder-loading">
        <p>Loading foods database...</p>
      </div>
    );
  }

  return (
    <div className="menu-builder">
      {/* Header with Actions */}
      <div className="menu-builder-header">
        <h1>Weekly Menu Planner</h1>
        <div className="menu-actions">
          <button onClick={saveSnapshot} className="btn-secondary">
            📸 Snapshot Menu
          </button>
          <button onClick={loadSnapshotMenu} className="btn-secondary">
            📂 Load Snapshot
          </button>
          <button onClick={handleDownloadBackup} className="btn-secondary">
            💾 Download Backup
          </button>
          <button onClick={handleEmailExport} className="btn-primary">
            📧 Email Shopping List
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="menu-builder-grid">
        {/* Weekly Grid */}
        <div className="weekly-grid">
          <WeeklyGrid
            menu={menu}
            activeMeal={activeMeal}
            foods={foods}
            onMealClick={setActiveMealSlot}
            onRemoveFood={removeFoodFromMeal}
          />
        </div>

        {/* Suggestion Panel (Sidebar) */}
        {activeMeal && (
          <div className="suggestion-panel">
            <div className="suggestion-panel-header">
              <h3>
                Suggestions for {activeMeal.day} {activeMeal.mealType}
              </h3>
              <button onClick={clearActiveMeal} className="btn-close">
                ✕
              </button>
            </div>

            <div className="suggestion-panel-search">
              <input
                type="text"
                placeholder="Search foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="suggestion-panel-list">
              {filteredSuggestions.length === 0 && (
                <p className="no-suggestions">No suggestions found.</p>
              )}

              {filteredSuggestions.slice(0, 20).map((suggestion) => (
                <SuggestionItem
                  key={suggestion.food.id}
                  suggestion={suggestion}
                  onAdd={() =>
                    addFoodToMeal(
                      activeMeal.day,
                      activeMeal.mealType,
                      suggestion.food.id
                    )
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Sub-Components
// ============================================================================

function WeeklyGrid({
  menu,
  activeMeal,
  foods,
  onMealClick,
  onRemoveFood,
}: {
  menu: WeeklyMenu;
  activeMeal: ActiveMeal | null;
  foods: Food[];
  onMealClick: (day: DayOfWeek, mealType: MealType) => void;
  onRemoveFood: (day: DayOfWeek, mealType: MealType, foodId: string) => void;
}) {
  const days: DayOfWeek[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner'];

  const getFoodById = (id: string): Food | undefined => {
    return foods.find((f) => f.id === id);
  };

  return (
    <table className="weekly-grid-table">
      <thead>
        <tr>
          <th></th>
          {days.map((day) => (
            <th key={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {mealTypes.map((mealType) => (
          <tr key={mealType}>
            <th>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</th>
            {days.map((day) => {
              const isActive =
                activeMeal?.day === day && activeMeal?.mealType === mealType;
              const foodIds = menu.meals[day][mealType];

              return (
                <td
                  key={`${day}-${mealType}`}
                  data-testid={`meal-cell-${day}-${mealType}`}
                  className={`meal-cell ${isActive ? 'active' : ''} ${
                    foodIds.length > 0 ? 'filled' : 'empty'
                  }`}
                  onClick={() => onMealClick(day, mealType)}
                >
                  {foodIds.length === 0 ? (
                    <div className="meal-cell-empty">Click to add</div>
                  ) : (
                    <div className="meal-cell-foods">
                      {foodIds.map((foodId) => {
                        const food = getFoodById(foodId);
                        return (
                          <div key={foodId} className="food-chip">
                            <span>{food?.name || 'Unknown'}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFood(day, mealType, foodId);
                              }}
                              className="food-chip-remove"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SuggestionItem({
  suggestion,
  onAdd,
}: {
  suggestion: RankedSuggestion;
  onAdd: () => void;
}) {
  const getCategoryBadge = () => {
    switch (suggestion.category) {
      case 'excellent':
        return <span className="badge badge-excellent">⭐ Excellent</span>;
      case 'good':
        return <span className="badge badge-good">✓ Good</span>;
      default:
        return null;
    }
  };

  return (
    <div className="suggestion-item">
      <div className="suggestion-item-header">
        <span className="suggestion-item-name">{suggestion.food.name}</span>
        {getCategoryBadge()}
        {suggestion.synergyScore > 0 && (
          <span className="suggestion-item-score">+{suggestion.synergyScore}</span>
        )}
      </div>

      {suggestion.breakdown.length > 0 && (
        <div className="suggestion-item-breakdown">
          {suggestion.breakdown.slice(0, 2).map((item, index) => (
            <div key={index} className="breakdown-item">
              +{item.score} with {item.withFood}
            </div>
          ))}
        </div>
      )}

      <button onClick={onAdd} className="suggestion-item-add">
        + Add
      </button>
    </div>
  );
}
