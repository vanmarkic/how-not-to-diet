#!/usr/bin/env python3
"""Identify truly NEW foods from pages 321-386."""

import json
from pathlib import Path

# Get existing food names
existing_foods = set()
foods_dir = Path("data/foods")

for filepath in foods_dir.glob("*.json"):
    with open(filepath, 'r') as f:
        data = json.load(f)
        name = data.get('name', '').lower()
        existing_foods.add(name)
        # Also add filename variant
        existing_foods.add(filepath.stem.replace('-', ' '))

# Print sorted list of existing foods for manual comparison
print("EXISTING FOODS IN DATABASE:")
print("="*80)
for food in sorted(existing_foods):
    print(f"  {food}")

print(f"\nTotal: {len(existing_foods)} existing foods")

# New food candidates from pages 321-386 analysis
# Based on manual review of the PDF content
new_food_candidates = [
    # Spices found in spice blends that might not be standalone
    "Treacle (Blackstrap Molasses)",
    "Allspice",
    "Fenugreek Seeds",
    "Celery Seeds",  # Check if different from "celery"

    # Specific grain types mentioned in BROL recipe
    "Rye Grains",
    "Pot Barley (Barley Groats)",

    # Other ingredients from Kitchen Staples
    "White Miso Paste",
    "Miso Paste",
    "Nutritional Yeast",
    "Brazil Nuts",

    # Items from references/index (if any)
]

print("\n" + "="*80)
print("NEW FOOD CANDIDATES TO CHECK:")
print("="*80)

for candidate in new_food_candidates:
    candidate_lower = candidate.lower()
    # Check various forms
    exists = False
    for existing in existing_foods:
        if candidate_lower in existing or existing in candidate_lower:
            exists = True
            print(f"  {candidate:40} -> EXISTS as: {existing}")
            break

    if not exists:
        print(f"  {candidate:40} -> NEW!")
