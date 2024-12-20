import os
import re
import pandas as pd
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_selection import SelectKBest, chi2
import spacy

# Ensure required resources are downloaded (for nltk)
import nltk
nltk.download('punkt')
nltk.download('stopwords')

# Folder path containing text files
folder_path = "D:/DevX/model/data/resume/Texts"

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Manually define the labels for each resume (this is just an example)
labels = {
    "Ameer-Muawia-WordpressDeveloper-Junior-Python-Developer-Resume.-pdf.txt": "Intermediate",
    "Ankit_3_yrs_react_node_mindtree.txt": "Intermediate",
    "backend-developer.txt": "Expert",
    "cv.txt": "Expert",
    "diego-paris-resume.txt": "Beginner",
    "Front-End-Developer-Resume-2.txt": "Beginner",
    "full-stack-developer-1561797996.txt": "Intermediate",
    "GIS-Developer-Resume.txt": "Intermediate",
    "Java-Full-Stack-Developer-Resume-Sample-1-1_1.txt": "Expert",
    "Jayesh's%20Resume.txt": "Intermediate",
    "Jillani%20Resume.txt": "Expert",
    "KassSanchezResume-na.txt": "Intermediate",
    "luca-pagliaro-resume.txt": "Expert",
    "Luis_Paredes_Fullstack_Developer_Resume_1.txt": "Expert",
    "Matheswaaran.txt": "Intermediate",
    "mike-resume-frontend-c4a068ab89ec115ba2ea12f8faffadf3.txt": "Expert",
    "Nathan-Friedly-Resume.txt": "Expert",
    "OmkarResume.txt": "Expert",
    "perl-programmer-john-bokma-resume.txt": "Expert",
    "resume_1.txt": "Intermediate",
    "resume_2.txt": "Expert",
    "resume_3.txt": "Intermediate",
    "resume_4.txt": "Intermediate",
    "Resume_5.txt": "Beginner",
    "resume_6.txt": "Expert",
    "resume_7.txt": "Intermediate",
    "resume_8.txt": "Intermediate",
    "resume_9.txt": "Expert",
    "resume_10.txt": "Expert",
    "Resume_11.txt": "Expert",
    "resume_12.txt": "Expert",
    "resume_13.txt": "Expert",
    "resume_14.txt": "Expert",
    "resume_15.txt": "Intermediatet",
    "Resume_16.txt": "Beginner",
    "resume_17.txt": "Expert",
    "resume-arnaud-decolasse-full-stack-developer_1.txt": "Expert",
    "Resume-ca7f6d22.txt": "Beginner",
    "Resume-Of-Node.js-Developer.docx.txt": "Expert",
    "Resume.8f5697a9d759951a54f5.txt": "Intermediate",
    "resume.txt": "Expert",
    "Salim-Dellali-Resume.txt": "Intermediate",
    "Shantanu_Nighot_Resume.txt": "Intermediate",
    "Shubhanshu-Gupta-Resume.txt": "Expert",
    "Software_Engineering_2.txt": "Intermediate",
    "SujitNoronha_Resume_UCSC_NLPMS.txt": "Beginner",
    "Tom_Soderling_Resume.txt": "Expert",
    "zain_khalid.txt": "Beginner",
}

# Function to preprocess a single text file
def preprocess_text(text):
    # Lowercase the text
    text = text.lower()
    # Remove special characters, numbers, and punctuation
    text = re.sub(r"[^a-z\s]", "", text)
    # Tokenize the text
    tokens = word_tokenize(text)
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words]
    return " ".join(tokens)

# Function to extract Skills from the resume
def extract_skills(resume_text):
    skills = ['python', 'java', 'c++', 'sql', 'html', 'css', 'javascript', 'react', 'angular', 'node.js', 'machine learning', 'deep learning']
    skills_found = []
    for skill in skills:
        if skill in resume_text:
            skills_found.append(skill)
    return skills_found

# Function to extract Education from the resume
def extract_education(resume_text):
    education_keywords = ['b.s.', 'bachelor', 'm.s.', 'master', 'ph.d.', 'doctorate', 'university', 'college']
    doc = nlp(resume_text)
    education = []
    for sent in doc.sents:
        if any(keyword in sent.text.lower() for keyword in education_keywords):
            education.append(sent.text.strip())
    return education

# Function to extract Experience from the resume
def extract_experience(resume_text):
    experience_section = re.findall(r"(experience|work experience|employment)(.*?)(education|skills|$)", resume_text, re.DOTALL)
    if experience_section:
        return experience_section[0][1].strip()
    return None

# Load and preprocess all text files in the folder
texts = []
text_labels = []  # List to store labels for each document
extracted_skills = []
extracted_education = []
extracted_experience = []

for filename in os.listdir(folder_path):
    if filename.endswith(".txt"):  # Check for .txt files
        file_path = os.path.join(folder_path, filename)
        with open(file_path, "r", encoding="utf-8", errors="ignore") as file:
            text = file.read()
            preprocessed_text = preprocess_text(text)
            texts.append(preprocessed_text)

            # Assign the label based on the filename or predefined label mapping
            label = labels.get(filename, "Unknown")  # Default to "Unknown" if no label found
            text_labels.append(label)
            
            # Extract skills, education, and experience
            skills = extract_skills(preprocessed_text)
            education = extract_education(preprocessed_text)
            experience = extract_experience(preprocessed_text)
            
            extracted_skills.append(' '.join(skills))  # Store skills as a space-separated string
            extracted_education.append(' | '.join(education))  # Store education details
            extracted_experience.append(experience)  # Store experience section

# Concatenate skills, education, and experience for TF-IDF
all_extracted_texts = [' '.join([str(skills), str(education), str(experience) or ""]) for skills, education, experience in zip(extracted_skills, extracted_education, extracted_experience)]


# Convert the extracted features into numerical features using TF-IDF
vectorizer = TfidfVectorizer(max_features=500)
X = vectorizer.fit_transform(all_extracted_texts).toarray()

# Convert labels to numerical values (for classification)
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(text_labels)  # This will convert the labels to numerical values

# Apply feature selection using SelectKBest
selector = SelectKBest(chi2, k=100)  # Select the top 100 features
X_selected = selector.fit_transform(X, y)  # `y` is the labels (target)

# Create a DataFrame to save the selected features and labels together
df_selected = pd.DataFrame(X_selected, columns=vectorizer.get_feature_names_out()[:100])  # Adjust the column names
df_selected['label'] = y

# Save the selected features and labels to a CSV file
df_selected.to_csv('selected_features_tfidf_matrix.csv', index=False)

# Create a DataFrame for the extracted information (skills, education, experience)
df_extracted = pd.DataFrame({
    'filename': os.listdir(folder_path),
    'skills': extracted_skills,
    'education': extracted_education,
    'experience': extracted_experience,
    'label': text_labels
})

# Save the extracted information to a CSV file
df_extracted.to_csv('extracted_resume_info.csv', index=False)

print("Labeled and selected TF-IDF matrix saved to 'selected_features_tfidf_matrix.csv'")
print("Extracted skills, education, and experience saved to 'extracted_resume_info.csv'")
