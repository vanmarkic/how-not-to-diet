#!/usr/bin/env python3
import sys
import glob
import re

pdf_files = glob.glob('/Users/dragan/Documents/how-not-to-diet/*.pdf')
pdf_path = pdf_files[0] if pdf_files else None

if not pdf_path:
    print("No PDF found!", file=sys.stderr)
    sys.exit(1)

# Foods to search for (low glycemic and low calorie density foods)
search_foods = [
    'barley', 'lentils', 'chickpeas', 'quinoa', 'sweet potato',
    'apple', 'pear', 'orange', 'grapefruit', 'peach',
    'broccoli', 'cauliflower', 'brussels sprouts', 'spinach', 'arugula',
    'mushrooms', 'peppers', 'tomato', 'cucumber', 'celery',
    'zucchini', 'squash', 'eggplant', 'asparagus', 'lettuce',
    'chia seeds', 'pumpkin seeds', 'walnuts', 'almonds',
    'black beans', 'kidney beans', 'pinto beans', 'split peas',
    'brown rice', 'wild rice', 'oats', 'bulgur',
    'onion', 'garlic', 'ginger', 'cinnamon', 'cumin',
    'avocado', 'nuts', 'seeds', 'herbs', 'tea',
    'strawberries', 'blueberries', 'raspberries', 'blackberries',
    'leafy greens', 'cruciferous', 'whole grains'
]

try:
    import PyPDF2

    with open(pdf_path, 'rb') as file:
        pdf = PyPDF2.PdfReader(file)
        total_pages = len(pdf.pages)
        print(f'Scanning {total_pages} pages...', file=sys.stderr)

        food_mentions = {}

        # Scan all pages
        for i in range(total_pages):
            text = pdf.pages[i].extract_text()
            if not text:
                continue

            text_lower = text.lower()

            # Check for each food
            for food in search_foods:
                if food.lower() in text_lower:
                    if food not in food_mentions:
                        food_mentions[food] = []
                    food_mentions[food].append(i + 1)

        # Print foods found with their page numbers
        print("\nFOODS FOUND:")
        print("="*80)
        for food in sorted(food_mentions.keys()):
            pages = food_mentions[food]
            if len(pages) > 3:  # Only show foods mentioned multiple times
                print(f"{food}: pages {pages[:10]}...")  # First 10 mentions

except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
