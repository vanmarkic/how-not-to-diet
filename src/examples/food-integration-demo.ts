/**
 * Food Data Integration Demo
 *
 * Demonstrates how extracted food data flows through the app:
 * 1. Load foods from JSON
 * 2. Build synergy relationships
 * 3. Convert to suggestion algorithm format
 * 4. Generate suggestions
 * 5. Display formatted results
 */

import { loadFoods, loadExtractedFoodData } from '../utils/dataLoader';
import {
  buildSynergyMap,
  convertToSuggestionFoods,
  filterFoods,
  formatFoodForDisplay,
  getCategoryDistribution,
  getTopSynergyPartners,
  calculateFoodSynergyScore,
} from '../utils/foodUtils';
import { getTopSuggestions } from '../utils/suggestions';

/**
 * Demo: Complete data flow from extraction to suggestions
 */
export async function demoCompleteDataFlow(): Promise<void> {
  console.log('='.repeat(80));
  console.log('FOOD DATA INTEGRATION DEMO');
  console.log('='.repeat(80));
  console.log();

  // Step 1: Load extracted food data
  console.log('Step 1: Loading extracted food data...');
  const foods = await loadFoods();
  console.log(`Loaded ${foods.length} foods from extracted-foods.json`);
  console.log();

  // Step 2: Display some loaded foods
  console.log('Step 2: Sample foods loaded:');
  foods.slice(0, 3).forEach(food => {
    console.log(`  - ${food.name} (${food.categories.join(', ')})`);
  });
  console.log();

  // Step 3: Build synergy relationships
  console.log('Step 3: Building synergy relationship map...');
  const synergies = buildSynergyMap(foods);
  console.log(`Built ${synergies.length} synergy relationships`);
  console.log('Sample synergies:');
  synergies.slice(0, 5).forEach(synergy => {
    const food1 = foods.find(f => f.id === synergy.foodId1);
    const food2 = foods.find(f => f.id === synergy.foodId2);
    console.log(`  - ${food1?.name} + ${food2?.name}: score ${synergy.score}`);
    if (synergy.reason) {
      console.log(`    Reason: ${synergy.reason}`);
    }
  });
  console.log();

  // Step 4: Convert to suggestion algorithm format
  console.log('Step 4: Converting to suggestion algorithm format...');
  const suggestionFoods = convertToSuggestionFoods(foods);
  console.log(`Converted ${suggestionFoods.length} foods for suggestion algorithm`);
  console.log('Sample converted food:');
  const sampleFood = suggestionFoods[0];
  console.log(`  ID: ${sampleFood.id}`);
  console.log(`  Name: ${sampleFood.name}`);
  console.log(`  Category: ${sampleFood.category}`);
  console.log(`  Allowed Meals: ${sampleFood.allowedMealTypes.join(', ')}`);
  console.log();

  // Step 5: Generate suggestions based on selected foods
  console.log('Step 5: Generating suggestions...');
  const selectedFoods = suggestionFoods.filter(f =>
    ['Kale', 'Beans (Legumes)'].includes(f.name)
  );
  console.log(`Selected foods: ${selectedFoods.map(f => f.name).join(', ')}`);

  const suggestions = getTopSuggestions(selectedFoods, suggestionFoods, synergies, {
    limit: 5,
  });

  console.log('\nTop 5 Suggestions:');
  suggestions.forEach((suggestion, index) => {
    console.log(`\n${index + 1}. ${suggestion.food.name}`);
    console.log(`   Score: ${suggestion.totalScore}`);
    console.log('   Synergies:');
    suggestion.synergyBreakdown.forEach(breakdown => {
      if (breakdown.score > 0) {
        console.log(`     + ${breakdown.selectedFood.name}: ${breakdown.score}`);
        if (breakdown.reason) {
          console.log(`       ${breakdown.reason}`);
        }
      }
    });
  });
  console.log();

  // Step 6: Format for display
  console.log('Step 6: Formatting food for display...');
  const kale = foods.find(f => f.name === 'Kale');
  if (kale) {
    const formatted = formatFoodForDisplay(kale);
    console.log(`Title: ${formatted.title}`);
    console.log(`Subtitle: ${formatted.subtitle}`);
    console.log(`Categories: ${formatted.categoryTags.join(', ')}`);
    console.log(`Timing: ${formatted.timingInfo}`);
    console.log(`Serving: ${formatted.servingInfo}`);
    console.log(`Key Properties:`);
    formatted.keyProperties.forEach(prop => console.log(`  - ${prop}`));
    console.log(`Synergy Partners: ${formatted.synergyPartners.join(', ')}`);
  }
  console.log();

  console.log('='.repeat(80));
}

/**
 * Demo: Food filtering and search
 */
