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

        # Extract pages 15-30 for detailed 21 Tweaks content
        for i in range(15, min(35, total_pages)):
            text = pdf.pages[i].extract_text()
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

            for i in range(15, min(35, total_pages)):
                text = pdf.pages[i].extract_text()
                if text:
                    print(f'\n{"="*80}')
                    print(f'PAGE {i+1}')
                    print("="*80)
                    print(text)

    except ImportError:
        print("Error: Neither PyPDF2 nor pdfplumber is installed", file=sys.stderr)
        sys.exit(1)
