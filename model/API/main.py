from fastapi import FastAPI, Query
import pandas as pd
import re
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from PIL import Image
import pytesseract
import os
import pdf2image
import requests
from io import BytesIO
import torch
from transformers import BertTokenizer, BertForSequenceClassification
import uvicorn

# Initialize FastAPI
app = FastAPI()

# Developer skills 
developer_skills = set([
    "python", "java", "c++", "javascript", "html", "css", "react", "angular",
    "node.js", "django", "flask", "spring", "kotlin", "swift", "typescript",
    "git", "docker", "kubernetes", "sql", "mongodb", "nosql", "aws", "azure",
    "graphql", "tailwindcss", "sass", "less", "next.js", "nuxt.js", "redux",
    "bootstrap", "jquery", "php", "laravel", "rust", "go", "bash", "ruby",
    "perl", "tensorflow", "pytorch", "scikit-learn", "hadoop", "spark",
    "tableau", "powerbi", "matplotlib", "seaborn", "pandas", "numpy",
    "opencv", "unity", "blender", "firebase", "heroku", "gcp", "vagrant",
    "ansible", "terraform", "elasticsearch", "rabbitmq", "solr", "c#", "r",
    "julia", "haskell", "flutter", "dart", "three.js", "chart.js"
])

# Function to extract text from images
def extract_text_from_image(image):
    try:
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        print(f"Error in OCR: {str(e)}")
        return ""

# Function to convert PDF to images and extract text
def extract_text_from_pdf(pdf_bytes):
    try:
        pdf_images = pdf2image.convert_from_bytes(pdf_bytes)
        extracted_text = ""
        for image in pdf_images:
            extracted_text += extract_text_from_image(image)
        return extracted_text
    except Exception as e:
        print(f"Error in PDF to text: {str(e)}")
        return ""

# Function to clean extracted text
def clean_text(text):
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    # Convert to lowercase
    text = text.lower()
    # Normalize whitespaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# Function to extract skills from text
def extract_skills(text):
    words = set(text.split())
    extracted_skills = words.intersection(developer_skills)
    return list(extracted_skills)

# Endpoint for processing resume
@app.get("/process-resume")
async def process_resume(file_url: str = Query(..., description="URL of the resume file")):
    print("called")
    try:
        # Fetch file from URL
        response = requests.get(file_url)
        if response.status_code != 200:
            return {"error": "Unable to fetch file from URL"}

        content_type = response.headers.get('Content-Type')
        file_bytes = BytesIO(response.content)

        # Determine file type
        if 'pdf' in content_type:
            extracted_text = extract_text_from_pdf(file_bytes.read())
        elif 'image' in content_type:
            image = Image.open(file_bytes)
            extracted_text = extract_text_from_image(image)
        else:
            return {"error": "Unsupported file type. Please upload a PDF or an image."}

        # Clean text
        cleaned_text = clean_text(extracted_text)

        # Extract skills
        skills = extract_skills(cleaned_text)

        # Load model and tokenizer
        model_path = 'D:/ResumeClassifier'
        tokenizer = BertTokenizer.from_pretrained(model_path)
        model = BertForSequenceClassification.from_pretrained(model_path)

        # Model inference
        inputs = tokenizer(cleaned_text, return_tensors="pt", truncation=True, padding=True, max_length=128)
        outputs = model(**inputs)
        predicted_label = torch.argmax(outputs.logits, dim=1).item()

        return {
            "status": "success",
            "skills": skills,
            "role": outputs.logits
        }

    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001) 
