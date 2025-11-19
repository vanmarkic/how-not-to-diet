import PyPDF2
import sys
import glob
import re

pdf_files = glob.glob('/Users/dragan/Documents/how-not-to-diet/*.pdf')
pdf_files = [f for f in pdf_files if 'Anna' in f]
pdf_path = pdf_files[0] if pdf_files else None

if not pdf_path:
    print("No PDF found!", file=sys.stderr)
    sys.exit(1)

# Search for specific foods
search_terms = ['millet', 'fenugreek', 'nutmeg', 'malt vinegar', 'cornmeal', 'polenta', 'broad bean', 'sage']

try:
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        print(f'Total pages: {len(reader.pages)}', file=sys.stderr)

        results = {term: [] for term in search_terms}

        # Search all pages
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text = page.extract_text().lower()

            for term in search_terms:
                if term.lower() in text:
                    results[term].append(page_num + 1)

        # Print results
        for term, pages in results.items():
            if pages:
                print(f'\n{term.upper()}: Found on pages {pages[:20]}')  # Limit to first 20 occurrences
            else:
                print(f'\n{term.upper()}: Not found')

except Exception as e:
    print(f'Error: {e}', file=sys.stderr)
    sys.exit(1)
