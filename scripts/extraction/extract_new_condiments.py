#!/usr/bin/env python3
import PyPDF2
import glob

pdf_files = glob.glob('*Cookbook*.pdf')
pdf_path = [f for f in pdf_files if 'Cookbook' in f and not f.startswith('.')][0]

# Items to extract with their pages
items_to_extract = {
    'vegetable broth': [32, 38, 41, 44, 340, 341, 342, 343],
    'balsamic vinegar': [27, 79, 88, 106, 111],
    'apple cider vinegar': [50, 56, 57, 59, 60],
    'rice vinegar': [91],
    'red wine vinegar': [35, 44, 147],
    'wholegrain mustard': [88, 153, 154],
    'tomato puree': [44, 45, 65, 134, 135, 342],
    'kombu': [341, 342, 343],
}

with open(pdf_path, 'rb') as file:
    reader = PyPDF2.PdfReader(file)

    for item, pages in items_to_extract.items():
        print(f"\n{'='*80}")
        print(f"{item.upper()}")
        print(f"{'='*80}\n")

        contexts = []
        for page_num in pages[:8]:
            try:
                page = reader.pages[page_num - 1]
                text = page.extract_text()

                # Find lines containing the item
                lines = text.split('\n')
                for i, line in enumerate(lines):
                    if item.lower() in line.lower():
                        # Get context
                        start = max(0, i - 1)
                        end = min(len(lines), i + 2)
                        context = '\n'.join(lines[start:end])
                        print(f"Page {page_num}:")
                        print(context)
                        print()
                        contexts.append(page_num)
                        break

            except Exception as e:
                print(f"Error on page {page_num}: {e}")

        print(f"Total pages found: {contexts}")
        print()