export async function demoFilteringAndSearch(): Promise<void> {
  console.log('='.repeat(80));
  console.log('FOOD FILTERING AND SEARCH DEMO');
  console.log('='.repeat(80));
  console.log();

  const foods = await loadFoods();

  // Filter by category
  console.log('Filter by category: anti-inflammatory');
  const antiInflammatory = filterFoods(foods, {
    categories: ['anti-inflammatory'],
  });
  console.log(`Found ${antiInflammatory.length} foods:`);
  antiInflammatory.forEach(food => console.log(`  - ${food.name}`));
  console.log();

  // Filter by timing
  console.log('Filter by timing: breakfast');
  const breakfastFoods = filterFoods(foods, {
    timing: ['breakfast'],
  });
  console.log(`Found ${breakfastFoods.length} foods:`);
  breakfastFoods.forEach(food => console.log(`  - ${food.name}`));
  console.log();

  // Search by query
  console.log('Search: "fiber"');
  const fiberFoods = filterFoods(foods, {
    searchQuery: 'fiber',
  });
  console.log(`Found ${fiberFoods.length} foods:`);
  fiberFoods.forEach(food => console.log(`  - ${food.name}`));
  console.log();

  // Combined filters
  console.log('Combined: anti-inflammatory + breakfast');
  const combined = filterFoods(foods, {
    categories: ['anti-inflammatory'],
    timing: ['breakfast'],
  });
  console.log(`Found ${combined.length} foods:`);
  combined.forEach(food => console.log(`  - ${food.name}`));
  console.log();

  console.log('='.repeat(80));
}

/**
 * Demo: Statistical analysis
 */
export async function demoStatisticalAnalysis(): Promise<void> {
  console.log('='.repeat(80));
  console.log('STATISTICAL ANALYSIS DEMO');
  console.log('='.repeat(80));
  console.log();

  const foods = await loadFoods();

  // Category distribution
  console.log('Category Distribution:');
  const distribution = getCategoryDistribution(foods);
  Object.entries(distribution)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count} foods`);
    });
  console.log();

  // Top synergy partners
  console.log('Top 10 Most Common Synergy Partners:');
  const topPartners = getTopSynergyPartners(foods, 10);
  topPartners.forEach(([partner, count]) => {
    console.log(`  ${partner}: mentioned ${count} times`);
  });
  console.log();

  // Synergy score between specific foods
  console.log('Detailed Synergy Analysis:');
  const kale = foods.find(f => f.name === 'Kale');
  const beans = foods.find(f => f.name === 'Beans (Legumes)');

  if (kale && beans) {
    const synergyScore = calculateFoodSynergyScore(kale, beans, foods);
    console.log(`${synergyScore.food1} + ${synergyScore.food2}`);
    console.log(`Score: ${synergyScore.score}`);
    console.log('Reasons:');
    synergyScore.reasons.forEach(reason => console.log(`  - ${reason}`));
    if (synergyScore.categoryMatches.length > 0) {
      console.log(`Category matches: ${synergyScore.categoryMatches.join(', ')}`);
    }
  }
  console.log();

  console.log('='.repeat(80));
}

/**
 * Demo: Data transformation examples
 */
export async function demoDataTransformation(): Promise<void> {
  console.log('='.repeat(80));
  console.log('DATA TRANSFORMATION DEMO');
  console.log('='.repeat(80));
  console.log();

  // Load metadata
  const data = await loadExtractedFoodData();
  if (!data) {
    console.log('Error: Could not load extracted food data');
    return;
  }

  console.log('Extraction Metadata:');
  console.log(`  Date: ${data.extraction_metadata.extraction_date}`);
  console.log(`  Source: ${data.extraction_metadata.source_document}`);
  console.log('  Focus Areas:');
  data.extraction_metadata.focus_areas.forEach(area => {
    console.log(`    - ${area}`);
  });
  console.log();

  console.log('Extraction Index (foods with page references):');
  data.extraction_index.forEach(entry => {
    console.log(`  - ${entry.food}: pages ${entry.pages.join(', ')}`);
  });
  console.log();

  // Show transformation from raw to suggestion format
  console.log('Transformation Example:');
  const rawFood = data.foods[0];
  console.log('Raw Food Object:');
  console.log(`  ID: ${rawFood.id}`);
  console.log(`  Name: ${rawFood.name}`);
  console.log(`  Categories: ${rawFood.categories.join(', ')}`);
  console.log(`  Timing: ${rawFood.timing.join(', ')}`);
  console.log(`  Synergies: ${rawFood.synergies.join(', ')}`);
  console.log();

  const suggestionFoods = convertToSuggestionFoods([rawFood]);
  const transformed = suggestionFoods[0];
  console.log('Transformed for Suggestion Algorithm:');
  console.log(`  ID: ${transformed.id}`);
  console.log(`  Name: ${transformed.name}`);
  console.log(`  Category: ${transformed.category}`);
  console.log(`  Allowed Meal Types: ${transformed.allowedMealTypes.join(', ')}`);
  console.log();

  console.log('='.repeat(80));
}

/**
 * Run all demos
 */
export async function runAllDemos(): Promise<void> {
  try {
    await demoCompleteDataFlow();
    console.log('\n\n');

    await demoFilteringAndSearch();
    console.log('\n\n');

    await demoStatisticalAnalysis();
    console.log('\n\n');

    await demoDataTransformation();
  } catch (error) {
    console.error('Error running demos:', error);
  }
}

// Uncomment to run demos
// runAllDemos();
