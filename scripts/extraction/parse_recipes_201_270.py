#!/usr/bin/env python3
"""Parse recipes from pages 201-270 and create JSON files."""

import json
import re
from pathlib import Path
from typing import Dict, List, Tuple

# Configuration
EXTRACTED_TEXT = Path("/Users/dragan/Documents/how-not-to-diet/pages_201_270.txt")
FOODS_DIR = Path("/Users/dragan/Documents/how-not-to-diet/data/foods")
OUTPUT_DIR = Path("/Users/dragan/Documents/how-not-to-diet/data/recipes")
START_RECIPE_NUM = 30

# Create output directory
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Load food database
def load_foods() -> Dict:
    """Load all foods from the foods directory."""
    foods = {}
    food_names_to_ids = {}

    for food_file in FOODS_DIR.glob("*.json"):
        with open(food_file, 'r') as f:
            food_data = json.load(f)
            food_id = food_file.stem
            foods[food_id] = food_data

            # Create lookup by name
            if 'name' in food_data:
                name_lower = food_data['name'].lower()
                food_names_to_ids[name_lower] = food_id

                # Add common variations
                if name_lower == 'chickpeas':
                    food_names_to_ids['chickpea'] = food_id
                elif name_lower == 'kale':
                    food_names_to_ids['kale'] = food_id
                    food_names_to_ids['dark leafy greens'] = food_id

    return foods, food_names_to_ids

def parse_recipes_from_text(text: str) -> List[Dict]:
    """Parse recipes from extracted text."""
    recipes = []

    # Split by page markers
    pages = text.split("="*80)

    current_recipe = None
    in_ingredients = False
    in_instructions = False

    for i, page_text in enumerate(pages):
        if not page_text.strip():
            continue

        lines = page_text.strip().split('\n')

        for line_idx, line in enumerate(lines):
            line = line.strip()

            # Detect recipe title (ALL CAPS or Title Case, with MAKES: and DIFFICULTY:)
            if 'MAKES:' in line and 'DIFFICULTY:' in line:
                # Look back for the recipe title (previous non-empty line)
                title_line = None
                for back_idx in range(line_idx - 1, max(0, line_idx - 5), -1):
                    if lines[back_idx].strip() and lines[back_idx].strip() != "":
                        title_line = lines[back_idx].strip()
                        break

                if title_line:
                    # Save previous recipe
                    if current_recipe:
                        recipes.append(current_recipe)

                    # Parse servings and difficulty
                    servings_match = re.search(r'MAKES:\s*(\d+)\s*(?:to\s*(\d+))?\s*servings?', line, re.IGNORECASE)
                    difficulty_match = re.search(r'DIFFICULTY:\s*(\w+)', line, re.IGNORECASE)

                    servings = servings_match.group(1) if servings_match else "4"
                    servings_max = servings_match.group(2) if servings_match and servings_match.group(2) else servings
                    difficulty = difficulty_match.group(1) if difficulty_match else "Moderate"

                    # Get page number
                    page_match = re.search(r'PAGE\s+(\d+)', '\n'.join(lines[:line_idx]))
                    page_num = page_match.group(1) if page_match else "?"

                    current_recipe = {
                        "name": title_line.title(),
                        "page": int(page_num) if page_num != "?" else None,
                        "servings": f"{servings}-{servings_max}" if servings != servings_max else servings,
                        "difficulty": difficulty,
                        "ingredients_raw": [],
                        "instructions_raw": [],
                        "description": ""
                    }
                    in_ingredients = True
                    in_instructions = False

            # Collect description (text between MAKES line and ingredients)
            elif current_recipe and not current_recipe.get("description") and line and not line.isupper():
                if 'MAKES:' not in line and 'DIFFICULTY:' not in line:
                    if line_idx > 0 and 'MAKES:' in lines[line_idx - 1]:
                        current_recipe["description"] = line

            # Detect start of instructions
            elif line.startswith("Preheat") or line.startswith("Heat") or line.startswith("Place") or line.startswith("In a") or line.startswith("Using"):
                in_ingredients = False
                in_instructions = True
                if current_recipe and line:
                    current_recipe["instructions_raw"].append(line)

            # Collect ingredients
            elif current_recipe and in_ingredients and line:
                # Ingredients usually start with amounts or ingredient names
                if re.match(r'^[\d½⅓¼⅔¾⅛⅜⅝⅞]', line) or re.match(r'^[A-Z]', line):
                    # Skip certain lines
                    if not any(skip in line for skip in ['Preheat', 'Turn to', 'Hint:', '*', 'WHITE BEAN', 'TEMPEH']):
                        current_recipe["ingredients_raw"].append(line)

            # Collect instructions
            elif current_recipe and in_instructions and line:
                if not line.startswith("*") and not line.startswith("Hint:"):
                    current_recipe["instructions_raw"].append(line)

    # Add last recipe
    if current_recipe:
        recipes.append(current_recipe)

    return recipes

