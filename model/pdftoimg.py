import os
from pdf2image import convert_from_path

# Input and output folder paths
input_folder = "D:/DevX/model/data/resume/pdfs"
output_folder = "D:/DevX/model/data/resume/imgs"

# Ensure output folder exists
os.makedirs(output_folder, exist_ok=True)

# Iterate through all PDFs in the input folder
for filename in os.listdir(input_folder):
    if filename.endswith(".pdf"):
        pdf_path = os.path.join(input_folder, filename)
        
        # Convert PDF to images
        try:
            images = convert_from_path(pdf_path)
            for i, image in enumerate(images):
                # Create a unique filename for each image
                image_filename = f"{os.path.splitext(filename)[0]}_page_{i + 1}.png"
                image_path = os.path.join(output_folder, image_filename)
                
                # Save the image
                image.save(image_path, "PNG")
                print(f"Saved: {image_path}")
        except Exception as e:
            print(f"Error processing {filename}: {e}")
