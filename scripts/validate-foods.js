/**
 * Validation script for food data files
 *
 * This script validates all individual food JSON files to ensure they
 * conform to the expected schema and contain valid data.
 *
 * Usage:
 *   node scripts/validate-foods.js
 *
 * Exit codes:
 *   0 - All validations passed
 *   1 - Validation errors found
 */

import { glob } from 'glob';
import { readFile } from 'fs/promises';
import { basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);

// Schema definition
const REQUIRED_FIELDS = ['id', 'name', 'categories', 'properties', 'benefits', 'sources'];

const VALID_CATEGORIES = [
  'rich-in-legumes',
  'rich-in-vegetables',
  'rich-in-fruits',
  'rich-in-whole-grains',
  'cruciferous',
  'greens',
  'high-fiber',
  'high-water-rich',
  'anti-inflammatory',
  'low-glycemic',
  'herbs-and-spices',
  'appetite-suppression',
  'weight-loss-booster',
  // Additional categories from expanded extraction
  'prebiotic',
  'sweetener-alternative',
  'particularly-satiating',
  'low-calorie-density',
  'low-in-added-fat',
  'fat-blocker',
  'rich-in-greens',
  'microbiome-friendly',
  'low-insulin-index',
  'fruits',
  'berries',
  'vegetables',
  'nuts-and-seeds',
  'mood-support',
  'metabolic-booster',
  'thermogenic',
  'fat-burner',
  'enzyme-rich',
  'circadian-rhythm-support',
  'beverages',
  'antioxidant-rich',
  'digestive-support',
  'metabolism-boosting',
  'whole-grains',
  'low-in-salt',
  'sleep-optimization',
  'behavior-tweak',
  'timing-strategy',
  'hydration-strategy',
  'chronobiology',
  'evening-beverage',
  'caffeine-free',
  'resistant-starch',
  'herbs-spices',
  'nutrient-dense',
  'heavy-metal-detox',
  'allium-family'
];

const VALID_TIMING = [
  'any-meal',
  'breakfast',
  'lunch',
  'dinner',
  'snacks',
  'with-meals',
  'in-cooking',
  'earlier-in-meal',
  'earlier-in-meal-for-maximum-benefit',
  'particularly-effective-in-soups',
  'daily',
  'can-sprinkle-on-meals',
  // Additional timing values from expanded extraction
  'with-beverages',
  'dessert',
  'with-meals-containing-fat',
  'salads',
  'soups',
  'meal-prep',
  'evening',
  'as-snack',
  'broths',
  'during-meals',
  'can-be-added-to-meals',
  'morning-preferred',
  'between-meals',
  'not-within-6-hours-of-bedtime',
  'morning',
  'preferably-raw',
  'eat-early-in-meal',
  'meal-preload',
  'nightly',
  'regular-bedtime',
  'consistent-time',
  'evening-safe',
  'any-time-of-day',
  'morning-to-afternoon-emphasis',
  'reduced-evening',
  'before-7pm-cutoff',
  'daily-rhythm-alignment',
  'consistent-schedule',
  'morning-to-midday',
  'avoid-6-hours-before-bed',
  'particularly-effective-as-pasta-substitute',
  'particularly-effective-in-dressings',
  'particularly-effective-roasted',
  'appetizers',
  'particularly-effective-in-stuffing'
];

class ValidationError {
  constructor(file, field, message) {
    this.file = file;
    this.field = field;
    this.message = message;
  }

  toString() {
    return `${this.file}: [${this.field}] ${this.message}`;
  }
}

