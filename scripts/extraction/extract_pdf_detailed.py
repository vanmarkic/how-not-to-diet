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
        total_pages = len(pdf.pages)
        print(f'Total pages: {total_pages}', file=sys.stderr)

        # Search for the specific sections in first 100 pages
        for i in range(min(100, total_pages)):
            text = pdf.pages[i].extract_text()
            text_lower = text.lower()

            # Look for specific section headers
            if any(keyword in text_lower for keyword in [
                'low glycemic',
                'glycemic load',
                'low in calorie density',
                'calorie density',
                'ingredients for the ideal weight-loss diet'
            ]):
                print(f'\n{"="*80}')
                print(f'PAGE {i+1}')
                print("="*80)
                print(text)

except ImportError:
    try:
        import pdfplumber

        with pdfplumber.open(pdf_path) as pdf:
            total_pages = len(pdf.pages)
            print(f'Total pages: {total_pages}', file=sys.stderr)

            for i in range(min(100, total_pages)):
                text = pdf.pages[i].extract_text()
                if not text:
                    continue

                text_lower = text.lower()

                if any(keyword in text_lower for keyword in [
                    'low glycemic',
                    'glycemic load',
                    'low in calorie density',
                    'calorie density',
                    'ingredients for the ideal weight-loss diet'
                ]):
                    print(f'\n{"="*80}')
                    print(f'PAGE {i+1}')
                    print("="*80)
                    print(text)

    except ImportError:
        print("Error: Neither PyPDF2 nor pdfplumber is installed", file=sys.stderr)
        sys.exit(1)
