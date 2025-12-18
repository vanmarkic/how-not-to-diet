import PyPDF2
import re
import sys

pdf_path = "/Users/dragan/Documents/how-not-to-diet/cookbook.pdf"

try:
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)

        # Search pages 15-35 for sleep-related content
        sleep_keywords = ['sleep', 'melatonin', 'circadian', 'cherry', 'cherries',
                         'kiwi', 'chamomile', 'passionflower', 'valerian',
                         'banana', 'lavender', 'tryptophan', 'serotonin']

        for page_num in range(15, min(40, len(pdf_reader.pages))):
            page = pdf_reader.pages[page_num]
            text = page.extract_text()

            # Look for sleep-related keywords
            text_lower = text.lower()
            found_keywords = [kw for kw in sleep_keywords if kw in text_lower]

            if found_keywords:
                print(f"\n{'='*80}")
                print(f"PAGE {page_num + 1} - Found: {', '.join(found_keywords)}")
                print(f"{'='*80}")
                print(text)

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