function validateFood(food, filepath) {
  const errors = [];
  const filename = basename(filepath);

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!(field in food)) {
      errors.push(new ValidationError(filename, field, 'Missing required field'));
    }
  }

  // Validate ID format
  if (food.id && !/^food-\d+$/.test(food.id)) {
    errors.push(new ValidationError(filename, 'id', `Invalid format: "${food.id}". Expected: "food-{number}"`));
  }

  // Validate name
  if (food.name && typeof food.name !== 'string') {
    errors.push(new ValidationError(filename, 'name', 'Must be a string'));
  }

  if (food.name && food.name.length === 0) {
    errors.push(new ValidationError(filename, 'name', 'Cannot be empty'));
  }

  // Validate categories
  if (food.categories) {
    if (!Array.isArray(food.categories)) {
      errors.push(new ValidationError(filename, 'categories', 'Must be an array'));
    } else {
      for (const cat of food.categories) {
        if (!VALID_CATEGORIES.includes(cat)) {
          errors.push(new ValidationError(filename, 'categories', `Invalid category: "${cat}"`));
        }
      }

      if (food.categories.length === 0) {
        errors.push(new ValidationError(filename, 'categories', 'Must have at least one category'));
      }
    }
  }

  // Validate properties
  if (food.properties) {
    if (!Array.isArray(food.properties)) {
      errors.push(new ValidationError(filename, 'properties', 'Must be an array'));
    }
  }

  // Validate timing
  if (food.timing) {
    if (!Array.isArray(food.timing)) {
      errors.push(new ValidationError(filename, 'timing', 'Must be an array'));
    } else {
      for (const time of food.timing) {
        if (!VALID_TIMING.includes(time)) {
          errors.push(new ValidationError(filename, 'timing', `Invalid timing: "${time}"`));
        }
      }
    }
  }

  // Validate synergies
  if (food.synergies) {
    if (!Array.isArray(food.synergies)) {
      errors.push(new ValidationError(filename, 'synergies', 'Must be an array'));
    }
  }

  // Validate conflicts
  if (food.conflicts) {
    if (!Array.isArray(food.conflicts)) {
      errors.push(new ValidationError(filename, 'conflicts', 'Must be an array'));
    }
  }

  // Validate sources
  if (food.sources) {
    if (typeof food.sources !== 'object') {
      errors.push(new ValidationError(filename, 'sources', 'Must be an object'));
    } else {
      if (!food.sources.pages || !Array.isArray(food.sources.pages)) {
        errors.push(new ValidationError(filename, 'sources.pages', 'Must be an array of page numbers'));
      }

      if (!food.sources.quotes || !Array.isArray(food.sources.quotes)) {
        errors.push(new ValidationError(filename, 'sources.quotes', 'Must be an array of quote strings'));
      }
    }
  }

  return errors;
}

async function validateAllFoods() {
  try {
    console.log('🔍 Validating food data files...\n');

    // Find all food files
    const foodFiles = await glob(`${ROOT}/data/foods/*.json`);

    if (foodFiles.length === 0) {
      console.warn('⚠️  No food files found in data/foods/');
      return;
    }

    console.log(`Found ${foodFiles.length} food files\n`);

    let totalErrors = 0;
    const allErrors = [];
    const seenIds = new Set();
    const seenNames = new Set();

    // Validate each file
    for (const filepath of foodFiles) {
      try {
        const content = await readFile(filepath, 'utf-8');
        const food = JSON.parse(content);

        // Validate schema
        const errors = validateFood(food, filepath);
        allErrors.push(...errors);
        totalErrors += errors.length;

        // Check for duplicate IDs
        if (food.id) {
          if (seenIds.has(food.id)) {
            const error = new ValidationError(basename(filepath), 'id', `Duplicate ID: "${food.id}"`);
            allErrors.push(error);
            totalErrors++;
          }
          seenIds.add(food.id);
        }

        // Check for duplicate names (warning only)
        if (food.name) {
          if (seenNames.has(food.name.toLowerCase())) {
            console.warn(`⚠️  ${basename(filepath)}: Duplicate name "${food.name}" (may be intentional)`);
          }
          seenNames.add(food.name.toLowerCase());
        }

      } catch (err) {
        const error = new ValidationError(basename(filepath), 'parse', err.message);
        allErrors.push(error);
        totalErrors++;
      }
    }

    // Report results
    if (totalErrors === 0) {
      console.log(`✅ All ${foodFiles.length} food files are valid!\n`);

      // Print summary stats
      console.log('📊 Summary:');
      console.log(`   Total foods: ${seenIds.size}`);
      console.log(`   Unique IDs: ${seenIds.size}`);
      console.log(`   Unique names: ${seenNames.size}`);

      return;
    }

    // Group errors by file
    const errorsByFile = new Map();
    for (const error of allErrors) {
      if (!errorsByFile.has(error.file)) {
        errorsByFile.set(error.file, []);
      }
      errorsByFile.get(error.file).push(error);
    }

    console.error(`❌ Found ${totalErrors} validation error(s) in ${errorsByFile.size} file(s):\n`);

    for (const [file, errors] of errorsByFile) {
      console.error(`${file} (${errors.length} error${errors.length > 1 ? 's' : ''}):`);
      for (const error of errors) {
        console.error(`  - [${error.field}] ${error.message}`);
      }
      console.error('');
    }

    console.error('💡 Tips:');
    console.error('   - Check the schema requirements in the validation script');
    console.error('   - Valid categories:', VALID_CATEGORIES.slice(0, 3).join(', '), '...');
    console.error('   - Valid timing values:', VALID_TIMING.slice(0, 3).join(', '), '...');

    process.exit(1);

  } catch (err) {
    console.error('\n❌ Validation failed:', err.message);
    process.exit(1);
  }
}

// Run validation
validateAllFoods();
