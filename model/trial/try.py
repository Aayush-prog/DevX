import os
import re
import glob
import subprocess
import spacy
import pandas as pd
from PIL import Image
import pytesseract  # Add Tesseract for OCR
from pdf2image import convert_from_path  # To convert PDF to images for OCR

# Load spaCy NLP model
nlp = spacy.load("en_core_web_sm")

class ResumeParser:
    def __init__(self, output_csv='parsed_results.csv'):
        self.output_csv = output_csv
        self.data = []

    def parse_resumes(self, folder="data/resume/pdfs"):
        # Find all resumes in the specified folder
        file_patterns = ["*.doc", "*.docx", "*.pdf", "*.txt"]
        files = [f for pattern in file_patterns for f in glob.glob(os.path.join(folder, pattern))]
        print(f"Found {len(files)} resumes.")

        for file in files:
            print(f"Processing: {file}")
            content, extension = self.read_file(file)
            if content:
                info = self.extract_info(content)
                info['file_name'] = file
                self.data.append(info)
            else:
                print(f"Failed to read: {file}")

        # Save to CSV
        self.save_to_csv()

    def read_file(self, file_name):
        extension = file_name.split(".")[-1].lower()
        content = None
        try:
            if extension == "txt":
                with open(file_name, 'r', encoding='utf-8') as f:
                    content = f.read()
            elif extension == "doc":
                content = subprocess.Popen(['antiword', file_name], stdout=subprocess.PIPE).communicate()[0].decode('utf-8')
            elif extension == "docx":
                content = subprocess.run(['docx2txt', file_name, '-'], capture_output=True, text=True).stdout
            elif extension == "pdf":
                content = self.extract_pdf_text(file_name)
        except Exception as e:
            print(f"Error reading {file_name}: {e}")
        return content, extension

    def extract_pdf_text(self, file_name):
        # Convert PDF pages to images
        try:
            images = convert_from_path(file_name)
            ocr_text = ""
            for image in images:
                # Use Tesseract to extract text from each image
                ocr_text += pytesseract.image_to_string(image)
            return ocr_text
        except Exception as e:
            print(f"Error performing OCR on {file_name}: {e}")
            return None

    def extract_info(self, text):
        # Run spaCy NLP pipeline
        doc = nlp(text)

        # Extract information
        # name = self.extract_name(doc)
        # emails = self.extract_emails(text)
        # phones = self.extract_phone_numbers(text)
        skills = self.extract_skills(text)
        projects = self.extract_projects(text)
        experience = self.extract_experience(text)
        education = self.extract_education(text)
        certificates = self.extract_certificates(text)

        return {
            # "name": name,
            # "emails": ", ".join(emails),
            # "phones": ", ".join(phones),
            "skills": ", ".join(skills),
            "projects": projects,
            "experience": experience,
            "education": education,
            "certificates": certificates
        }

    # def extract_name(self, doc):
    #     # Extract NAME from entities
    #     for ent in doc.ents:
    #         if ent.label_ == "PERSON":
    #             return ent.text
    #     return "Not Found"

    # def extract_emails(self, text):
    #     # Regex to extract emails
    #     return re.findall(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text)

    # def extract_phone_numbers(self, text):
    #     # Regex to extract phone numbers
    #     return re.findall(r'\+?\d[\d\s()-]{7,}\d', text)

    def extract_skills(self, text):
        # More refined skills extraction using predefined list of keywords
        skills_keywords = [
            "Python", "Java", "C++", "SQL", "JavaScript", "HTML", "CSS", "Machine Learning", "Data Analysis",
            "Django", "React", "Node.js", "Git", "Docker", "Kubernetes", "AWS", "Azure", "Tableau", "Excel", "React Native", "Angular","CI/CD","Android","Firebase","Swift","GIS","Flutter"
        ]
        return [skill for skill in skills_keywords if skill.lower() in text.lower()]

    def extract_projects(self, text):
        # Looking for project-related descriptions with common keywords
        project_keywords = ["project", "built", "developed", "worked on", "created", "designed", "implemented","engineered"]
        projects = []
        sentences = text.split('.')
        for sentence in sentences:
            if any(keyword in sentence.lower() for keyword in project_keywords):
                projects.append(sentence.strip())
        return " | ".join(projects) if projects else "Not Found"

    def extract_experience(self, text):
        # More refined job experience extraction with job titles
        experience_keywords = ["worked as", "position", "role", "job title", "experience", "senior", "junior","associate", "developer","engineer","intern"]
        experience = []
        sentences = text.split('.')
        for sentence in sentences:
            if any(keyword in sentence.lower() for keyword in experience_keywords):
                experience.append(sentence.strip())
        return " | ".join(experience) if experience else "Not Found"

    def extract_certificates(self, text):
        # Keywords related to certificates
        certificate_keywords = [
            "Certified in", "Google","IBM", "Certified", "AWS Certified", "PMP", "Google Analytics Certified", "Microsoft Certified",
            "CompTIA", "Cisco Certified", "Cisco", "Certified ScrumMaster", "Project Management Professional","Coursera","Udemy","MongoDB University"
        ]
        
        certificates = []
        sentences = text.split('.')
        for sentence in sentences:
            if any(keyword.lower() in sentence.lower() for keyword in certificate_keywords):
                certificates.append(sentence.strip())
        return " | ".join(certificates) if certificates else "Not Found"
    
    def extract_education(self, text):
        # Looking for specific degrees and institutions
        degrees = ["Bachelors", "Bachelor's Degree", "Master's Degree", "Masters", "PhD", "Diploma", "Certificate", "Associate's Degree","Master","Bachelor","Computer Science","Information Technology", "Technical Degree"]
        education = []
        for degree in degrees:
            if degree.lower() in text.lower():
                education.append(degree)
        return ", ".join(education) if education else "Not Found"

    def save_to_csv(self):
        df = pd.DataFrame(self.data)
        df.to_csv(self.output_csv, index=False)
        print(f"Results saved to {self.output_csv}")

# Main function
if __name__ == "__main__":
    parser = ResumeParser()
    parser.parse_resumes()
