import os
import pytesseract
from PIL import Image
import pandas as pd
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk

# Ensure NLTK stopwords are downloaded
nltk.download('stopwords')
nltk.download('punkt')

def extract_text_from_image(image_path):
    try:
        text = pytesseract.image_to_string(Image.open(image_path))
        return text
    except Exception as e:
        print(f"Error processing image {image_path}: {e}")
        return ""

def clean_text(text):
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    # Convert to lowercase
    text = text.lower()
    # Tokenize text
    words = word_tokenize(text)
    # Remove stopwords
    filtered_words = [word for word in words if word not in stopwords.words('english')]
    return ' '.join(filtered_words)

def process_resumes(folder_path):
    data = []

    # Loop through subfolders
    for category in os.listdir(folder_path):
        category_path = os.path.join(folder_path, category)

        if os.path.isdir(category_path):
            # Loop through images in subfolder
            for file_name in os.listdir(category_path):
                file_path = os.path.join(category_path, file_name)

                if file_name.lower().endswith(('png', 'jpg', 'jpeg')):
                    # Extract and clean text
                    raw_text = extract_text_from_image(file_path)
                    cleaned_text = clean_text(raw_text)

                    # Append to data list
                    data.append({
                        'Category': category,
                        'Extracted Text': cleaned_text
                    })

    # Convert data to DataFrame and save to CSV
    df = pd.DataFrame(data)
    output_csv_path = os.path.join(folder_path, 'processed_resumes.csv')
    df.to_csv(output_csv_path, index=False)
    print(f"Processed data saved to {output_csv_path}")

if __name__ == "__main__":
    # Replace 'resume_datasets' with your folder path
    folder_path = "Resumes Datasets"
    process_resumes(folder_path)