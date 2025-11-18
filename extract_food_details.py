#!/usr/bin/env python3
import sys
import glob

pdf_files = glob.glob('/Users/dragan/Documents/how-not-to-diet/*.pdf')
pdf_path = pdf_files[0] if pdf_files else None

if not pdf_path:
    print("No PDF found!", file=sys.stderr)
    sys.exit(1)

# Pages to extract based on food mentions
pages_to_extract = [8, 9, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
                    26, 27, 31, 32, 33, 35, 41, 42, 44, 47, 50, 51, 53, 54, 56,
                    57, 58, 59, 62, 63, 67, 72, 79, 83, 88, 91, 92, 94, 95, 100,
                    103, 104, 106, 108, 109, 111, 112, 117, 120, 123, 124, 127, 134]

try:
    import PyPDF2

    with open(pdf_path, 'rb') as file:
        pdf = PyPDF2.PdfReader(file)
        total_pages = len(pdf.pages)

        for page_num in pages_to_extract:
            if page_num - 1 < total_pages:
                text = pdf.pages[page_num - 1].extract_text()
                if text:
                    print(f'\n{"="*80}')
                    print(f'PAGE {page_num}')
                    print("="*80)
                    print(text)

except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
