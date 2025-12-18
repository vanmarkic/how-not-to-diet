#!/usr/bin/env python3
import sys

import glob
pdf_files = glob.glob('/Users/dragan/Documents/how-not-to-diet/*.pdf')
pdf_path = pdf_files[0] if pdf_files else None

if not pdf_path:
    print("No PDF found!", file=sys.stderr)
    sys.exit(1)

try:
    import PyPDF2

    with open(pdf_path, 'rb') as file:
        pdf = PyPDF2.PdfReader(file)
        print(f'Total pages: {len(pdf.pages)}', file=sys.stderr)

        # Extract first 80 pages to find the sections
        for i in range(min(80, len(pdf.pages))):
            text = pdf.pages[i].extract_text()
            if text and ('low glycemic' in text.lower() or 'calorie density' in text.lower() or 'ingredients for the ideal' in text.lower()):
                print(f'\n=== PAGE {i+1} ===')
                print(text[:3000])

except ImportError:
    try:
        import pdfplumber

        with pdfplumber.open(pdf_path) as pdf:
            print(f'Total pages: {len(pdf.pages)}', file=sys.stderr)

            for i in range(min(80, len(pdf.pages))):
                text = pdf.pages[i].extract_text()
                if text and ('low glycemic' in text.lower() or 'calorie density' in text.lower() or 'ingredients for the ideal' in text.lower()):
                    print(f'\n=== PAGE {i+1} ===')
                    print(text[:3000])

    except ImportError:
        print("Error: Neither PyPDF2 nor pdfplumber is installed", file=sys.stderr)
        sys.exit(1)
