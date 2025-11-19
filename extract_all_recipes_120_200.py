#!/usr/bin/env python3
"""
Extract all recipes from pages 120-200 of the How Not to Diet Cookbook
Creates structured JSON files with food matches, Daily Dozen, and synergies
"""
import json
import re
import glob
import os
from collections import defaultdict

# === CONFIGURATION ===
BASE_DIR = '/Users/dragan/Documents/how-not-to-diet'
FOODS_DIR = f'{BASE_DIR}/data/foods'
RECIPES_DIR = f'{BASE_DIR}/data/recipes'
PAGES_FILE = f'{BASE_DIR}/pages_120_200.txt'

# Food matching keywords (comprehensive list)
FOOD_KEYWORDS = {
    'kale': 'kale', 'cavolo nero': 'cavolo-nero', 'beans': 'beans-legumes',
    'cannellini': 'white-beans-cannellini', 'white beans': 'white-beans-cannellini',
    'chickpeas': 'chickpeas', 'black beans': 'black-beans', 'lentils': 'lentils-brown-puy',
    'mushroom': 'portobello-mushrooms', 'portobello': 'portobello-mushrooms',
    'shiitake': 'mushrooms-shiitake', 'garlic': 'garlic', 'onion': 'onions',
    'turmeric': 'turmeric', 'ginger': 'ginger', 'vinegar': 'vinegar-all-types',
    'balsamic vinegar': 'vinegar-all-types', 'apple cider vinegar': 'vinegar-all-types',
    'red wine vinegar': 'vinegar-all-types', 'white balsamic vinegar': 'vinegar-all-types',
    'nutritional yeast': 'nutritional-yeast', 'flaxseed': 'flaxseeds-ground',
    'ground flaxseed': 'flaxseeds-ground', 'chia seed': 'chia-seeds',
    'cauliflower': 'cauliflower', 'broccoli': 'broccoli', 'asparagus': 'asparagus',
    'sweet potato': 'sweet-potatoes', 'carrot': 'carrots', 'tomato': 'tomatoes-all-types',
    'cherry tomato': 'cherry-tomatoes', 'bell pepper': 'bell-peppers',
    'red pepper': 'bell-peppers-raw', 'courgette': 'zucchini-courgette',
    'basil': 'fresh-herbs', 'parsley': 'fresh-herbs', 'coriander': 'fresh-herbs',
    'rosemary': 'fresh-herbs', 'sage': 'fresh-herbs', 'rocket': 'greens-low-oxalate',
    'spinach': 'spinach', 'avocado': 'avocado', 'lemon': 'lemon', 'pumpkin': 'pumpkin',
    'quinoa': 'quinoa', 'oats': 'oat-groats-whole-intact-oats',
    'rolled oats': 'oat-groats-whole-intact-oats', 'barley': 'pot-barley-groats',
    'green beans': 'green-beans', 'peanut': 'peanuts', 'peanut butter': 'peanuts',
    'walnut': 'walnuts', 'almond': 'almonds', 'cashew': 'cashews',
    'pistachio': 'pistachios', 'brazil nut': 'brazil-nuts', 'pumpkin seed': 'pumpkin-seeds',
    'cucumber': 'cucumber', 'celery': 'celery', 'bean sprout': 'bean-sprouts',
    'tempeh': 'tempeh', 'miso': 'miso', 'cabbage': 'cabbage',
    'napa cabbage': 'napa-cabbage', 'brussels sprout': 'brussels-sprouts',
    'bok choy': 'bok-choy', 'collard': 'collard-greens', 'mustard green': 'mustard-greens',
    'parsnip': 'parsnips', 'potato': 'potatoes-white', 'beetroot': 'beets-beetroot',
    'beet': 'beets-beetroot', 'artichoke': 'artichokes', 'black pepper': 'black-pepper',
    'cayenne': 'cayenne-pepper', 'red pepper flakes': 'crushed-red-pepper-flakes',
    'cumin': 'cumin', 'cinnamon': 'cinnamon', 'oregano': 'oregano-dried',
    'nigella seed': 'nigella-seeds-black-cumin', 'garlic powder': 'garlic-powder',
    'onion powder': 'onion-powder', 'paprika': 'smoked-paprika',
    'smoked paprika': 'smoked-paprika', 'spaghetti squash': 'spaghetti-squash',
    'butternut squash': 'butternut-squash', 'summer squash': 'summer-squash',
    'yellow squash': 'summer-squash', 'zucchini': 'zucchini-courgette',
    'lettuce': 'lettuce', 'edamame': 'edamame', 'peas': 'peas',
    'green peas': 'peas', 'snow peas': 'mange-tout-snow-peas',
    'mange tout': 'mange-tout-snow-peas', 'lima beans': 'lima-beans',
    'pinto beans': 'pinto-beans', 'navy beans': 'navy-beans',
    'adzuki beans': 'adzuki-beans', 'mung beans': 'mung-beans',
    'black-eyed peas': 'black-eyed-peas'
}

