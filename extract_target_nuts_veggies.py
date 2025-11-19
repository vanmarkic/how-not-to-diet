#!/usr/bin/env python3
"""
Search for specific nuts/seeds and vegetables in the cookbook PDF
Target foods: hazelnuts, pecans, brazil nuts, hemp seeds, sunflower seeds, poppy seeds,
              eggplant/aubergine, leeks, shallots, artichokes, swiss chard, endive, radicchio
"""
import sys
import glob

# Find PDF file
pdf_files = glob.glob('/Users/dragan/Documents/how-not-to-diet/*.pdf')
pdf_path = pdf_files[0] if pdf_files else None

if not pdf_path:
    print("No PDF found!", file=sys.stderr)
    sys.exit(1)

# Target foods we're looking for
target_foods = [
    'hazelnut', 'filbert',
    'pecan',
    'brazil nut',
    'hemp seed',
    'sunflower seed',
    'poppy seed',
    'eggplant', 'aubergine',
    'leek',
    'shallot',
    'artichoke',
    'swiss chard', 'chard',
    'endive',
    'radicchio'
]

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
        print("Error: Neither PyPDF2 nor pdfplumber is installed", file=sys.stderr)
        sys.exit(1)
