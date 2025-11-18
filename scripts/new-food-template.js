/**
 * Interactive script to create a new food file from a template
 *
 * This script helps you quickly create a new food entry with the
 * correct schema and ID numbering.
 *
 * Usage:
 *   node scripts/new-food-template.js
 */

import { writeFile, readFile } from 'fs/promises';
import { glob } from 'glob';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as readline from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);

function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function getNextFoodId() {
  const foodFiles = await glob(`${ROOT}/data/foods/*.json`);

  if (foodFiles.length === 0) {
    return 'food-1';
  }

  // Read all IDs and find the highest number
  let maxId = 0;

  for (const file of foodFiles) {
    try {
      const content = await readFile(file, 'utf-8');
      const food = JSON.parse(content);
      const match = food.id?.match(/^food-(\d+)$/);

      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxId) {
          maxId = num;
        }
      }
    } catch {
      // Skip files with parsing errors
    }
  }

  return `food-${maxId + 1}`;
}

function createFoodTemplate(id, name) {
  return {
    id,
    name,
    categories: [],
    properties: [],
    benefits: '',
    synergies: [],
    conflicts: [],
    timing: [],
    amount: '',
    sources: {
      pages: [],
      quotes: []
    }
  };
}

async function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

async function createNewFood() {
  try {
    console.log('📝 Create New Food Entry\n');

    // Get food name
    const name = await prompt('Food name (e.g., "Beans (Legumes)"): ');

    if (!name.trim()) {
      console.error('❌ Food name cannot be empty');
      process.exit(1);
    }

    // Generate slug and ID
    const slug = createSlug(name);
    const id = await getNextFoodId();

    // Create template
    const food = createFoodTemplate(id, name.trim());

    // Write file
    const filepath = `${ROOT}/data/foods/${slug}.json`;
    await writeFile(filepath, JSON.stringify(food, null, 2) + '\n');

    console.log(`\n✅ Created new food file:`);
    console.log(`   File: ${filepath}`);
    console.log(`   ID: ${id}`);
    console.log(`   Name: ${name}`);
    console.log(`\n📋 Next steps:`);
    console.log(`   1. Open ${filepath} in your editor`);
    console.log(`   2. Fill in the categories, properties, benefits, etc.`);
    console.log(`   3. Run: node scripts/validate-foods.js`);
    console.log(`   4. Run: node scripts/aggregate-foods.js`);
    console.log(`\n💡 Valid categories:`);
    console.log(`   - rich-in-legumes`);
    console.log(`   - rich-in-vegetables`);
    console.log(`   - rich-in-fruits`);
    console.log(`   - cruciferous`);
    console.log(`   - greens`);
    console.log(`   - high-fiber`);
    console.log(`   - anti-inflammatory`);
    console.log(`   - low-glycemic`);
    console.log(`   - herbs-and-spices`);
    console.log(`   - appetite-suppression`);
    console.log(`   - weight-loss-booster`);

  } catch (err) {
    console.error('\n❌ Failed to create food:', err.message);
    process.exit(1);
  }
}

createNewFood();
