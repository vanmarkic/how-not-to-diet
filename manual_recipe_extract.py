#!/usr/bin/env python3
"""Manual extraction of recipes from pages 201-270."""

import json
from pathlib import Path

OUTPUT_DIR = Path("/Users/dragan/Documents/how-not-to-diet/data/recipes")
FOODS_DIR = Path("/Users/dragan/Documents/how-not-to-diet/data/foods")
START_NUM = 30

# Load food database
def load_foods():
    foods = {}
    for food_file in FOODS_DIR.glob("*.json"):
        with open(food_file, 'r') as f:
            food_data = json.load(f)
            foods[food_file.stem] = food_data
    return foods

foods_db = load_foods()

# Manual recipe data based on PDF extraction
recipes_data = [
    {
        "name": "Roasted Kabocha with Kale-Cranberry Stuffing",
        "page": 202,
        "meal_type": "dinner",
        "servings": "4",
        "difficulty": "Moderate",
        "description": "Rather than starchy bread cubes, the stuffing for this dish is made with Basic BROL (Barley, Rye, Oats and Lentils), combined with onion, celery, kale and cranberries.",
        "foods_used": ["kabocha-squash", "kale", "cranberries-dried", "onions", "celery", "barley", "lentils-brown-puy", "thyme-dried", "rosemary-dried", "sage-dried", "black-pepper"],
        "daily_dozen": ["greens", "cruciferous-vegetables", "other-vegetables", "whole-grains", "beans"],
        "tweaks": ["fiber", "intact-whole-grains", "herbs-and-spices"],
        "key_synergies": "Kale + barley + lentils provide complete protein and maximum fiber. Cranberries add antioxidants."
    },
    {
        "name": "Cumin-Roasted Carrots with Chickpeas and Tomatoes",
        "page": 205,
        "meal_type": "dinner",
        "servings": "4",
        "difficulty": "Easy",
        "description": "Savoury roasted vegetables with metabolism-boosting cumin. Roasting time depends on carrot size.",
        "foods_used": ["carrots", "chickpeas", "cherry-tomatoes", "apple-cider-vinegar", "cumin", "coriander-ground", "black-pepper", "parsley-fresh"],
        "daily_dozen": ["other-vegetables", "beans"],
        "tweaks": ["cumin-boost", "vinegar", "herbs-and-spices"],
        "key_synergies": "Cumin (weight-loss booster) + chickpeas + vinegar enhances metabolism. Tomatoes provide lycopene."
    },
    {
        "name": "Sage-Kissed Sweet Potato Wedges with Shallots",
        "page": 208,
        "meal_type": "dinner",
        "servings": "4",
        "difficulty": "Easy",
        "description": "Roasted sweet potatoes made more flavoursome with malt vinegar, cornmeal and spices.",
        "foods_used": ["sweet-potatoes", "apple-cider-vinegar", "smoked-paprika", "sage-dried", "shallots"],
        "daily_dozen": ["other-vegetables"],
        "tweaks": ["vinegar", "herbs-and-spices"],
        "key_synergies": "Sweet potatoes + vinegar for blood sugar control. Sage adds anti-inflammatory benefits."
    },
    {
        "name": "Cottage Pie with Sweet Potato Mash",
        "page": 213,
        "meal_type": "dinner",
        "servings": "4-6",
        "difficulty": "Moderate",
        "description": "Warm, savoury comfort food with sweet potato topping instead of regular mashed potatoes.",
        "foods_used": ["sweet-potatoes", "onions", "carrots", "garlic", "peas", "lentils-brown-puy", "mushrooms-white", "nutritional-yeast", "miso", "thyme-dried", "black-pepper", "celery"],
        "daily_dozen": ["other-vegetables", "beans", "greens"],
        "tweaks": ["fiber", "umami-flavor"],
        "key_synergies": "Lentils + vegetables + mushrooms create rich umami flavor. Sweet potato provides sustained energy."
    },
    {
        "name": "Cornmeal-Crusted Buffalo Tempeh with White Bean Ranch",
        "page": 216,
        "meal_type": "dinner",
        "servings": "4",
        "difficulty": "Moderate",
        "description": "Crispy tempeh with creamy white bean ranch dipping sauce that also makes a great salad dressing.",
        "foods_used": ["tempeh", "white-beans-cannellini", "cashews", "apple-cider-vinegar", "lemon", "onions", "garlic", "miso", "black-pepper", "parsley-fresh", "nutritional-yeast"],
        "daily_dozen": ["beans", "nuts-and-seeds"],
        "tweaks": ["vinegar", "fermented-foods"],
        "key_synergies": "Tempeh (fermented soy) + vinegar + miso for gut health. White beans create creaminess without dairy."
    },
    {
        "name": "Red Bean and Beetroot Cutlets",
        "page": 219,
        "meal_type": "dinner",
        "servings": "6",
        "difficulty": "Moderate",
        "description": "Delicious cutlets perfect on a bed of greens, topped with sauce or served cold in lettuce wraps.",
        "foods_used": ["red-beans-kidney", "walnuts", "quinoa", "beetroot", "onions", "nutritional-yeast", "flaxseeds-ground", "chia-seeds", "miso", "smoked-paprika", "garlic", "black-pepper"],
        "daily_dozen": ["beans", "nuts-and-seeds", "whole-grains"],
        "tweaks": ["fiber", "omega-3-fatty-acids"],
        "key_synergies": "Beans + walnuts + flax/chia provide complete protein and omega-3s. Beets boost athletic performance."
    },
    {
        "name": "Persian Black-Eyed Beans and Greens",
        "page": 222,
        "meal_type": "dinner",
        "servings": "4",
        "difficulty": "Moderate",
        "description": "Fragrant spices turn simple beans and greens into something special.",
        "foods_used": ["black-eyed-peas", "kale", "collard-greens", "onions", "carrots", "miso", "coriander-ground", "cumin", "turmeric", "black-pepper", "cardamom", "cinnamon", "lemon"],
        "daily_dozen": ["beans", "greens", "cruciferous-vegetables", "other-vegetables"],
        "tweaks": ["cumin-boost", "black-pepper-turmeric", "herbs-and-spices"],
        "key_synergies": "Black-eyed peas + greens + cumin/turmeric for anti-inflammatory benefits. Multiple spices amplify effects."
    },
    {
        "name": "Butternut-Black Bean Chilli",
        "page": 225,
        "meal_type": "dinner",
        "servings": "6",
        "difficulty": "Easy",
        "description": "Black beans marry chunks of butternut squash in this delicious chilli.",
        "foods_used": ["black-beans", "butternut-squash", "onions", "bell-peppers", "garlic", "cherry-tomatoes", "turmeric", "black-pepper"],
        "daily_dozen": ["beans", "other-vegetables"],
        "tweaks": ["black-pepper-turmeric", "herbs-and-spices"],
        "key_synergies": "Black beans + squash for sustained energy. Turmeric + black pepper for enhanced absorption."
    },
    {
        "name": "BBQ Tempeh with Sweet Potatoes and Collards",
        "page": 228,
        "meal_type": "dinner",
        "servings": "4",
        "difficulty": "Moderate",
        "description": "Smoky BBQ tempeh with roasted sweet potatoes and sautéed collard greens.",
        "foods_used": ["tempeh", "sweet-potatoes", "collard-greens", "onions", "garlic", "apple-cider-vinegar", "smoked-paprika", "black-pepper"],
        "daily_dozen": ["beans", "greens", "cruciferous-vegetables", "other-vegetables"],
        "tweaks": ["vinegar", "fermented-foods", "herbs-and-spices"],
        "key_synergies": "Tempeh + collards + vinegar for gut and metabolic health. Sweet potatoes provide beta-carotene."
    },
    {
        "name": "Black Lentil Dal",
        "page": 232,
        "meal_type": "dinner",
        "servings": "4-6",
        "difficulty": "Easy",
        "description": "Rich, creamy dal made with black lentils and aromatic spices.",
        "foods_used": ["lentils-black-beluga", "onions", "garlic", "ginger", "cherry-tomatoes", "turmeric", "cumin", "coriander-ground", "black-pepper", "lemon"],
        "daily_dozen": ["beans", "other-vegetables"],
        "tweaks": ["cumin-boost", "black-pepper-turmeric", "herbs-and-spices"],
        "key_synergies": "Black lentils + cumin + turmeric for anti-inflammatory and weight-loss benefits. Ginger aids digestion."
    },
    {
        "name": "African Red Bean and Sweet Potato Stew",
        "page": 235,
        "meal_type": "dinner",
        "servings": "6",
        "difficulty": "Easy",
        "description": "Hearty African-inspired stew with red beans, sweet potatoes and peanut butter.",
        "foods_used": ["red-beans-kidney", "sweet-potatoes", "onions", "garlic", "ginger", "cherry-tomatoes", "kale", "peanut-butter-natural", "cumin", "coriander-ground", "black-pepper"],
        "daily_dozen": ["beans", "other-vegetables", "greens", "nuts-and-seeds"],
        "tweaks": ["cumin-boost", "herbs-and-spices"],
        "key_synergies": "Red beans + sweet potatoes + peanut butter for complete nutrition. Kale adds greens and minerals."
    },
    {
        "name": "Red Curry Chickpeas and Kabocha Squash",
        "page": 238,
        "meal_type": "dinner",
        "servings": "4",
        "difficulty": "Moderate",
        "description": "Thai-inspired curry with chickpeas and kabocha squash in coconut milk.",
        "foods_used": ["chickpeas", "kabocha-squash", "onions", "garlic", "ginger", "cherry-tomatoes", "kale", "cumin", "coriander-ground", "turmeric", "black-pepper"],
        "daily_dozen": ["beans", "other-vegetables", "greens"],
        "tweaks": ["cumin-boost", "black-pepper-turmeric", "herbs-and-spices"],
        "key_synergies": "Chickpeas + kabocha + curry spices for antioxidant power. Kale adds cruciferous benefits."
    },
    {
        "name": "Szechuan Tempeh and Broccoli",
        "page": 244,
        "meal_type": "dinner",
        "servings": "4",
        "difficulty": "Moderate",
        "description": "Spicy Szechuan-style stir-fry with tempeh and broccoli.",
        "foods_used": ["tempeh", "broccoli", "onions", "bell-peppers", "carrots", "garlic", "ginger", "mushrooms-white", "miso", "apple-cider-vinegar", "black-pepper"],
        "daily_dozen": ["beans", "cruciferous-vegetables", "other-vegetables"],
        "tweaks": ["vinegar", "fermented-foods", "cruciferous-vegetables"],
        "key_synergies": "Tempeh + broccoli for complete protein and sulforaphane. Vinegar + miso for gut health."
    },
    {
        "name": "Vegetable Paella with Golden Barley",
        "page": 247,
        "meal_type": "dinner",
        "servings": "4-6",
        "difficulty": "Easy",
        "description": "Spanish-inspired paella using pot barley instead of rice, with turmeric for golden color.",
        "foods_used": ["barley", "white-beans-cannellini", "onions", "garlic", "bell-peppers", "cherry-tomatoes", "peas", "smoked-paprika", "turmeric", "black-pepper", "parsley-fresh", "lemon"],
        "daily_dozen": ["whole-grains", "beans", "other-vegetables"],
        "tweaks": ["intact-whole-grains", "black-pepper-turmeric", "herbs-and-spices"],
        "key_synergies": "Barley + beans for sustained energy and fiber. Turmeric + black pepper for anti-inflammatory benefits."
    },
    {
        "name": "Great Grain Tart",
        "page": 250,
        "meal_type": "dinner",
        "servings": "6",
        "difficulty": "Moderate",
        "description": "Delicious way to use leftover whole grains with mushrooms, greens and white beans.",
        "foods_used": ["oat-groats-whole-intact-oats", "quinoa", "millet", "white-beans-cannellini", "mushrooms-white", "bell-peppers", "onions", "garlic", "chard", "nutritional-yeast", "flaxseeds-ground", "miso", "smoked-paprika", "thyme-dried", "black-pepper"],
        "daily_dozen": ["whole-grains", "beans", "other-vegetables", "greens", "nuts-and-seeds"],
        "tweaks": ["intact-whole-grains", "omega-3-fatty-acids", "umami-flavor"],
        "key_synergies": "Multiple whole grains + beans provide complete protein. Flax adds omega-3s. Mushrooms create umami."
    },
    {
        "name": "Baked Grain Loaf with Umami Gravy",
        "page": 256,
        "meal_type": "dinner",
        "servings": "6-8",
        "difficulty": "Moderate",
        "description": "Hearty grain and vegetable loaf with rich umami gravy.",
        "foods_used": ["lentils-brown-puy", "quinoa", "oat-groats-whole-intact-oats", "mushrooms-white", "onions", "celery", "carrots", "garlic", "nutritional-yeast", "flaxseeds-ground", "miso", "thyme-dried", "sage-dried", "black-pepper"],
        "daily_dozen": ["beans", "whole-grains", "other-vegetables", "nuts-and-seeds"],
        "tweaks": ["intact-whole-grains", "omega-3-fatty-acids", "umami-flavor"],
        "key_synergies": "Lentils + whole grains + flax for complete nutrition. Mushrooms + miso create rich umami flavor."
    },
    {
        "name": "Stuffed Winter Squash with Millet and Kale",
        "page": 262,
        "meal_type": "dinner",
        "servings": "4",
        "difficulty": "Moderate",
        "description": "Winter squash stuffed with millet, kale and savory seasonings.",
        "foods_used": ["butternut-squash", "millet", "kale", "onions", "garlic", "mushrooms-white", "cranberries-dried", "walnuts", "thyme-dried", "sage-dried", "black-pepper"],
        "daily_dozen": ["whole-grains", "greens", "cruciferous-vegetables", "other-vegetables", "nuts-and-seeds", "berries"],
        "tweaks": ["intact-whole-grains", "herbs-and-spices"],
        "key_synergies": "Millet + kale in squash provides complete nutrition. Cranberries add antioxidants. Walnuts provide omega-3s."
    },
    {
        "name": "Teff and Black Lentils over Berbere-Spiced Kale",
        "page": 268,
        "meal_type": "dinner",
        "servings": "4",
        "difficulty": "Moderate",
        "description": "Ethiopian-inspired dish with teff, black lentils and berbere-spiced kale.",
        "foods_used": ["teff", "lentils-black-beluga", "kale", "onions", "garlic", "ginger", "cumin", "coriander-ground", "turmeric", "black-pepper", "cayenne-pepper", "lemon"],
        "daily_dozen": ["whole-grains", "beans", "greens", "cruciferous-vegetables"],
        "tweaks": ["intact-whole-grains", "cumin-boost", "black-pepper-turmeric", "herbs-and-spices"],
        "key_synergies": "Teff + lentils provide complete protein and iron. Berbere spices boost metabolism. Kale adds sulforaphane."
    },
]

