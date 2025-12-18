# Extraction Scripts

This directory contains Python scripts used to extract data from PDF sources and process food/recipe information.

## Script Categories

### PDF Extraction
- `extract_pdf.py` - Basic PDF text extraction
- `extract_pdf_detailed.py` - Detailed PDF content extraction
- `find_pdf.py` - Utility to locate PDF files

### Page-Specific Extraction
- `extract_all_pages.py` - Extract content from all pages
- `extract_pages_187_230.py` - Extract pages 187-230
- `extract_pages_271_320.py` - Extract pages 271-320
- `extract_final_section.py` - Extract final section of content

### Food Data Extraction
- `extract_food_details.py` - Extract detailed food information
- `extract_food_details_pages.py` - Extract food details from specific pages
- `extract_target_nuts_veggies.py` - Extract target nuts and vegetables
- `extract_ampk_fat_sections.py` - Extract AMPK fat-related sections
- `extract_sleep_foods.py` - Extract sleep-related foods
- `extract_new_condiments.py` - Extract condiment information

### Recipe Extraction
- `extract_recipes.py` - Basic recipe extraction
- `extract_all_recipes_120_200.py` - Extract recipes from pages 120-200
- `manual_recipe_extract.py` - Manual recipe extraction tool
- `parse_recipes_201_270.py` - Parse recipes from pages 201-270

### Special Content
- `extract_21_tweaks.py` - Extract the 21 tweaks from the book
- `extract_details.py` - Extract detailed information

### Search and Analysis
- `search_foods.py` - Search for specific foods
- `search_new_foods.py` - Search for newly added foods
- `search_specific_foods.py` - Search for specific food items
- `search_condiments.py` - Search for condiments
- `analyze_final_section.py` - Analyze final section content

### Food Database Management
- `identify_new_foods.py` - Identify new foods to add
- `check_new_foods.py` - Check for new food entries
- `create_remaining_foods.py` - Create entries for remaining foods

## Usage

These scripts were used during the initial data extraction phase. Most output files are stored in `/data/extraction/`.

**Note:** These scripts contain hardcoded paths from the original extraction process and are preserved for reference. They are not intended for regular use. The extracted data has been processed and is available in structured format in `/data/foods/` and `/data/recipes/`.

See documentation in `/docs/extraction/` for detailed extraction reports and summaries.
