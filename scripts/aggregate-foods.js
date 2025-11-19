/**
 * Build-time aggregation script for food data
 *
 * This script reads individual food JSON files from data/foods/
 * and combines them into a single bundle for production use.
 *
 * Usage:
 *   node scripts/aggregate-foods.js
 *
 * Output:
 *   dist/foods-bundle.json
 */

import { glob } from 'glob';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);

async function aggregateFoods() {
  try {
    console.log('🔄 Aggregating food data...');
    const startTime = Date.now();

    // Read metadata from index file
    const indexPath = `${ROOT}/data/index.json`;
    let index;

    try {
      const indexContent = await readFile(indexPath, 'utf-8');
      index = JSON.parse(indexContent);
    } catch (err) {
      console.error(`❌ Error reading index file: ${indexPath}`);
      throw err;
    }

    // Find all food files
    const foodFiles = await glob(`${ROOT}/data/foods/*.json`);

    if (foodFiles.length === 0) {
      throw new Error('No food files found in data/foods/. Have you created any food files yet?');
    }

    console.log(`   Found ${foodFiles.length} food files`);

    // Read and parse all food files
    const foods = [];
    const errors = [];

    for (const filepath of foodFiles) {
      try {
        const content = await readFile(filepath, 'utf-8');
        const food = JSON.parse(content);

        // Basic validation
        if (!food.id || !food.name) {
          errors.push(`${basename(filepath)}: Missing required field (id or name)`);
          continue;
        }

        foods.push(food);
      } catch (err) {
        errors.push(`${basename(filepath)}: ${err.message}`);
      }
    }

    // Report validation errors
    if (errors.length > 0) {
      console.error('\n❌ Validation errors:');
      errors.forEach(err => console.error(`   - ${err}`));
      throw new Error(`Failed to parse ${errors.length} food file(s)`);
    }

    // Sort by ID for consistent output and easier diffs
    foods.sort((a, b) => a.id.localeCompare(b.id));

    // Build category index
    const categorySet = new Set();
    foods.forEach(food => {
      food.categories?.forEach(cat => categorySet.add(cat));
    });

    // Create bundle
    const bundle = {
      extraction_metadata: index.extraction_metadata,
      extraction_index: index.extraction_index,
      build_metadata: {
        build_timestamp: new Date().toISOString(),
        total_foods: foods.length,
        total_categories: categorySet.size,
        builder_version: '1.0.0'
      },
      categories: Array.from(categorySet).sort(),
      foods
    };

    // Ensure public directory exists
    await mkdir(`${ROOT}/public`, { recursive: true });

    // Write bundle with pretty formatting (Astro copies public/ to dist/)
    const outputPath = `${ROOT}/public/foods-bundle.json`;
    await writeFile(outputPath, JSON.stringify(bundle, null, 2));

    const endTime = Date.now();
    const bundleSize = JSON.stringify(bundle).length;

    console.log(`✅ Successfully aggregated ${foods.length} foods`);
    console.log(`   Output: ${outputPath}`);
    console.log(`   Bundle size: ${(bundleSize / 1024).toFixed(2)} KB`);
    console.log(`   Build time: ${endTime - startTime}ms`);

  } catch (err) {
    console.error('\n❌ Failed to aggregate foods:', err.message);
    process.exit(1);
  }
}

// Run the aggregation
aggregateFoods();
