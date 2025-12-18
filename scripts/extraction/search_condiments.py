#!/usr/bin/env python3
import PyPDF2
import json
import re

# PDF path
import glob
pdf_files = glob.glob("*Cookbook*.pdf")
pdf_path = [f for f in pdf_files if 'Cookbook' in f and not f.startswith('.')][0]
print(f"Using PDF: {pdf_path}")

# Search terms
search_terms = [
    'mustard', 'soy sauce', 'tamari', 'balsamic', 'apple cider vinegar',
    'tomato paste', 'vegetable broth', 'vegetable stock', 'miso paste',
    'natto', 'umeboshi', 'dulse', 'wakame', 'kombu',
    'date sugar', 'molasses', 'tahini', 'nutritional yeast'
]

results = {}
for term in search_terms:
    results[term] = {'pages': [], 'contexts': []}

with open(pdf_path, 'rb') as file:
    pdf_reader = PyPDF2.PdfReader(file)
    total_pages = len(pdf_reader.pages)

    print(f"Searching {total_pages} pages...")

    for page_num in range(total_pages):
        page = pdf_reader.pages[page_num]
        text = page.extract_text()
        text_lower = text.lower()

        for term in search_terms:
            if term.lower() in text_lower:
                page_number = page_num + 1
                if page_number not in results[term]['pages']:
                    results[term]['pages'].append(page_number)

                    # Try to get context around the term
                    pattern = re.compile(r'.{0,100}' + re.escape(term) + r'.{0,100}', re.IGNORECASE)
                    matches = pattern.findall(text)
                    if matches and len(results[term]['contexts']) < 3:
                        results[term]['contexts'].append({
                            'page': page_number,
                            'text': matches[0].strip()
                        })

# Print results
print("\n" + "="*80)
print("SEARCH RESULTS")
print("="*80)

for term in sorted(search_terms):
    if results[term]['pages']:
        print(f"\n{term.upper()}")
        print(f"  Found on pages: {results[term]['pages'][:20]}")
        print(f"  Total occurrences: {len(results[term]['pages'])}")

        if results[term]['contexts']:
            print(f"  Sample contexts:")
            for ctx in results[term]['contexts'][:2]:
                print(f"    Page {ctx['page']}: ...{ctx['text'][:150]}...")

print("\n" + "="*80)
print("\nSUMMARY:")
found_items = [term for term in search_terms if results[term]['pages']]
print(f"Found {len(found_items)} items: {', '.join(found_items)}")
