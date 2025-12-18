import PyPDF2
import sys
import glob

pdf_files = glob.glob('/Users/dragan/Documents/how-not-to-diet/*.pdf')
pdf_files = [f for f in pdf_files if 'Anna' in f]
pdf_path = pdf_files[0] if pdf_files else None

if not pdf_path:
    print("No PDF found!", file=sys.stderr)
    sys.exit(1)

# Extract specific pages that might have nutritional info
# Based on search: fenugreek (169-170), nutmeg (222-223, 294-295), sage (41, 121, 162, 178-179), millet (219, 246, 250-255)
pages_to_extract = [41, 121, 162, 169, 170, 178, 179, 246, 250, 251, 252, 253, 254, 255, 294, 295]

try:
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)

        for page_num in pages_to_extract:
            if page_num - 1 < len(reader.pages):
                page = reader.pages[page_num - 1]  # 0-indexed
                text = page.extract_text()
                print(f'\n=== PAGE {page_num} ===')
                print(text)

except Exception as e:
    print(f'Error: {e}', file=sys.stderr)
    sys.exit(1)