def match_ingredients_to_foods(ingredient_text: str, foods: Dict, food_lookup: Dict) -> List[str]:
    """Match ingredient text to food database entries."""
    matched_foods = []
    ingredient_lower = ingredient_text.lower()

    # Common ingredient mappings
    ingredient_mappings = {
        'chickpeas': 'chickpeas',
        'chickpea': 'chickpeas',
        'kale': 'kale',
        'dark leafy greens': 'kale',
        'carrots': 'carrots',
        'carrot': 'carrots',
        'cumin': 'cumin',
        'tomatoes': 'cherry-tomatoes',
        'cherry tomatoes': 'cherry-tomatoes',
        'sweet potato': 'sweet-potatoes',
        'sweet potatoes': 'sweet-potatoes',
        'onion': 'onions',
        'red onion': 'onions',
        'garlic': 'garlic',
        'black pepper': 'black-pepper',
        'cranberries': 'cranberries-dried',
        'celery': 'celery',
        'lentils': 'lentils-brown-puy',
        'brown lentils': 'lentils-brown-puy',
        'black lentils': 'lentils-black-beluga',
        'mushrooms': 'mushrooms-white',
        'tempeh': 'tempeh',
        'white beans': 'white-beans-cannellini',
        'black beans': 'black-beans',
        'peas': 'peas',
        'parsley': 'parsley-fresh',
        'fresh parsley': 'parsley-fresh',
        'broccoli': 'broccoli',
        'barley': 'barley',
        'oats': 'oat-groats-whole-intact-oats',
        'rye': 'rye-berries-whole',
        'kabocha squash': 'kabocha-squash',
        'butternut squash': 'butternut-squash',
        'collards': 'collard-greens',
        'miso': 'miso',
        'nutritional yeast': 'nutritional-yeast',
        'apple cider vinegar': 'apple-cider-vinegar',
        'coriander': 'coriander-ground',
        'ground coriander': 'coriander-ground',
        'smoked paprika': 'smoked-paprika',
        'sage': 'sage-dried',
        'thyme': 'thyme-dried',
        'rosemary': 'rosemary-dried',
        'black-eyed beans': 'black-eyed-peas',
        'beetroot': 'beetroot',
        'beets': 'beetroot',
        'red beans': 'red-beans-kidney',
        'kidney beans': 'red-beans-kidney',
    }

    # Try direct mappings first
    for key, food_id in ingredient_mappings.items():
        if key in ingredient_lower:
            if food_id in foods:
                if food_id not in matched_foods:
                    matched_foods.append(food_id)

    return matched_foods

def determine_meal_type(recipe_name: str, page: int) -> str:
    """Determine meal type based on recipe name and context."""
    name_lower = recipe_name.lower()

    # Keywords for different meal types
    breakfast_keywords = ['breakfast', 'oatmeal', 'bowl', 'smoothie']
    lunch_keywords = ['salad', 'sandwich', 'wrap']
    dinner_keywords = ['pie', 'stew', 'curry', 'chilli', 'dal', 'tempeh']

    if any(kw in name_lower for kw in breakfast_keywords):
        return 'breakfast'
    elif any(kw in name_lower for kw in lunch_keywords):
        return 'lunch'
    elif any(kw in name_lower for kw in dinner_keywords):
        return 'dinner'
    else:
        return 'dinner'  # Default

