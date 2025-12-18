#!/usr/bin/env python3
import PyPDF2
import glob
import re

# Get PDF path
pdf_files = glob.glob("*Cookbook*.pdf")
pdf_path = [f for f in pdf_files if 'Cookbook' in f and not f.startswith('.')][0]

# Items to extract with their key pages
items = {
    'miso paste': [32, 33, 56, 57],
    'balsamic vinegar': [27, 79, 88, 106],
    'apple cider vinegar': [50, 56, 57, 59],
    'tahini': [19, 79, 103, 104],
    'vegetable broth': [32, 340, 341],
    'kombu': [341, 342, 343],
    'molasses': [378],
    'nutritional yeast': [21, 24, 32, 33],
    'mustard': [88, 153, 154, 186],
    'tomato paste': list(range(40, 200)),  # Search broadly
    'date sugar': list(range(1, 386)),  # Search entire book
    'umeboshi': list(range(1, 386)),
    'natto': list(range(1, 386)),
    'dulse': list(range(1, 386)),
    'wakame': list(range(1, 386)),
}

with open(pdf_path, 'rb') as file:
    pdf_reader = PyPDF2.PdfReader(file)

    for item_name, pages in items.items():
        print(f"\n{'='*80}")
        print(f"{item_name.upper()}")
        print(f"{'='*80}")

        found_pages = []
        contexts = []

        for page_num in pages[:50]:  # Limit to first 50 pages to search
            try:
                page = pdf_reader.pages[page_num - 1]
                text = page.extract_text()
                text_lower = text.lower()

                if item_name.lower() in text_lower:
                    if page_num not in found_pages:
                        found_pages.append(page_num)

                        # Extract context
                        lines = text.split('\n')
                        for i, line in enumerate(lines):
                            if item_name.lower() in line.lower():
                                # Get surrounding lines
                                start = max(0, i - 2)
                                end = min(len(lines), i + 3)
                                context = '\n'.join(lines[start:end])
                                contexts.append((page_num, context))
                                if len(contexts) >= 5:
                                    break

                if len(contexts) >= 5:
                    break
            except:
                continue

        if found_pages:
            print(f"Found on pages: {found_pages[:10]}")
            print(f"\nContexts:")
            for page_num, context in contexts[:5]:
                print(f"\n--- Page {page_num} ---")
                print(context[:500])
        else:
            print("Not found in searched pages")
