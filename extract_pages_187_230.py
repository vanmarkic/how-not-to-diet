import PyPDF2
import sys
import glob

pdf_files = glob.glob('/Users/dragan/Documents/how-not-to-diet/*.pdf')
pdf_files = [f for f in pdf_files if not f.endswith('.pdf') or 'Anna' in f]
pdf_path = pdf_files[0] if pdf_files else None

if not pdf_path:
    print("No PDF found!", file=sys.stderr)
    sys.exit(1)

print(f"Using PDF: {pdf_path}", file=sys.stderr)

try:
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        print(f'Total pages: {len(reader.pages)}')

        # Extract pages 187-230 (0-indexed: 186-229)
        for page_num in range(186, 230):
            if page_num < len(reader.pages):
                page = reader.pages[page_num]
                text = page.extract_text()
                print(f'\n=== PAGE {page_num + 1} ===')
                print(text)
except Exception as e:
    print(f'Error: {e}')
    sys.exit(1)
