#!/usr/bin/env python3
import sys
import glob
import json

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

        # Extract pages 1-80 which likely contain the intro and food sections
        for i in range(min(80, total_pages)):
            text = pdf.pages[i].extract_text()
            if text:
                print(f'\n{"="*80}')
                print(f'PAGE {i+1}')
                print("="*80)
                print(text[:4000])  # Limit each page to 4000 chars

except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    try:
        import pdfplumber

        with pdfplumber.open(pdf_path) as pdf:
            total_pages = len(pdf.pages)
            print(f'Total pages: {total_pages}', file=sys.stderr)

            for i in range(min(80, total_pages)):
                text = pdf.pages[i].extract_text()
                if text:
                    print(f'\n{"="*80}')
                    print(f'PAGE {i+1}')
                    print("="*80)
                    print(text[:4000])

    except ImportError:
        print("Error: Neither PyPDF2 nor pdfplumber is installed", file=sys.stderr)
        sys.exit(1)
