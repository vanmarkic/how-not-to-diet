#!/usr/bin/env python3
"""Extract recipes from pages 201-270 of the cookbook PDF."""

import PyPDF2
import json
import os
import re
from pathlib import Path

def extract_text_from_pdf(pdf_path, start_page, end_page):
    """Extract text from specified page range."""
    text_by_page = {}

    # Use Path to handle special characters
    pdf_path = Path(pdf_path)

    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        
        # Pages are 0-indexed in PyPDF2
        for page_num in range(start_page - 1, min(end_page, len(pdf_reader.pages))):
            page = pdf_reader.pages[page_num]
            text = page.extract_text()
            text_by_page[page_num + 1] = text
    
    return text_by_page

def main():
    # Find the PDF file
    base_dir = Path("/Users/dragan/Documents/how-not-to-diet")
    pdf_files = list(base_dir.glob("*.pdf"))

    # Use the real PDF (not the symlink)
    pdf_path = None
    for pdf in pdf_files:
        if pdf.is_file() and not pdf.is_symlink():
            pdf_path = pdf
            break

    if not pdf_path:
        print("ERROR: Could not find PDF file")
        return

    print(f"Using PDF: {pdf_path}")

    # Extract pages 201-270
    print("Extracting text from pages 201-270...")
    text_by_page = extract_text_from_pdf(pdf_path, 201, 270)

    # Save to file for analysis
    output_path = "/Users/dragan/Documents/how-not-to-diet/pages_201_270.txt"
    with open(output_path, 'w', encoding='utf-8') as f:
        for page_num in sorted(text_by_page.keys()):
            f.write(f"\n{'='*80}\n")
            f.write(f"PAGE {page_num}\n")
            f.write(f"{'='*80}\n\n")
            f.write(text_by_page[page_num])
            f.write("\n")
    
    print(f"Text extracted to: {output_path}")
    print(f"Pages extracted: {len(text_by_page)}")

if __name__ == "__main__":
    main()