def calculate_daily_dozen(matched_foods: List[str], foods: Dict) -> List[str]:
    """Calculate Daily Dozen categories covered by recipe."""
    daily_dozen = []

    for food_id in matched_foods:
        if food_id in foods:
            food_data = foods[food_id]
            categories = food_data.get('categories', [])

            # Map categories to Daily Dozen
            if 'rich-in-legumes' in categories or 'legumes' in categories:
                if 'beans' not in daily_dozen:
                    daily_dozen.append('beans')
            if 'cruciferous' in categories:
                if 'cruciferous-vegetables' not in daily_dozen:
                    daily_dozen.append('cruciferous-vegetables')
            if 'greens' in categories:
                if 'greens' not in daily_dozen:
                    daily_dozen.append('greens')
            if 'rich-in-vegetables' in categories:
                if 'other-vegetables' not in daily_dozen:
                    daily_dozen.append('other-vegetables')
            if 'berries' in categories:
                if 'berries' not in daily_dozen:
                    daily_dozen.append('berries')
            if 'whole-grains' in categories:
                if 'whole-grains' not in daily_dozen:
                    daily_dozen.append('whole-grains')
            if 'nuts-and-seeds' in categories:
                if 'nuts-and-seeds' not in daily_dozen:
                    daily_dozen.append('nuts-and-seeds')

    return daily_dozen

def extract_tweaks(matched_foods: List[str], foods: Dict, recipe_data: Dict) -> List[str]:
    """Extract 21 Tweaks incorporated in recipe."""
    tweaks = []

    for food_id in matched_foods:
        if food_id in foods:
            food_data = foods[food_id]
            categories = food_data.get('categories', [])

            # Map to 21 Tweaks
            if 'weight-loss-booster' in categories:
                if 'spices' not in tweaks:
                    tweaks.append('spices')
            if food_id == 'apple-cider-vinegar' or 'vinegar' in food_id:
                if 'vinegar' not in tweaks:
                    tweaks.append('vinegar')
            if 'high-fiber' in categories:
                if 'fiber' not in tweaks:
                    tweaks.append('fiber')
            if 'negative-calorie' in categories:
                if 'negative-calorie-foods' not in tweaks:
                    tweaks.append('negative-calorie-foods')

    # Check recipe name for meal timing
    name_lower = recipe_data.get('name', '').lower()
    if 'breakfast' in name_lower:
        tweaks.append('meal-timing-breakfast')

    return tweaks

def extract_synergies(matched_foods: List[str], foods: Dict) -> List[Dict]:
    """Extract food synergies from matched foods."""
    all_synergies = []

    for food_id in matched_foods:
        if food_id in foods:
            food_data = foods[food_id]
            synergies = food_data.get('synergies', [])

            # Check which synergies are present in this recipe
            for synergy in synergies:
                # Normalize synergy name for matching
                synergy_normalized = synergy.lower().replace('-', ' ').replace('_', ' ')

                # Check if synergy food is in recipe
                for other_food_id in matched_foods:
                    if other_food_id != food_id:
                        other_food_name = foods[other_food_id].get('name', '').lower()
                        if synergy_normalized in other_food_name or other_food_name in synergy_normalized:
                            synergy_obj = {
                                "food1": food_id,
                                "food2": other_food_id,
                                "benefit": f"{foods[food_id]['name']} + {foods[other_food_id]['name']}"
                            }
                            if synergy_obj not in all_synergies:
                                all_synergies.append(synergy_obj)

    return all_synergies

