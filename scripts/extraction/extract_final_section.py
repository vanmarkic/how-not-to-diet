#!/usr/bin/env python3
"""Extract foods from pages 321-386 of the cookbook PDF."""

import PyPDF2
import json
import os
import re
import glob

# Path to PDF - use glob to handle special characters
pdf_files = glob.glob("*.pdf")
pdf_files = [f for f in pdf_files if "How Not to Diet Cookbook" in f and "Anna" in f]
if not pdf_files:
    raise FileNotFoundError("PDF not found")
pdf_path = pdf_files[0]
print(f"Using PDF: {pdf_path}")

# Extract text from specified pages
def extract_pages(pdf_path, start_page, end_page):
    """Extract text from PDF pages (1-indexed)."""
    text_by_page = {}

    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)

        # Convert to 0-indexed
        for page_num in range(start_page - 1, end_page):
            if page_num < len(pdf_reader.pages):
                page = pdf_reader.pages[page_num]
                text = page.extract_text()
                text_by_page[page_num + 1] = text

    return text_by_page

# Get existing foods
def get_existing_foods():
    """Get list of existing food names from data/foods/."""
    existing_foods = set()
    foods_dir = "data/foods"

    if os.path.exists(foods_dir):
        for filename in os.listdir(foods_dir):
            if filename.endswith('.json'):
                # Extract food name from filename (remove .json)
                food_name = filename.replace('.json', '').replace('-', ' ')
                existing_foods.add(food_name.lower())

    return existing_foods

# Main extraction
print("Extracting pages 321-386...")
text_by_page = extract_pages(pdf_path, 321, 386)

print(f"Extracted {len(text_by_page)} pages")

# Get existing foods
existing_foods = get_existing_foods()
print(f"Found {len(existing_foods)} existing foods")

# Save extracted text for analysis
output_file = "pages_321_386_content.txt"
with open(output_file, 'w', encoding='utf-8') as f:
    for page_num in sorted(text_by_page.keys()):
        f.write(f"\n{'='*80}\n")
        f.write(f"PAGE {page_num}\n")
        f.write(f"{'='*80}\n\n")
        f.write(text_by_page[page_num])
        f.write("\n")

print(f"Text saved to {output_file}")

# Print first few pages to see structure
print("\n" + "="*80)
print("PREVIEW OF FIRST PAGE:")
print("="*80)
first_page = sorted(text_by_page.keys())[0]
print(f"\nPage {first_page}:")
print(text_by_page[first_page][:1000] + "...")
