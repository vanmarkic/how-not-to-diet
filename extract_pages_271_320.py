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

        # Extract pages 271-320
        start_page = 270  # 0-indexed, so page 271 is index 270
        end_page = min(320, total_pages)

        for i in range(start_page, end_page):
            text = pdf.pages[i].extract_text()
            if text:
                print(f'\n{"="*80}')
                print(f'PAGE {i+1}')
                print("="*80)
                print(text)

except Exception as e:
    print(f"Error with PyPDF2: {e}", file=sys.stderr)
    try:
        import pdfplumber

        with pdfplumber.open(pdf_path) as pdf:
            total_pages = len(pdf.pages)
            print(f'Total pages: {total_pages}', file=sys.stderr)

            start_page = 270
            end_page = min(320, total_pages)

            for i in range(start_page, end_page):
                text = pdf.pages[i].extract_text()
                if text:
                    print(f'\n{"="*80}')
                    print(f'PAGE {i+1}')
                    print("="*80)
                    print(text)

    except ImportError:
        print("Error: Neither PyPDF2 nor pdfplumber is installed", file=sys.stderr)
        sys.exit(1)
