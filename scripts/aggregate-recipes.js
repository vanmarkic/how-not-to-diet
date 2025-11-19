/**
 * Build-time aggregation script for recipe data
 *
 * This script reads individual recipe JSON files from data/recipes/
 * and combines them into a single bundle for production use.
 *
 * Usage:
 *   node scripts/aggregate-recipes.js
 *
 * Output:
 *   public/recipes-bundle.json
 */

import { glob } from 'glob';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);

async function aggregateRecipes() {
  try {
    console.log('🔄 Aggregating recipe data...');
    const startTime = Date.now();

    // Find all recipe files
    const recipeFiles = await glob(`${ROOT}/data/recipes/*.json`);

    if (recipeFiles.length === 0) {
      throw new Error('No recipe files found in data/recipes/');
    }

    console.log(`   Found ${recipeFiles.length} recipe files`);

    // Read and parse all recipe files
    const recipes = [];
    const errors = [];

    for (const filepath of recipeFiles) {
      try {
        const content = await readFile(filepath, 'utf-8');
        const recipe = JSON.parse(content);

        // Basic validation
        if (!recipe.id || !recipe.name) {
          errors.push(`${basename(filepath)}: Missing required field (id or name)`);
          continue;
        }

        recipes.push(recipe);
      } catch (err) {
        errors.push(`${basename(filepath)}: ${err.message}`);
      }
    }

    // Report validation errors
    if (errors.length > 0) {
      console.error('\n❌ Validation errors:');
      errors.forEach(err => console.error(`   - ${err}`));
      throw new Error(`Failed to parse ${errors.length} recipe file(s)`);
    }

    // Sort by ID for consistent output
    recipes.sort((a, b) => a.id.localeCompare(b.id));

    // Build meal type index
    const mealTypeSet = new Set();
    const difficultySet = new Set();
    const dailyDozenSet = new Set();
    const tweaksSet = new Set();

    recipes.forEach(recipe => {
      if (recipe.meal_type) mealTypeSet.add(recipe.meal_type);
      if (recipe.difficulty) difficultySet.add(recipe.difficulty);

      // Handle daily_dozen_coverage - could be array or string
      if (Array.isArray(recipe.daily_dozen_coverage)) {
        recipe.daily_dozen_coverage.forEach(item => dailyDozenSet.add(item));
      } else if (recipe.daily_dozen_coverage) {
        dailyDozenSet.add(recipe.daily_dozen_coverage);
      }

      // Handle tweaks_incorporated - could be array or string
      if (Array.isArray(recipe.tweaks_incorporated)) {
        recipe.tweaks_incorporated.forEach(tweak => tweaksSet.add(tweak));
      } else if (recipe.tweaks_incorporated) {
        tweaksSet.add(recipe.tweaks_incorporated);
      }
    });

    // Create bundle
    const bundle = {
      build_metadata: {
        build_timestamp: new Date().toISOString(),
        total_recipes: recipes.length,
        total_meal_types: mealTypeSet.size,
        total_difficulties: difficultySet.size,
        builder_version: '1.0.0'
      },
      meal_types: Array.from(mealTypeSet).sort(),
      difficulties: Array.from(difficultySet).sort(),
      daily_dozen_items: Array.from(dailyDozenSet).sort(),
      tweaks: Array.from(tweaksSet).sort(),
      recipes
    };

    // Ensure public directory exists
    await mkdir(`${ROOT}/public`, { recursive: true });

    // Write bundle with pretty formatting
    const outputPath = `${ROOT}/public/recipes-bundle.json`;
    await writeFile(outputPath, JSON.stringify(bundle, null, 2));

    const endTime = Date.now();
    const bundleSize = JSON.stringify(bundle).length;

    console.log(`✅ Successfully aggregated ${recipes.length} recipes`);
    console.log(`   Output: ${outputPath}`);
    console.log(`   Bundle size: ${(bundleSize / 1024).toFixed(2)} KB`);
    console.log(`   Build time: ${endTime - startTime}ms`);
    console.log(`   Meal types: ${Array.from(mealTypeSet).join(', ')}`);
    console.log(`   Difficulties: ${Array.from(difficultySet).join(', ')}`);

  } catch (err) {
    console.error('\n❌ Failed to aggregate recipes:', err.message);
    process.exit(1);
  }
}

// Run the aggregation
aggregateRecipes();
