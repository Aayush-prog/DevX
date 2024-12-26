import os
from pdf2image import convert_from_path
import pytesseract

# Folder containing PDF files
folder_path = 'D:/DevX/model/data/resume'

# Iterate through all PDF files in the folder
for file_name in os.listdir(folder_path):
    if file_name.endswith('.pdf'):  # Process only PDF files
        # Full path to the PDF file
        pdf_path = os.path.join(folder_path, file_name)
        
        # Convert PDF to a list of images (pages)
        pages = convert_from_path(pdf_path, 300)  # 300 DPI
        
        # Prepare the output text file with the same name as the PDF
        text_output_path = os.path.join(folder_path, f'{os.path.splitext(file_name)[0]}.txt')
        
        # Initialize a variable to hold all extracted text
        all_text = ''
        
        # Loop through each page (image) and extract text using Tesseract
        for page_num, page in enumerate(pages):
            text = pytesseract.image_to_string(page)  # Extract text from image
            all_text += f'--- Page {page_num + 1} ---\n'
            all_text += text + '\n'
        
        # Save the extracted text to a .txt file
        with open(text_output_path, 'w') as text_file:
            text_file.write(all_text)
        
        print(f"Text extracted and saved for {file_name} as {text_output_path}")