def main():
    print("Loading food database...")
    foods, food_lookup = load_foods()
    print(f"Loaded {len(foods)} foods")

    print("\nReading extracted text...")
    with open(EXTRACTED_TEXT, 'r') as f:
        text = f.read()

    print("Parsing recipes...")
    recipes = parse_recipes_from_text(text)
    print(f"Found {len(recipes)} recipes")

    # Process each recipe
    recipe_num = START_RECIPE_NUM
    processed_recipes = []

    for recipe in recipes:
        print(f"\nProcessing: {recipe['name']}")

        # Match ingredients to foods
        matched_foods = []
        for ingredient in recipe['ingredients_raw']:
            foods_in_ingredient = match_ingredients_to_foods(ingredient, foods, food_lookup)
            matched_foods.extend(foods_in_ingredient)

        # Remove duplicates while preserving order
        matched_foods = list(dict.fromkeys(matched_foods))

        # Calculate Daily Dozen coverage
        daily_dozen = calculate_daily_dozen(matched_foods, foods)

        # Extract tweaks
        tweaks = extract_tweaks(matched_foods, foods, recipe)

        # Extract synergies
        synergies = extract_synergies(matched_foods, foods)

        # Determine meal type
        meal_type = determine_meal_type(recipe['name'], recipe.get('page', 0))

        # Create recipe object
        recipe_obj = {
            "id": f"recipe-{recipe_num:03d}",
            "name": recipe['name'],
            "page": recipe.get('page'),
            "meal_type": meal_type,
            "servings": recipe.get('servings', '4'),
            "difficulty": recipe.get('difficulty', 'Moderate'),
            "description": recipe.get('description', ''),
            "ingredients_raw": recipe['ingredients_raw'],
            "instructions": recipe['instructions_raw'],
            "foods_used": matched_foods,
            "daily_dozen_coverage": daily_dozen,
            "tweaks_incorporated": tweaks,
            "synergies": synergies
        }

        # Save to JSON file
        output_file = OUTPUT_DIR / f"recipe-{recipe_num:03d}.json"
        with open(output_file, 'w') as f:
            json.dump(recipe_obj, f, indent=2)

        print(f"  - Page: {recipe['page']}")
        print(f"  - Foods matched: {len(matched_foods)}")
        print(f"  - Daily Dozen: {len(daily_dozen)} categories")
        print(f"  - Tweaks: {len(tweaks)}")
        print(f"  - Synergies: {len(synergies)}")
        print(f"  - Saved to: {output_file}")

        processed_recipes.append(recipe_obj)
        recipe_num += 1

    # Create summary
    summary = {
        "total_recipes": len(processed_recipes),
        "page_range": "201-270",
        "recipes_by_meal_type": {
            "breakfast": len([r for r in processed_recipes if r['meal_type'] == 'breakfast']),
            "lunch": len([r for r in processed_recipes if r['meal_type'] == 'lunch']),
            "dinner": len([r for r in processed_recipes if r['meal_type'] == 'dinner'])
        },
        "recipes_by_difficulty": {
            "Easy": len([r for r in processed_recipes if r['difficulty'] == 'Easy']),
            "Moderate": len([r for r in processed_recipes if r['difficulty'] == 'Moderate']),
            "Difficult": len([r for r in processed_recipes if r['difficulty'] == 'Difficult'])
        },
        "recipe_ids": [r['id'] for r in processed_recipes],
        "recipe_names": [r['name'] for r in processed_recipes]
    }

    summary_file = OUTPUT_DIR / "summary_201_270.json"
    with open(summary_file, 'w') as f:
        json.dump(summary, f, indent=2)

    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    print(f"Total recipes extracted: {summary['total_recipes']}")
    print(f"\nBy meal type:")
    for meal, count in summary['recipes_by_meal_type'].items():
        print(f"  {meal.capitalize()}: {count}")
    print(f"\nBy difficulty:")
    for diff, count in summary['recipes_by_difficulty'].items():
        print(f"  {diff}: {count}")
    print(f"\nSummary saved to: {summary_file}")
    print(f"\nRecipe files saved in: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
