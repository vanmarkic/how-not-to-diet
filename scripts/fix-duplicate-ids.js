/**
 * Fix duplicate IDs in food files
 * Reassigns IDs sequentially from food-1 to food-N
 */

import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';
import { basename } from 'path';

const ROOT = process.cwd();

async function fixDuplicateIds() {
  console.log('🔧 Fixing duplicate IDs...\n');

  // Get all food files
  const foodFiles = await glob(`${ROOT}/data/foods/*.json`);

  // Read all foods and collect by ID
  const foodsByFile = [];
  const idCounts = {};

  for (const filePath of foodFiles) {
    const content = await readFile(filePath, 'utf-8');
    const food = JSON.parse(content);
    const filename = basename(filePath);

    foodsByFile.push({ filePath, filename, food, originalId: food.id });
    idCounts[food.id] = (idCounts[food.id] || 0) + 1;
  }

  // Find duplicates
  const duplicateIds = Object.keys(idCounts).filter(id => idCounts[id] > 1);

  if (duplicateIds.length === 0) {
    console.log('✅ No duplicate IDs found!');
    return;
  }

  console.log(`Found ${duplicateIds.length} duplicate IDs:`);
  duplicateIds.forEach(id => console.log(`  - ${id} (${idCounts[id]} files)`));
  console.log();

  // Sort files alphabetically by filename for consistent ID assignment
  foodsByFile.sort((a, b) => a.filename.localeCompare(b.filename));

  // Reassign IDs sequentially
  console.log('📝 Reassigning IDs sequentially...\n');
  let nextId = 1;

  for (const { filePath, filename, food, originalId } of foodsByFile) {
    const newId = `food-${nextId}`;

    if (food.id !== newId) {
      food.id = newId;
      await writeFile(filePath, JSON.stringify(food, null, 2) + '\n');
      console.log(`  ✓ ${filename}: ${originalId} → ${newId}`);
    }

    nextId++;
  }

  console.log(`\n✅ Fixed! All ${foodsByFile.length} foods now have unique IDs (food-1 to food-${foodsByFile.length})`);
}

fixDuplicateIds().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
