#!/usr/bin/env python3
"""Analyze pages 321-386 to identify NEW foods not already in database."""

import json
import os
import re
from pathlib import Path

# Load existing foods
def get_existing_foods():
    """Get set of existing food names from data/foods/."""
    existing = set()
    foods_dir = Path("data/foods")

    if foods_dir.exists():
        for filepath in foods_dir.glob("*.json"):
            # Extract food name from filename
            name = filepath.stem.replace('-', ' ')
            existing.add(name.lower())

            # Also load the JSON to get alternate names
            try:
                with open(filepath, 'r') as f:
                    data = json.load(f)
                    if 'name' in data:
                        existing.add(data['name'].lower())
            except:
                pass

    return existing

# Read extracted text
def read_extracted_text():
    """Read the extracted pages text."""
    with open("pages_321_386_content.txt", 'r') as f:
        return f.read()

# Main analysis
existing_foods = get_existing_foods()
print(f"Found {len(existing_foods)} existing foods in database")
print("\nSample existing foods:")
for food in sorted(list(existing_foods))[:10]:
    print(f"  - {food}")

content = read_extracted_text()

# Identify sections in pages 321-386
print("\n" + "="*80)
print("CONTENT ANALYSIS")
print("="*80)

# Check for recipes (recipes often contain new foods)
recipe_pattern = r"(?:MAKES:|DIFFICULTY:)"
recipes = re.findall(r"^([A-Z][A-Z\s\-–]+)$", content, re.MULTILINE)
recipes = [r.strip() for r in recipes if len(r) > 5 and "PAGE" not in r and "MAKES" not in r]

print(f"\nFound {len(recipes)} potential recipe titles")

# Look for specific food mentions
# Common food patterns in this cookbook
food_indicators = [
    r"(\d+)\s*(?:cups?|tablespoons?|teaspoons?|ounces?|g|ml)\s+([a-z][a-z\s\-]+?)(?:\s|,|$)",
    r"(?:fresh|dried|raw|roasted|cooked|ground)\s+([a-z][a-z\s\-]+?)(?:\s|,|$)",
]

# Extract page ranges and their content
page_sections = {}
current_page = None
current_content = []

for line in content.split('\n'):
    if line.startswith("PAGE "):
        if current_page:
            page_sections[current_page] = '\n'.join(current_content)
        current_page = int(line.replace("PAGE ", "").strip())
        current_content = []
    else:
        current_content.append(line)

if current_page:
    page_sections[current_page] = '\n'.join(current_content)

print(f"\nPages extracted: {sorted(page_sections.keys())}")

# Analyze content by sections
print("\n" + "="*80)
print("SECTION BREAKDOWN")
print("="*80)

# Pages 321-330: End of recipes/desserts
print("\nPages 321-330: Recipe endings & desserts")
dessert_pages = {k: v for k, v in page_sections.items() if 321 <= k <= 330}
for page, content in sorted(dessert_pages.items())[:3]:
    lines = [l for l in content.split('\n') if l.strip()][:5]
    print(f"  Page {page}: {' | '.join(lines[:2])}")

# Pages 331-349: Kitchen Staples chapter
print("\nPages 331-349: Kitchen Staples (sauces, spice blends, condiments)")
staples_pages = {k: v for k, v in page_sections.items() if 331 <= k <= 349}

# Pages 350-356: Cooking Charts
print("\nPages 350-356: Legumes and Grains Cooking Charts")

# Pages 357-386: References
print("\nPages 357-386: References section")

# Identify NEW foods by looking for ingredients not in existing database
print("\n" + "="*80)
print("NEW FOOD CANDIDATES")
print("="*80)

# Common ingredients to check from Kitchen Staples section
kitchen_staples_ingredients = []

# Scan for ingredient lists (lines with measurements)
ingredient_pattern = r"(?:\d+/?[\d\s]*|½|⅓|¼|⅔|¾|⅛)\s*(?:cups?|tablespoons?|teaspoons?|ounces?|g|ml|pounds?|lb)\s+(.+?)(?:\n|$)"

for page in range(331, 350):
    if page in page_sections:
        content = page_sections[page]
        matches = re.findall(ingredient_pattern, content, re.IGNORECASE)
        for match in matches:
            # Clean up the ingredient
            ingredient = match.strip().lower()
            # Remove common descriptors
            ingredient = re.sub(r'\(.*?\)', '', ingredient)
            ingredient = re.sub(r',.*', '', ingredient)
            ingredient = ingredient.strip()

            # Skip if already exists
            if ingredient in existing_foods:
                continue

            # Skip very short or generic terms
            if len(ingredient) < 3:
                continue

            if ingredient and ingredient not in kitchen_staples_ingredients:
                kitchen_staples_ingredients.append(ingredient)

print(f"\nPotential new ingredients from Kitchen Staples: {len(kitchen_staples_ingredients)}")
for ing in sorted(kitchen_staples_ingredients)[:20]:
    print(f"  - {ing}")

# Save detailed analysis
with open("final_section_analysis.txt", 'w') as f:
    f.write("ANALYSIS OF PAGES 321-386\n")
    f.write("="*80 + "\n\n")

    f.write(f"Total pages analyzed: {len(page_sections)}\n")
    f.write(f"Existing foods in database: {len(existing_foods)}\n")
    f.write(f"Potential new ingredients found: {len(kitchen_staples_ingredients)}\n\n")

    f.write("SECTION BREAKDOWN:\n")
    f.write("-"*80 + "\n")
    f.write("Pages 321-330: Recipe endings, desserts\n")
    f.write("Pages 331-349: Kitchen Staples (sauces, blends, condiments)\n")
    f.write("Pages 350-356: Cooking charts for legumes and grains\n")
    f.write("Pages 357-386: References\n\n")

    f.write("NEW INGREDIENT CANDIDATES:\n")
    f.write("-"*80 + "\n")
    for ing in sorted(kitchen_staples_ingredients):
        f.write(f"  - {ing}\n")

print("\nAnalysis saved to: final_section_analysis.txt")