# === FUNCTIONS ===
def load_foods_db():
    """Load all foods from JSON files"""
    foods_db = {}
    food_names_to_id = {}
    
    for food_file in glob.glob(f'{FOODS_DIR}/*.json'):
        try:
            with open(food_file, 'r', encoding='utf-8') as f:
                food_data = json.load(f)
                food_id = os.path.basename(food_file).replace('.json', '')
                food_name = food_data.get('name', '')
                foods_db[food_id] = food_data
                
                if food_name:
                    food_names_to_id[food_name.lower()] = food_id
                    food_names_to_id[food_id] = food_id
        except Exception as e:
            print(f'Error loading {food_file}: {e}')
    
    return foods_db, food_names_to_id

def load_pages():
    """Load extracted pages"""
    with open(PAGES_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    page_blocks = re.split(r'={80}\nPAGE (\d+)\n={80}\n', content)[1:]
    pages = {}
    for i in range(0, len(page_blocks), 2):
        if i+1 < len(page_blocks):
            page_num = int(page_blocks[i])
            page_text = page_blocks[i+1]
            pages[page_num] = page_text
    
    return pages

def find_recipes(pages):
    """Find all recipes in pages"""
    recipe_starts = []
    
    for page_num in sorted(pages.keys()):
        page_text = pages[page_num]
        matches = list(re.finditer(
            r'^([A-Z][A-Z\s\'-]+)\nMAKES:\s*(\d+)\s*(?:to\s*(\d+)\s*)?servings\s*DIFFICULTY:\s*(Easy|Moderate|Advanced)',
            page_text, re.MULTILINE
        ))
        
        for match in matches:
            recipe_name = match.group(1).strip()
            servings_min = int(match.group(2))
            servings_max = int(match.group(3)) if match.group(3) else servings_min
            difficulty = match.group(4).lower()
            
            # Get next 4000 chars for ingredient extraction
            recipe_text = page_text[match.start():match.end()+4000]
            
            recipe_starts.append({
                'name': recipe_name,
                'page': page_num,
                'servings': servings_max if servings_max > servings_min else servings_min,
                'difficulty': difficulty,
                'text': recipe_text
            })
    
    return recipe_starts

def extract_ingredients(recipe_text, foods_db):
    """Extract food ingredients from recipe text"""
    ingredients = set()
    recipe_lower = recipe_text.lower()
    
    # Match against food keywords
    for keyword, food_id in sorted(FOOD_KEYWORDS.items(), key=lambda x: -len(x[0])):
        if keyword in recipe_lower:
            if food_id in foods_db:
                ingredients.add(food_id)
    
    return sorted(list(ingredients))

def determine_meal_type(recipe_name, recipe_text):
    """Determine meal type from recipe name and text"""
    name_lower = recipe_name.lower()
    text_lower = recipe_text[:500].lower()
    
    # Check for pasta/main dishes -> dinner
    if any(word in name_lower for word in ['pasta', 'linguine', 'spaghetti', 'penne', 'gemelli', 'mac', 'noodle']):
        return 'dinner'
    
    # Check for salads -> lunch
    if any(word in name_lower for word in ['salad', 'antipasto']):
        return 'lunch'
    
    # Check for stews -> dinner
    if any(word in name_lower for word in ['stew', 'curry', 'roasted', 'stuffed', 'braised', 'piccata']):
        return 'dinner'
    
    # Default to lunch
    return 'lunch'

def determine_daily_dozen(ingredients, foods_db):
    """Determine Daily Dozen categories covered"""
    categories = set()
    
    for ingredient_id in ingredients:
        if ingredient_id in foods_db:
            food_categories = foods_db[ingredient_id].get('categories', [])
            
            # Beans
            if any(cat in food_categories for cat in ['rich-in-legumes', 'beans']):
                categories.add('beans')
            
            # Greens
            if 'greens' in food_categories:
                categories.add('greens')
            
            # Other vegetables
            if 'rich-in-vegetables' in food_categories:
                categories.add('vegetables')
            
            # Cruciferous
            if 'cruciferous' in food_categories:
                categories.add('cruciferous')
            
            # Nuts and seeds
            if any(cat in food_categories for cat in ['nuts', 'seeds']):
                categories.add('nuts-seeds')
            
            # Whole grains
            if 'whole-grains' in food_categories:
                categories.add('whole-grains')
            
            # Herbs and spices
            if any(cat in food_categories for cat in ['herbs', 'spices']):
                categories.add('herbs-spices')
    
    return sorted(list(categories))

def determine_tweaks(ingredients, recipe_text, foods_db):
    """Determine 21 Tweaks incorporated"""
    tweaks = set()
    text_lower = recipe_text.lower()
    
    # Vinegar
    if 'vinegar' in text_lower:
        tweaks.add('vinegar')
    
    # Anti-inflammatory (turmeric, ginger, garlic, cruciferous)
    anti_inflammatory_foods = ['turmeric', 'ginger', 'garlic', 'cauliflower', 'broccoli', 'kale']
    if any(food in ingredients for food in anti_inflammatory_foods):
        tweaks.add('anti-inflammatory')
    
    # Cumin
    if 'cumin' in ingredients or 'nigella-seeds' in ingredients:
        tweaks.add('cumin')
    
    # Fiber (beans, whole grains)
    if any('beans' in ing or 'lentil' in ing for ing in ingredients):
        tweaks.add('fiber')
    
    # Preload vegetables (raw vegetables)
    if 'rocket' in ingredients or 'lettuce' in ingredients or 'cucumber' in ingredients:
        tweaks.add('preload-vegetables')
    
    # Deflour (whole grains, intact grains)
    if any('groat' in ing or 'whole-grain' in ing or 'quinoa' in ing for ing in ingredients):
        tweaks.add('deflour')
    
    return sorted(list(tweaks))

def identify_synergies(ingredients, foods_db):
    """Identify food synergies and their benefits"""
    synergies = []
    
    # Known synergy combinations
    synergy_pairs = [
        (['kale', 'cavolo-nero'], ['beans-legumes', 'white-beans-cannellini', 'black-beans'], 
         'Greens + beans: Enhanced iron absorption from vitamin C in greens'),
        (['kale', 'cavolo-nero', 'spinach'], ['vinegar-all-types'], 
         'Greens + vinegar: Improved mineral absorption'),
        (['turmeric'], ['black-pepper'], 
         'Turmeric + black pepper: 2000% increase in curcumin absorption'),
        (['beans-legumes', 'lentils'], ['whole-grains', 'quinoa', 'barley'], 
         'Beans + whole grains: Complete protein with complementary amino acids'),
        (['portobello-mushrooms', 'mushrooms-shiitake'], ['garlic', 'onions'], 
         'Mushrooms + alliums: Enhanced immune-boosting properties'),
        (['tomatoes-all-types', 'cherry-tomatoes'], ['avocado'], 
         'Tomatoes + healthy fats: Increased lycopene absorption'),
        (['cruciferous', 'cauliflower', 'broccoli'], ['turmeric'], 
         'Cruciferous + turmeric: Synergistic anti-cancer effects')
    ]
    
    for group1, group2, benefit in synergy_pairs:
        foods1 = [f for f in ingredients if any(g in f for g in group1)]
        foods2 = [f for f in ingredients if any(g in f for g in group2)]
        
        if foods1 and foods2:
            synergies.append({
                'foods': sorted(list(set(foods1 + foods2)))[:4],  # Limit to 4 foods
                'benefit': benefit
            })
    
    return synergies

def create_recipe_json(recipe, recipe_id, foods_db):
    """Create complete recipe JSON structure"""
    # Extract ingredients
    ingredients = extract_ingredients(recipe['text'], foods_db)
    
    # Determine categories
    meal_type = determine_meal_type(recipe['name'], recipe['text'])
    daily_dozen = determine_daily_dozen(ingredients, foods_db)
    tweaks = determine_tweaks(ingredients, recipe['text'], foods_db)
    synergies = identify_synergies(ingredients, foods_db)
    
    return {
        'id': recipe_id,
        'name': recipe['name'].title(),
        'page': recipe['page'],
        'meal_type': meal_type,
        'servings': recipe['servings'],
        'difficulty': recipe['difficulty'],
        'foods': ingredients,
        'daily_dozen': daily_dozen,
        'tweaks': tweaks,
        'synergies': synergies
    }

def main():
    print('\n=== RECIPE EXTRACTION: PAGES 120-200 ===\n')
    
    # Load data
    print('Loading foods database...')
    foods_db, food_names_to_id = load_foods_db()
    print(f'✓ Loaded {len(foods_db)} foods\n')
    
    # Load pages
    print('Loading pages 120-200...')
    pages = load_pages()
    print(f'✓ Loaded {len(pages)} pages\n')
    
    # Find recipes
    print('Finding recipes...')
    recipes = find_recipes(pages)
    print(f'✓ Found {len(recipes)} recipes\n')
    
    # Extract and save each recipe
    print('Extracting recipe details...\n')
    saved_count = 0
    
    for i, recipe in enumerate(recipes, 1):
        recipe_id = f'recipe-{i:03d}'
        
        print(f'{i:2d}. {recipe["name"][:60]:60s} (page {recipe["page"]:3d})')
        
        # Create full recipe JSON
        recipe_json = create_recipe_json(recipe, recipe_id, foods_db)
        
        # Save to file
        output_file = f'{RECIPES_DIR}/{recipe_id}.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(recipe_json, f, indent=2, ensure_ascii=False)
        
        print(f'    ✓ Saved to {recipe_id}.json')
        print(f'      Foods: {len(recipe_json["foods"])}, Daily Dozen: {len(recipe_json["daily_dozen"])}, Tweaks: {len(recipe_json["tweaks"])}, Synergies: {len(recipe_json["synergies"])}')
        
        saved_count += 1
    
    # Summary
    print(f'\n=== SUMMARY ===')
    print(f'Total recipes extracted: {saved_count}')
    print(f'Page range: 120-200')
    print(f'Output directory: {RECIPES_DIR}')
    
    # Generate summary stats
    all_meal_types = defaultdict(int)
    all_difficulties = defaultdict(int)
    
    for recipe_file in glob.glob(f'{RECIPES_DIR}/recipe-*.json'):
        with open(recipe_file, 'r') as f:
            data = json.load(f)
            all_meal_types[data['meal_type']] += 1
            all_difficulties[data['difficulty']] += 1
    
    print(f'\nMeal types:')
    for meal_type, count in sorted(all_meal_types.items()):
        print(f'  - {meal_type.capitalize()}: {count}')
    
    print(f'\nDifficulty levels:')
    for difficulty, count in sorted(all_difficulties.items()):
        print(f'  - {difficulty.capitalize()}: {count}')

if __name__ == '__main__':
    main()