# Generate JSON files
def main():
    print(f"Generating {len(recipes_data)} recipe JSON files...")

    for idx, recipe in enumerate(recipes_data):
        recipe_num = START_NUM + idx
        recipe_id = f"recipe-{recipe_num:03d}"

        # Create recipe object
        recipe_obj = {
            "id": recipe_id,
            "name": recipe["name"],
            "page": recipe["page"],
            "meal_type": recipe["meal_type"],
            "servings": recipe["servings"],
            "difficulty": recipe["difficulty"],
            "description": recipe["description"],
            "foods_used": recipe["foods_used"],
            "daily_dozen_coverage": recipe["daily_dozen"],
            "tweaks_incorporated": recipe["tweaks"],
            "key_synergies": recipe["key_synergies"]
        }

        # Save to file
        output_file = OUTPUT_DIR / f"{recipe_id}.json"
        with open(output_file, 'w') as f:
            json.dump(recipe_obj, f, indent=2)

        print(f"  {recipe_num}. {recipe['name']} (page {recipe['page']}) -> {output_file.name}")

    # Create summary
    summary = {
        "page_range": "201-270",
        "total_recipes": len(recipes_data),
        "recipes_by_meal_type": {
            "breakfast": 0,
            "lunch": 0,
            "dinner": len([r for r in recipes_data if r["meal_type"] == "dinner"])
        },
        "recipes_by_difficulty": {
            "Easy": len([r for r in recipes_data if r["difficulty"] == "Easy"]),
            "Moderate": len([r for r in recipes_data if r["difficulty"] == "Moderate"]),
            "Difficult": 0
        },
        "recipe_list": [{"id": f"recipe-{START_NUM + i:03d}", "name": r["name"], "page": r["page"]} for i, r in enumerate(recipes_data)]
    }

    summary_file = OUTPUT_DIR / "summary_201_270.json"
    with open(summary_file, 'w') as f:
        json.dump(summary, f, indent=2)

    print(f"\n{'='*70}")
    print("SUMMARY - Pages 201-270")
    print(f"{'='*70}")
    print(f"Total recipes: {summary['total_recipes']}")
    print(f"\nBy meal type:")
    for meal_type, count in summary['recipes_by_meal_type'].items():
        if count > 0:
            print(f"  {meal_type.capitalize()}: {count}")
    print(f"\nBy difficulty:")
    for difficulty, count in summary['recipes_by_difficulty'].items():
        if count > 0:
            print(f"  {difficulty}: {count}")
    print(f"\nSummary saved to: {summary_file}")

if __name__ == "__main__":
    main()
