/**
 * Migration script: Split single foods file into individual files
 *
 * This script takes the existing extracted-foods.json file and splits it
 * into individual JSON files (one per food) following the hybrid approach.
 *
 * Usage:
 *   node scripts/split-foods.js
 *
 * Output:
 *   data/index.json (metadata)
 *   data/foods/*.json (individual food files)
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);

function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[()]/g, '')        // Remove parentheses
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')   // Remove other special chars
    .replace(/-+/g, '-')          // Collapse multiple hyphens
    .replace(/^-|-$/g, '');       // Trim hyphens from ends
}

async function splitFoods() {
  try {
    console.log('🔄 Splitting foods file into individual files...\n');

    // Read the existing foods file
    const inputPath = `${ROOT}/data/extracted-foods.json`;
    const data = JSON.parse(await readFile(inputPath, 'utf-8'));

    // Create directories
    await mkdir(`${ROOT}/data/foods`, { recursive: true });

    // Extract and write index file (metadata only)
    const index = {
      extraction_metadata: data.extraction_metadata,
      extraction_index: data.extraction_index,
      schema_version: '1.0.0',
      total_foods: data.foods.length
    };

    const indexPath = `${ROOT}/data/index.json`;
    await writeFile(indexPath, JSON.stringify(index, null, 2));
    console.log(`✅ Created index file: ${indexPath}`);

    // Write individual food files
    console.log(`\n📄 Creating ${data.foods.length} individual food files:\n`);

    const fileMap = new Map(); // Track slugs to prevent duplicates

    for (const food of data.foods) {
      const slug = createSlug(food.name);

      // Check for slug collisions
      if (fileMap.has(slug)) {
        console.warn(`⚠️  Slug collision: "${food.name}" and "${fileMap.get(slug)}" both map to "${slug}"`);
        // Append ID to make it unique
        const uniqueSlug = `${slug}-${food.id}`;
        console.log(`   Using: ${uniqueSlug}.json`);
        fileMap.set(uniqueSlug, food.name);
      } else {
        fileMap.set(slug, food.name);
      }

      const filename = fileMap.get(slug) === food.name ? slug : `${slug}-${food.id}`;
      const filepath = `${ROOT}/data/foods/${filename}.json`;

      await writeFile(filepath, JSON.stringify(food, null, 2));
      console.log(`   ✓ ${filename}.json`);
    }

    console.log(`\n✅ Successfully split ${data.foods.length} foods into individual files`);
    console.log(`\n📋 Next steps:`);
    console.log(`   1. Review the generated files in data/foods/`);
    console.log(`   2. Run: node scripts/aggregate-foods.js`);
    console.log(`   3. Update your imports to use dist/foods-bundle.json`);
    console.log(`   4. Add dist/ to .gitignore`);
    console.log(`   5. (Optional) Backup and remove data/extracted-foods.json`);

  } catch (err) {
    console.error('\n❌ Failed to split foods:', err.message);
    process.exit(1);
  }
}

// Run the split
splitFoods();
