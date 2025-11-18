#!/usr/bin/env python3
import sys
import glob
import re

pdf_files = glob.glob('/Users/dragan/Documents/how-not-to-diet/*.pdf')
pdf_path = pdf_files[0] if pdf_files else None

if not pdf_path:
    print("No PDF found!", file=sys.stderr)
    sys.exit(1)

# Foods we're looking for that might not be extracted yet
target_foods = [
    'strawberr', 'raspberr', 'blueberr', 'blackberr',
    'grape', 'cherry', 'plum', 'peach', 'nectarine',
    'orange', 'grapefruit', 'mandarin', 'tangerine',
    'pear', 'banana', 'kiwi', 'mango', 'papaya',
    'pineapple', 'melon', 'cantaloupe', 'honeydew',
    'eggplant', 'aubergine', 'courgette', 'squash',
    'leek', 'shallot', 'scallion',
    'radish', 'turnip', 'parsnip', 'beetroot', 'beet',
    'lettuce', 'endive', 'radicchio', 'escarole',
    'swiss chard', 'chard',
    'basil', 'cilantro', 'coriander', 'parsley', 'dill', 'mint',
    'oregano', 'thyme', 'rosemary', 'sage',
    'cinnamon', 'nutmeg', 'clove', 'cardamom',
    'saffron', 'paprika', 'chili',
    'oat bran', 'wheat bran', 'rice bran',
    'buckwheat', 'amaranth', 'millet', 'sorghum', 'teff',
    'rye', 'spelt', 'kamut', 'farro',
    'sunflower', 'hemp', 'poppy',
    'peanut', 'pistachio', 'pecan', 'hazelnut', 'macadamia',
    'brazil nut', 'pine nut',
    'black bean', 'pinto bean', 'kidney bean', 'navy bean',
    'lima bean', 'black-eyed pea', 'split pea',
    'edamame', 'soybean', 'tofu', 'tempeh',
    'mung bean', 'adzuki',
    'kombu', 'nori', 'wakame', 'dulse', 'spirulina', 'chlorella',
    'date', 'fig', 'prune', 'apricot', 'raisin',
    'cranberr', 'elderberr', 'acai', 'mulberr',
    'dragon fruit', 'star fruit', 'persimmon', 'pomegranate',
    'thylakoid', 'chlorophyll',
    'coffee', 'matcha',
    'yacon', 'jicama', 'artichoke', 'jerusalem artichoke'
]

try:
    import PyPDF2

    with open(pdf_path, 'rb') as file:
        pdf = PyPDF2.PdfReader(file)
        total_pages = len(pdf.pages)
        print(f'Total pages: {total_pages}', file=sys.stderr)

        for i in range(total_pages):
            text = pdf.pages[i].extract_text()
            text_lower = text.lower()

            # Check if any target food is mentioned
            found_foods = []
            for food in target_foods:
                if food in text_lower:
                    found_foods.append(food)

            if found_foods:
                print(f'\n{"="*80}')
                print(f'PAGE {i+1} - Found: {", ".join(set(found_foods))}')
                print("="*80)
                print(text)

except ImportError:
    try:
        import pdfplumber

        with pdfplumber.open(pdf_path) as pdf:
            total_pages = len(pdf.pages)
            print(f'Total pages: {total_pages}', file=sys.stderr)

            for i in range(total_pages):
                text = pdf.pages[i].extract_text()
                if not text:
                    continue

                text_lower = text.lower()

                # Check if any target food is mentioned
                found_foods = []
                for food in target_foods:
                    if food in text_lower:
                        found_foods.append(food)

                if found_foods:
                    print(f'\n{"="*80}')
                    print(f'PAGE {i+1} - Found: {", ".join(set(found_foods))}')
                    print("="*80)
                    print(text)

    except ImportError:
        print("Error: Neither PyPDF2 nor pdfplumber is installed", file=sys.stderr)
        sys.exit(1)
