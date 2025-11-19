/**
 * Fix sources format in food files
 * Ensures sources.pages and sources.quotes are arrays
 */

import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';

const ROOT = process.cwd();

async function fixSourcesFormat() {
  console.log('🔧 Fixing sources format in food files...\n');

  const foodFiles = await glob(`${ROOT}/data/foods/*.json`);
  let fixed = 0;

  for (const filePath of foodFiles) {
    try {
      const content = await readFile(filePath, 'utf-8');
      const food = JSON.parse(content);
      let modified = false;

      if (food.sources) {
        // Check if sources is an array (wrong format)
        if (Array.isArray(food.sources)) {
          // Convert array format to object format
          const pages = [];
          const quotes = [];

          for (const source of food.sources) {
            if (source.page) pages.push(source.page);
            if (source.quote) quotes.push(source.quote);
          }

          food.sources = {
            pages: pages,
            quotes: quotes
          };
          modified = true;
        } else {
          // Fix pages if not array
          if (food.sources.pages && !Array.isArray(food.sources.pages)) {
            food.sources.pages = [food.sources.pages];
            modified = true;
          }

          // Fix quotes if not array
          if (food.sources.quotes && !Array.isArray(food.sources.quotes)) {
            food.sources.quotes = [food.sources.quotes];
            modified = true;
          }
        }

        if (modified) {
          await writeFile(filePath, JSON.stringify(food, null, 2) + '\n');
          console.log(`  ✓ Fixed: ${filePath.split('/').pop()}`);
          fixed++;
        }
      }
    } catch (err) {
      console.error(`  ❌ Error in ${filePath}: ${err.message}`);
    }
  }

  console.log(`\n✅ Fixed ${fixed} file(s)`);
}

fixSourcesFormat().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
